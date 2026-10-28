import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import {
  isSlotFreeAtomic,
  generateBookingReference,
  timeToMinutes,
  minutesToTime,
  getSettingsMap,
  isDateInPast,
} from '@/lib/bookingEngine';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      notes,
      serviceIds,
      appointmentDate,
      startTime,
    } = body;

    // 1. Validate customer details
    if (!customerName || typeof customerName !== 'string' || customerName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid full name.' },
        { status: 400 }
      );
    }

    if (!customerPhone || typeof customerPhone !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Phone number is required.' },
        { status: 400 }
      );
    }

    // Clean and validate BD phone number format
    const cleanedPhone = customerPhone.replace(/[\s-]/g, '');
    const bdPhoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
    if (!bdPhoneRegex.test(cleanedPhone)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid Bangladeshi phone number (e.g., 01780625295).' },
        { status: 400 }
      );
    }

    // 2. Validate services
    if (!Array.isArray(serviceIds) || serviceIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Please select at least one service.' },
        { status: 400 }
      );
    }

    // 3. Validate date & time
    if (!appointmentDate || !/^\d{4}-\d{2}-\d{2}$/.test(appointmentDate)) {
      return NextResponse.json(
        { success: false, error: 'Please select a valid appointment date.' },
        { status: 400 }
      );
    }

    if (isDateInPast(appointmentDate)) {
      return NextResponse.json(
        { success: false, error: 'Cannot book appointments for past dates.' },
        { status: 400 }
      );
    }

    if (!startTime || !/^\d{2}:\d{2}$/.test(startTime)) {
      return NextResponse.json(
        { success: false, error: 'Please select an appointment time slot.' },
        { status: 400 }
      );
    }

    // 4. Fetch selected services from DB (guaranteeing fresh pricing)
    const services = await prisma.service.findMany({
      where: {
        id: { in: serviceIds },
        isActive: true,
      },
    });

    if (services.length === 0) {
      return NextResponse.json(
        { success: false, error: 'None of the selected services could be found or are active.' },
        { status: 400 }
      );
    }

    const totalDuration = services.reduce((acc, s) => acc + s.durationMinutes, 0);
    const totalPrice = services.reduce((acc, s) => acc + s.price, 0);

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = startMinutes + totalDuration;
    const endTime = minutesToTime(endMinutes);

    // Snapshot selected services so future price changes do not modify this booking
    const servicesSnapshot = JSON.stringify(
      services.map((s) => ({
        id: s.id,
        name: s.name,
        price: s.price,
        durationMinutes: s.durationMinutes,
        category: s.category,
      }))
    );

    const settings = await getSettingsMap();
    const bufferTime = parseInt(settings.buffer_time || '10', 10);
    const autoConfirm = settings.auto_confirm === 'true';
    const initialStatus = autoConfirm ? 'CONFIRMED' : 'PENDING';

    // 5. ATOMIC DATABASE TRANSACTION
    // Check availability inside the transaction to prevent concurrent double-booking race condition
    const result = await prisma.$transaction(async (tx) => {
      const isFree = await isSlotFreeAtomic(
        tx,
        appointmentDate,
        startTime,
        endTime,
        bufferTime
      );

      if (!isFree) {
        throw new Error('SLOT_OCCUPIED');
      }

      const reference = generateBookingReference(appointmentDate);

      const appointment = await tx.appointment.create({
        data: {
          reference,
          customerName: customerName.trim(),
          customerPhone: cleanedPhone,
          customerEmail: customerEmail?.trim() || null,
          notes: notes?.trim() || null,
          appointmentDate,
          startTime,
          endTime,
          totalDuration,
          totalPrice,
          servicesSnapshot,
          status: initialStatus,
        },
      });

      return appointment;
    });

    return NextResponse.json({
      success: true,
      booking: {
        id: result.id,
        reference: result.reference,
        customerName: result.customerName,
        customerPhone: result.customerPhone,
        customerEmail: result.customerEmail,
        notes: result.notes,
        appointmentDate: result.appointmentDate,
        startTime: result.startTime,
        endTime: result.endTime,
        totalDuration: result.totalDuration,
        totalPrice: result.totalPrice,
        status: result.status,
        services: JSON.parse(result.servicesSnapshot),
        createdAt: result.createdAt,
      },
    });
  } catch (error: any) {
    if (error?.message === 'SLOT_OCCUPIED') {
      return NextResponse.json(
        {
          success: false,
          error: 'This time slot was just reserved by another client. Please select another convenient time.',
        },
        { status: 409 }
      );
    }

    console.error('Booking creation error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred while scheduling your appointment. Please try again.' },
      { status: 500 }
    );
  }
}
