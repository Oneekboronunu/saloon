import React from 'react';
import prisma from '@/lib/prisma';
import { getSettingsMap } from '@/lib/bookingEngine';
import BarberHomeClient from '@/components/barber/BarberHomeClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [services, settings] = await Promise.all([
    prisma.service.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }),
    getSettingsMap(),
  ]);

  return (
    <BarberHomeClient
      initialServices={services}
      settings={settings}
    />
  );
}
