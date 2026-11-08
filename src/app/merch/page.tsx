import React from 'react';
import type { Metadata } from 'next';
import { getSettingsMap } from '@/lib/bookingEngine';
import { DEFAULT_SETTINGS } from '@/lib/constants';
import MerchPageClient from '@/components/barber/MerchPageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Salon Merchandise & Grooming Store — AIYAN HAIR CUTTING SALON',
  description:
    'Exclusive barber-approved styling clays, volumizing powders, organic beard oils, and soothing aftershave balms. Order directly with WhatsApp home delivery in Chattogram.',
  openGraph: {
    title: 'Salon Merchandise & Grooming Store — AIYAN HAIR CUTTING SALON',
    description:
      'Buy authentic barber styling and skincare products online. Direct WhatsApp checkout.',
  },
};

export default async function MerchPage() {
  let settings = DEFAULT_SETTINGS;

  try {
    const dbSettings = await getSettingsMap();
    if (dbSettings) {
      settings = dbSettings;
    }
  } catch (error) {
    console.warn('Database offline or unconfigured on host; utilizing pre-configured settings.');
  }

  const salonName = settings.salon_name || 'AIYAN HAIR CUTTING SALON';
  const salonPhone = settings.phone || '01780625295';
  const salonAddress = settings.address || 'Housing Colony Road, Steel Mill, North Patenga, Chattogram, Bangladesh';

  return (
    <MerchPageClient
      salonName={salonName}
      salonPhone={salonPhone}
      salonAddress={salonAddress}
    />
  );
}
