import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { reference: string } }
) {
  try {
    const { reference } = params;

    if (!reference) {
      return NextResponse.json(
        { success: false, error: 'Booking reference is required' },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.findUnique({
      where: { reference: reference.toUpperCase().trim() },
    });

    if (!appointment) {
      return NextResponse.json(
        { success: false, error: 'No appointment found with this reference' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      booking: {
        reference: appointment.reference,
        customerName: appointment.customerName,
        customerPhone: appointment.customerPhone,
        appointmentDate: appointment.appointmentDate,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        totalDuration: appointment.totalDuration,
        totalPrice: appointment.totalPrice,
        status: appointment.status,
        services: JSON.parse(appointment.servicesSnapshot),
        notes: appointment.notes,
        createdAt: appointment.createdAt,
      },
    });
  } catch (error) {
    console.error('Error fetching booking reference:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve booking information' },
      { status: 500 }
    );
  }
}
