import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import {
  isSlotFreeAtomic,
  isSlotFreeMemory,
  timeToMinutes,
  minutesToTime,
  getSettingsMap,
} from '@/lib/bookingEngine';
import { memoryStore } from '@/lib/memoryStore';

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

    // Reschedule action
    if (action === 'RESCHEDULE') {
      if (!newDate || !newStartTime) {
        return NextResponse.json(
          { success: false, error: 'New date and start time are required for rescheduling.' },
          { status: 400 }
        );
      }

      const settings = await getSettingsMap();
      const bufferTime = parseInt(settings.buffer_time || '10', 10);

      try {
        const existing = await prisma.appointment.findUnique({ where: { id } });
        if (existing) {
          const totalDuration = existing.totalDuration;
          const startMinutes = timeToMinutes(newStartTime);
          const endMinutes = startMinutes + totalDuration;
          const newEndTime = minutesToTime(endMinutes);

          const updated = await prisma.$transaction(async (tx) => {
            const isFree = await isSlotFreeAtomic(tx, newDate, newStartTime, newEndTime, bufferTime);
            if (!isFree) throw new Error('SLOT_OCCUPIED');

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
            appointment: { ...updated, services: JSON.parse(updated.servicesSnapshot) },
          });
        }
      } catch (dbErr: any) {
        if (dbErr?.message === 'SLOT_OCCUPIED') throw dbErr;
      }

      // MemoryStore fallback
      const memApp = memoryStore.getAppointments().find((a) => a.id === id);
      if (!memApp) {
        return NextResponse.json({ success: false, error: 'Appointment not found' }, { status: 404 });
      }
      const totalDuration = memApp.totalDuration;
      const startMinutes = timeToMinutes(newStartTime);
      const endMinutes = startMinutes + totalDuration;
      const newEndTime = minutesToTime(endMinutes);

      const isFree = isSlotFreeMemory(newDate, newStartTime, newEndTime, bufferTime);
      if (!isFree) {
        return NextResponse.json({ success: false, error: 'The selected slot is already occupied.' }, { status: 409 });
      }

      const updated = memoryStore.rescheduleAppointment(id, newDate, newStartTime, newEndTime);
      return NextResponse.json({
        success: true,
        appointment: { ...updated, services: JSON.parse(updated!.servicesSnapshot) },
      });
    }

    // Status update (CONFIRM, CANCEL, COMPLETE)
    const validStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
    const newStatus = status || action;

    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json(
        { success: false, error: `Invalid status: ${newStatus}` },
        { status: 400 }
      );
    }

    try {
      const updated = await prisma.appointment.update({
        where: { id },
        data: {
          status: newStatus,
          cancellationReason: newStatus === 'CANCELLED' ? reason || 'Cancelled by admin' : undefined,
        },
      });

      return NextResponse.json({
        success: true,
        appointment: { ...updated, services: JSON.parse(updated.servicesSnapshot) },
      });
    } catch {
      // Memory fallback
      const updated = memoryStore.updateAppointmentStatus(id, newStatus, reason);
      if (!updated) {
        return NextResponse.json({ success: false, error: 'Appointment not found' }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        appointment: { ...updated, services: JSON.parse(updated.servicesSnapshot) },
      });
    }
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
