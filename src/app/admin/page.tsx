import React from 'react';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { getSettingsMap } from '@/lib/bookingEngine';
import { memoryStore } from '@/lib/memoryStore';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const dhakaNow = new Date(utc + 3600000 * 6);
  const todayStr = dhakaNow.toISOString().split('T')[0];

  let initialStats = {
    totalToday: 0,
    upcomingCount: 0,
    pendingCount: 0,
    confirmedCount: 0,
    completedCount: 0,
    cancelledCount: 0,
    totalRevenue: 0,
  };

  let initialRecent: any[] = [];
  let settings = await getSettingsMap();

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
        take: 20,
        orderBy: [{ appointmentDate: 'desc' }, { startTime: 'desc' }],
      }),
    ]);

    initialStats = {
      totalToday,
      upcomingCount,
      pendingCount,
      confirmedCount,
      completedCount,
      cancelledCount,
      totalRevenue: revenueResult._sum.totalPrice || 0,
    };

    initialRecent = recentBookings.map((b) => ({
      ...b,
      services: JSON.parse(b.servicesSnapshot),
      createdAt: b.createdAt.toISOString(),
    }));
  } catch (error) {
    // MemoryStore fallback
    const memApps = memoryStore.getAppointments();
    initialStats = {
      totalToday: memApps.filter((a) => a.appointmentDate === todayStr).length,
      upcomingCount: memApps.filter((a) => a.appointmentDate >= todayStr && ['PENDING', 'CONFIRMED'].includes(a.status)).length,
      pendingCount: memApps.filter((a) => a.status === 'PENDING').length,
      confirmedCount: memApps.filter((a) => a.status === 'CONFIRMED').length,
      completedCount: memApps.filter((a) => a.status === 'COMPLETED').length,
      cancelledCount: memApps.filter((a) => a.status === 'CANCELLED').length,
      totalRevenue: memApps.filter((a) => ['CONFIRMED', 'COMPLETED'].includes(a.status)).reduce((s, a) => s + a.totalPrice, 0),
    };
    initialRecent = memApps.map((a) => ({
      ...a,
      services: JSON.parse(a.servicesSnapshot),
      createdAt: a.createdAt.toISOString(),
    }));
  }

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
