import { NextRequest, NextResponse } from 'next/server';
import { getAvailabilityForDate } from '@/lib/bookingEngine';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const durationParam = searchParams.get('duration');

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { success: false, error: 'Valid date parameter (YYYY-MM-DD) is required.' },
        { status: 400 }
      );
    }

    const duration = durationParam ? parseInt(durationParam, 10) : 30;
    if (isNaN(duration) || duration <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid duration in minutes is required.' },
        { status: 400 }
      );
    }

    const availability = await getAvailabilityForDate(date, duration);

    return NextResponse.json({
      success: true,
      availability,
    });
  } catch (error) {
    console.error('Availability API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to compute availability' },
      { status: 500 }
    );
  }
}
