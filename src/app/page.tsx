import React from 'react';
import prisma from '@/lib/prisma';
import { getSettingsMap } from '@/lib/bookingEngine';
import { DEFAULT_SERVICES, DEFAULT_SETTINGS } from '@/lib/constants';
import BarberHomeClient from '@/components/barber/BarberHomeClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let services = DEFAULT_SERVICES;
  let settings = DEFAULT_SETTINGS;

  try {
    const [dbServices, dbSettings] = await Promise.all([
      prisma.service.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      }),
      getSettingsMap(),
    ]);

    if (dbServices && dbServices.length > 0) {
      services = dbServices as any;
    }
    if (dbSettings) {
      settings = dbSettings;
    }
  } catch (error) {
    console.warn('Database offline or unconfigured on host; utilizing pre-configured luxury services & settings.');
  }

  return (
    <BarberHomeClient
      initialServices={services}
      settings={settings}
    />
  );
}
