export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  category: string;
  imageUrl?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Appointment {
  id: string;
  reference: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  notes?: string | null;
  appointmentDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  totalDuration: number;
  totalPrice: number;
  servicesSnapshot: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  cancellationReason?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface BusinessSettings {
  salon_name: string;
  salon_tagline: string;
  phone: string;
  whatsapp: string;
  address: string;
  map_url: string;
  opening_time_weekday: string;
  closing_time_weekday: string;
  opening_time_weekend: string;
  closing_time_weekend: string;
  closed_days: string;
  slot_interval: string;
  buffer_time: string;
  booking_window_days: string;
  auto_confirm: string;
  currency: string;
  timezone: string;
}
