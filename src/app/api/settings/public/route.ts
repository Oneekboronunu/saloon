import { NextResponse } from 'next/server';
import { getSettingsMap } from '@/lib/bookingEngine';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await getSettingsMap();
    return NextResponse.json({
      success: true,
      settings: {
        salon_name: settings.salon_name || 'GOLDEN CUTS',
        salon_tagline: settings.salon_tagline || 'YOUR STYLE. YOUR SIGNATURE.',
        phone: settings.phone || '01780625295',
        whatsapp: settings.whatsapp || '8801780625295',
        address: settings.address || 'House 42, Road 27 (Old), Dhanmondi, Dhaka 1209, Bangladesh',
        map_url: settings.map_url || 'https://maps.google.com/?q=Dhanmondi+27+Dhaka',
        opening_time_weekday: settings.opening_time_weekday || '10:00',
        closing_time_weekday: settings.closing_time_weekday || '22:00',
        opening_time_weekend: settings.opening_time_weekend || '14:00',
        closing_time_weekend: settings.closing_time_weekend || '22:00',
        currency: settings.currency || '৳',
        timezone: settings.timezone || 'Asia/Dhaka',
      },
    });
  } catch (error) {
    console.error('Public settings error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve public settings' },
      { status: 500 }
    );
  }
}
