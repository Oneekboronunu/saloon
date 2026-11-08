import React from 'react';
import type { Metadata } from 'next';
import { getSettingsMap } from '@/lib/bookingEngine';
import { DEFAULT_SETTINGS } from '@/lib/constants';
import MerchPageClient from '@/components/barber/MerchPageClient';

// Cache at Vercel Edge CDN for instant load times
export const revalidate = 60;

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
    const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 800));
    const result = await Promise.race([getSettingsMap(), timeout]);
    if (result && typeof result === 'object') {
      settings = result as any;
    }
  } catch (error) {
    console.warn('Utilizing pre-configured luxury settings for instant response.');
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
