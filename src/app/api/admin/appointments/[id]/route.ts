import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import {
  isSlotFreeAtomic,
  timeToMinutes,
  minutesToTime,
  getSettingsMap,
} from '@/lib/bookingEngine';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { action, status, newDate, newStartTime, reason } = body;

    const existing = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // 1. Reschedule action
    if (action === 'RESCHEDULE') {
      if (!newDate || !newStartTime) {
        return NextResponse.json(
          { success: false, error: 'New date and start time are required for rescheduling.' },
          { status: 400 }
        );
      }

      const totalDuration = existing.totalDuration;
      const startMinutes = timeToMinutes(newStartTime);
      const endMinutes = startMinutes + totalDuration;
      const newEndTime = minutesToTime(endMinutes);

      const settings = await getSettingsMap();
      const bufferTime = parseInt(settings.buffer_time || '10', 10);

      // Check slot availability
      const updated = await prisma.$transaction(async (tx) => {
        // Find if any other active appointment overlaps
        const conflicting = await tx.appointment.findFirst({
          where: {
            id: { not: id },
            appointmentDate: newDate,
            status: { in: ['PENDING', 'CONFIRMED'] },
          },
        });

        // Use atomic slot check
        const isFree = await isSlotFreeAtomic(
          tx,
          newDate,
          newStartTime,
          newEndTime,
          bufferTime
        );

        if (!isFree) {
          throw new Error('SLOT_OCCUPIED');
        }

        return tx.appointment.update({
          where: { id },
          data: {
            appointmentDate: newDate,
            startTime: newStartTime,
            endTime: newEndTime,
            status: 'CONFIRMED',
          },
        });
      });

      return NextResponse.json({
        success: true,
        appointment: {
          ...updated,
          services: JSON.parse(updated.servicesSnapshot),
        },
      });
    }

    // 2. Status update action (CONFIRM, CANCEL, COMPLETE)
    const validStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
    const newStatus = status || action;

    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json(
        { success: false, error: `Invalid status: ${newStatus}` },
        { status: 400 }
      );
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        status: newStatus,
        cancellationReason: newStatus === 'CANCELLED' ? reason || 'Cancelled by admin' : existing.cancellationReason,
      },
    });

    return NextResponse.json({
      success: true,
      appointment: {
        ...updated,
        services: JSON.parse(updated.servicesSnapshot),
      },
    });
  } catch (error: any) {
    if (error?.message === 'SLOT_OCCUPIED') {
      return NextResponse.json(
        { success: false, error: 'The selected rescheduled slot is already occupied.' },
        { status: 409 }
      );
    }

    console.error('Update appointment error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}
