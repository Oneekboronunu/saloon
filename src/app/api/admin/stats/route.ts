import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Dhaka today's date string
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const dhakaNow = new Date(utc + 3600000 * 6);
    const todayStr = dhakaNow.toISOString().split('T')[0];

    // Query metrics
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
      // Bookings today
      prisma.appointment.count({
        where: { appointmentDate: todayStr },
      }),
      // Upcoming bookings
      prisma.appointment.count({
        where: {
          appointmentDate: { gte: todayStr },
          status: { in: ['PENDING', 'CONFIRMED'] },
        },
      }),
      // Pending
      prisma.appointment.count({
        where: { status: 'PENDING' },
      }),
      // Confirmed
      prisma.appointment.count({
        where: { status: 'CONFIRMED' },
      }),
      // Completed
      prisma.appointment.count({
        where: { status: 'COMPLETED' },
      }),
      // Cancelled
      prisma.appointment.count({
        where: { status: 'CANCELLED' },
      }),
      // Total Revenue from completed or confirmed appointments
      prisma.appointment.aggregate({
        where: { status: { in: ['CONFIRMED', 'COMPLETED'] } },
        _sum: { totalPrice: true },
      }),
      // Recent bookings
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
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve stats' },
      { status: 500 }
    );
  }
}
