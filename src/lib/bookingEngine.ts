import prisma from './prisma';

export interface TimeSlot {
  time: string; // "10:00"
  displayTime: string; // "10:00 AM"
  available: boolean;
  reason?: string;
}

export interface DayAvailability {
  date: string; // "YYYY-MM-DD"
  isClosed: boolean;
  closedReason?: string;
  slots: TimeSlot[];
  availableCount: number;
}

// Convert "HH:mm" to minutes from midnight
export function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

// Convert minutes from midnight to "HH:mm"
export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

// Convert "HH:mm" to "hh:mm AM/PM"
export function formatDisplayTime(timeStr: string): string {
  const [h, m] = timeStr.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayHour = h % 12 || 12;
  return `${displayHour.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
}

// Helper to get business settings as a key-value object
export async function getSettingsMap(): Promise<Record<string, string>> {
  const settings = await prisma.businessSetting.findMany();
  const map: Record<string, string> = {
    salon_name: 'GOLDEN CUTS',
    phone: '01780625295',
    whatsapp: '8801780625295',
    address: 'House 42, Road 27 (Old), Dhanmondi, Dhaka 1209, Bangladesh',
    opening_time_weekday: '10:00',
    closing_time_weekday: '22:00',
    opening_time_weekend: '14:00',
    closing_time_weekend: '22:00',
    closed_days: '',
    slot_interval: '30',
    buffer_time: '10',
    booking_window_days: '30',
    auto_confirm: 'true',
    currency: '৳',
    timezone: 'Asia/Dhaka',
  };

  for (const s of settings) {
    map[s.key] = s.value;
  }
  return map;
}

// Check if a given date is in the past relative to current time in Asia/Dhaka
export function isDateInPast(dateStr: string): boolean {
  // Current time in Asia/Dhaka is UTC+6
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const dhakaTime = new Date(utc + 3600000 * 6);
  
  const todayStr = dhakaTime.toISOString().split('T')[0];
  return dateStr < todayStr;
}

// Get day of week: 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday
export function getDayOfWeek(dateStr: string): number {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.getDay();
}

/**
 * Calculates available slots for a given date and service duration.
 * An appointment requiring `durationMinutes` needs a contiguous block of time
 * from startTime to (startTime + durationMinutes) that does not overlap any active booking
 * (including buffer_time).
 */
export async function getAvailabilityForDate(
  dateStr: string,
  totalDurationMinutes: number
): Promise<DayAvailability> {
  const settings = await getSettingsMap();

  // 1. Check if past date
  if (isDateInPast(dateStr)) {
    return {
      date: dateStr,
      isClosed: true,
      closedReason: 'This date has already passed.',
      slots: [],
      availableCount: 0,
    };
  }

  // 2. Check booking window
  const bookingWindowDays = parseInt(settings.booking_window_days || '30', 10);
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const dhakaNow = new Date(utc + 3600000 * 6);
  const maxDate = new Date(dhakaNow.getTime() + bookingWindowDays * 24 * 3600000);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  if (dateStr > maxDateStr) {
    return {
      date: dateStr,
      isClosed: true,
      closedReason: `Booking is only open up to ${bookingWindowDays} days in advance.`,
      slots: [],
      availableCount: 0,
    };
  }

  // 3. Check closed days (e.g. "5" for Friday or custom)
  const dayOfWeek = getDayOfWeek(dateStr);
  const closedDays = (settings.closed_days || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map(Number);

  if (closedDays.includes(dayOfWeek)) {
    return {
      date: dateStr,
      isClosed: true,
      closedReason: 'The salon is closed on this day.',
      slots: [],
      availableCount: 0,
    };
  }

  // 4. Determine opening & closing hours for this day
  // In Bangladesh, Friday is day 5, Saturday is day 6.
  const isWeekend = dayOfWeek === 5; // Friday
  const openTime = isWeekend
    ? settings.opening_time_weekend || '14:00'
    : settings.opening_time_weekday || '10:00';
  const closeTime = isWeekend
    ? settings.closing_time_weekend || '22:00'
    : settings.closing_time_weekday || '22:00';

  const openMinutes = timeToMinutes(openTime);
  const closeMinutes = timeToMinutes(closeTime);
  const slotInterval = parseInt(settings.slot_interval || '30', 10);
  const bufferTime = parseInt(settings.buffer_time || '10', 10);

  // 5. Fetch all active bookings on this date (PENDING or CONFIRMED)
  const existingBookings = await prisma.appointment.findMany({
    where: {
      appointmentDate: dateStr,
      status: { in: ['PENDING', 'CONFIRMED'] },
    },
    select: {
      id: true,
      startTime: true,
      endTime: true,
      totalDuration: true,
    },
  });

  const bookedIntervals = existingBookings.map((b) => ({
    start: timeToMinutes(b.startTime),
    // add buffer time to booked end time so client cuts don't crash into each other
    end: timeToMinutes(b.endTime) + bufferTime,
  }));

  // Current time in Dhaka to prevent booking past times today
  const todayStr = dhakaNow.toISOString().split('T')[0];
  const isToday = dateStr === todayStr;
  const currentDhakaMinutes = dhakaNow.getHours() * 60 + dhakaNow.getMinutes();

  // 6. Generate candidate slots
  const slots: TimeSlot[] = [];
  let availableCount = 0;

  for (let m = openMinutes; m + totalDurationMinutes <= closeMinutes; m += slotInterval) {
    const slotStartTime = minutesToTime(m);
    const slotEndTime = minutesToTime(m + totalDurationMinutes);
    const display = formatDisplayTime(slotStartTime);

    // If today, slot must be at least 30 mins in the future
    if (isToday && m <= currentDhakaMinutes + 20) {
      slots.push({
        time: slotStartTime,
        displayTime: display,
        available: false,
        reason: 'Time has passed for today',
      });
      continue;
    }

    // Check collision with any existing booking
    const candidateStart = m;
    const candidateEnd = m + totalDurationMinutes;

    let hasCollision = false;
    for (const b of bookedIntervals) {
      // Overlap condition:
      // Candidate starts before existing ends, AND candidate ends after existing starts
      if (candidateStart < b.end && candidateEnd > (b.start - bufferTime)) {
        hasCollision = true;
        break;
      }
    }

    if (hasCollision) {
      slots.push({
        time: slotStartTime,
        displayTime: display,
        available: false,
        reason: 'Slot is already booked',
      });
    } else {
      slots.push({
        time: slotStartTime,
        displayTime: display,
        available: true,
      });
      availableCount++;
    }
  }

  return {
    date: dateStr,
    isClosed: false,
    slots,
    availableCount,
  };
}

/**
 * Atomic double-booking prevention check.
 * Checks if candidate appointment [startTime, endTime] collides with any existing
 * active booking on date `appointmentDate`.
 */
export async function isSlotFreeAtomic(
  tx: any,
  appointmentDate: string,
  startTime: string,
  endTime: string,
  bufferMinutes: number
): Promise<boolean> {
  const reqStart = timeToMinutes(startTime);
  const reqEnd = timeToMinutes(endTime);

  const existing = await tx.appointment.findMany({
    where: {
      appointmentDate,
      status: { in: ['PENDING', 'CONFIRMED'] },
    },
    select: {
      id: true,
      startTime: true,
      endTime: true,
    },
  });

  for (const b of existing) {
    const bStart = timeToMinutes(b.startTime) - bufferMinutes;
    const bEnd = timeToMinutes(b.endTime) + bufferMinutes;

    if (reqStart < bEnd && reqEnd > bStart) {
      return false; // Collision detected
    }
  }

  return true;
}

// Generate unique booking reference: e.g. GC-20261028-7A8B
export function generateBookingReference(dateStr: string): string {
  const cleanDate = dateStr.replace(/-/g, '');
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `GC-${cleanDate.slice(2)}-${rand}`;
}
