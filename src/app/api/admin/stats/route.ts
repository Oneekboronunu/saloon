import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { memoryStore } from '@/lib/memoryStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const dhakaNow = new Date(utc + 3600000 * 6);
    const todayStr = dhakaNow.toISOString().split('T')[0];

    try {
      const [
        totalToday,
        upcomingCount,
        pendingCount,
        confirmedCount,
        completedCount,
        cancelledCount,
        revenueResult,
        recentBookings,
      ] = await Promise.all([
        prisma.appointment.count({ where: { appointmentDate: todayStr } }),
        prisma.appointment.count({
          where: {
            appointmentDate: { gte: todayStr },
            status: { in: ['PENDING', 'CONFIRMED'] },
          },
        }),
        prisma.appointment.count({ where: { status: 'PENDING' } }),
        prisma.appointment.count({ where: { status: 'CONFIRMED' } }),
        prisma.appointment.count({ where: { status: 'COMPLETED' } }),
        prisma.appointment.count({ where: { status: 'CANCELLED' } }),
        prisma.appointment.aggregate({
          where: { status: { in: ['CONFIRMED', 'COMPLETED'] } },
          _sum: { totalPrice: true },
        }),
        prisma.appointment.findMany({
          take: 8,
          orderBy: { createdAt: 'desc' },
        }),
      ]);

      return NextResponse.json({
        success: true,
        stats: {
          totalToday,
          upcomingCount,
          pendingCount,
          confirmedCount,
          completedCount,
          cancelledCount,
          totalRevenue: revenueResult._sum.totalPrice || 0,
        },
        recentBookings: recentBookings.map((b) => ({
          ...b,
          services: JSON.parse(b.servicesSnapshot),
        })),
      });
    } catch {
      // Memory fallback
      const apps = memoryStore.getAppointments();
      return NextResponse.json({
        success: true,
        stats: {
          totalToday: apps.filter((a) => a.appointmentDate === todayStr).length,
          upcomingCount: apps.filter((a) => a.appointmentDate >= todayStr && ['PENDING', 'CONFIRMED'].includes(a.status)).length,
          pendingCount: apps.filter((a) => a.status === 'PENDING').length,
          confirmedCount: apps.filter((a) => a.status === 'CONFIRMED').length,
          completedCount: apps.filter((a) => a.status === 'COMPLETED').length,
          cancelledCount: apps.filter((a) => a.status === 'CANCELLED').length,
          totalRevenue: apps.filter((a) => ['CONFIRMED', 'COMPLETED'].includes(a.status)).reduce((s, a) => s + a.totalPrice, 0),
        },
        recentBookings: apps.slice(0, 8).map((b) => ({
          ...b,
          services: JSON.parse(b.servicesSnapshot),
        })),
      });
    }
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve stats' },
      { status: 500 }
    );
  }
}
