export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  category: string;
  imageUrl?: string | null;
  isActive: boolean;
  sortOrder: number;
}

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    name: 'Classic Haircut',
    description: 'Consultation, precision scissors and clipper cut, hot lather neck shave, and bespoke styling.',
    price: 250,
    durationMinutes: 30,
    category: 'HAIRCUT',
    imageUrl: '/images/services/classic-cut.webp',
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 'srv-2',
    name: 'Skin Fade',
    description: 'Razor-sharp low, mid, or high skin taper fade finished with foil shaver and premium matte clay.',
    price: 350,
    durationMinutes: 45,
    category: 'HAIRCUT',
    imageUrl: '/images/services/skin-fade.webp',
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 'srv-3',
    name: 'Haircut and Beard Trim',
    description: 'Our signature combination: tailored precision haircut paired with sculptured beard styling and razor line-up.',
    price: 450,
    durationMinutes: 60,
    category: 'COMBO',
    imageUrl: '/images/services/haircut-beard.webp',
    isActive: true,
    sortOrder: 3,
  },
  {
    id: 'srv-4',
    name: 'Beard Trim and Shape',
    description: 'Beard trim, cheek line razor definition, nourishing organic beard butter, and warm towel steam.',
    price: 150,
    durationMinutes: 20,
    category: 'BEARD',
    imageUrl: '/images/services/beard-trim.webp',
    isActive: true,
    sortOrder: 4,
  },
  {
    id: 'srv-5',
    name: 'Hair Wash and Styling',
    description: 'Deep scalp purifying shampoo, invigorating cooling conditioner rinse, blow-dry and luxury matte finish.',
    price: 150,
    durationMinutes: 20,
    category: 'STYLING',
    imageUrl: '/images/services/hair-wash.webp',
    isActive: true,
    sortOrder: 5,
  },
  {
    id: 'srv-6',
    name: 'Premium Grooming Package',
    description: 'The VIP service: Master haircut, beard detailing, charcoal detox face scrub, hot towel ritual, and head massage.',
    price: 600,
    durationMinutes: 75,
    category: 'PACKAGE',
    imageUrl: '/images/services/premium-package.webp',
    isActive: true,
    sortOrder: 6,
  },
];

export const DEFAULT_SETTINGS: Record<string, string> = {
  salon_name: 'GOLDEN CUTS',
  salon_tagline: 'YOUR STYLE. YOUR SIGNATURE.',
  phone: '01780625295',
  whatsapp: '8801780625295',
  address: 'House 42, Road 27 (Old), Dhanmondi, Dhaka 1209, Bangladesh',
  map_url: 'https://maps.google.com/?q=Dhanmondi+27+Dhaka',
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
