import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { getSettingsMap } from '@/lib/bookingEngine';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await getSettingsMap();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Fetch settings error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const allowedKeys = [
      'salon_name',
      'salon_tagline',
      'phone',
      'whatsapp',
      'address',
      'map_url',
      'opening_time_weekday',
      'closing_time_weekday',
      'opening_time_weekend',
      'closing_time_weekend',
      'closed_days',
      'slot_interval',
      'buffer_time',
      'booking_window_days',
      'auto_confirm',
      'currency',
      'timezone',
    ];

    for (const [key, value] of Object.entries(body)) {
      if (allowedKeys.includes(key)) {
        await prisma.businessSetting.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) },
        });
      }
    }

    const updated = await getSettingsMap();
    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
