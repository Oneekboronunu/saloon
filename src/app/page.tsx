import React from 'react';
import prisma from '@/lib/prisma';
import { getSettingsMap } from '@/lib/bookingEngine';
import { DEFAULT_SERVICES, DEFAULT_SETTINGS } from '@/lib/constants';
import BarberHomeClient from '@/components/barber/BarberHomeClient';

// Enable Incremental Static Regeneration (ISR) so Vercel caches responses at the Mumbai Edge CDN for instant <50ms load times
export const revalidate = 60;

export default async function HomePage() {
  let services = DEFAULT_SERVICES;
  let settings = DEFAULT_SETTINGS;

  try {
    const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 800));
    const dataPromise = Promise.all([
      prisma.service.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      }),
      getSettingsMap(),
    ]);

    const result = await Promise.race([dataPromise, timeout]);

    if (result && Array.isArray(result)) {
      const [dbServices, dbSettings] = result;
      if (dbServices && dbServices.length > 0) {
        services = dbServices as any;
      }
      if (dbSettings) {
        settings = dbSettings;
      }
    }
  } catch (error) {
    console.warn('Utilizing pre-configured luxury services & settings for instant response.');
  }

  return (
    <BarberHomeClient
      initialServices={services}
      settings={settings}
    />
  );
}
