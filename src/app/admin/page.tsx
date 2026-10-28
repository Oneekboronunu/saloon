import React from 'react';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { getSettingsMap } from '@/lib/bookingEngine';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  // Current day in Dhaka
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const dhakaNow = new Date(utc + 3600000 * 6);
  const todayStr = dhakaNow.toISOString().split('T')[0];

  const [
    totalToday,
    upcomingCount,
    pendingCount,
    confirmedCount,
    completedCount,
    cancelledCount,
    revenueResult,
    recentBookings,
    settings,
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
      take: 20,
      orderBy: [{ appointmentDate: 'desc' }, { startTime: 'desc' }],
    }),
    getSettingsMap(),
  ]);

  const initialStats = {
    totalToday,
    upcomingCount,
    pendingCount,
    confirmedCount,
    completedCount,
    cancelledCount,
    totalRevenue: revenueResult._sum.totalPrice || 0,
  };

  const initialRecent = recentBookings.map((b) => ({
    ...b,
    services: JSON.parse(b.servicesSnapshot),
    createdAt: b.createdAt.toISOString(),
  }));

  return (
    <AdminDashboardClient
      initialStats={initialStats}
      initialRecent={initialRecent}
      adminUser={{
        id: session.id,
        email: session.email,
        name: session.name,
        role: session.role,
      }}
      initialSettings={settings}
    />
  );
}
