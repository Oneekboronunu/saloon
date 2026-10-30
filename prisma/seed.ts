import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Golden Cuts Barbershop database...');

  // 1. Seed Admin User
  const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || 'yasin@gmail.com';
  const rawPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'yasin12#*';
  const passwordHash = await bcrypt.hash(rawPassword, 10);

  // Clean up legacy default admin if exists
  await prisma.adminUser.deleteMany({
    where: {
      email: {
        not: adminEmail,
      },
    },
  });

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name: 'Yasin (Administrator)',
    },
    create: {
      email: adminEmail,
      name: 'Yasin (Administrator)',
      passwordHash,
      role: 'ADMIN',
    },
  });
  console.log(`Admin user ensured: ${adminEmail}`);

  // 2. Seed Default Business Settings
  const defaultSettings = [
    { key: 'salon_name', value: 'GOLDEN CUTS' },
    { key: 'salon_tagline', value: 'YOUR STYLE. YOUR SIGNATURE.' },
    { key: 'phone', value: '01780625295' },
    { key: 'whatsapp', value: '8801780625295' },
    { key: 'address', value: 'Housing Colony Road, Steel Mill, North Patenga, Chattogram, Bangladesh' },
    { key: 'map_url', value: 'https://maps.app.goo.gl/zwGhp83YAC5YiwHq5' },
    { key: 'opening_time_weekday', value: '10:00' },
    { key: 'closing_time_weekday', value: '22:00' },
    { key: 'opening_time_weekend', value: '14:00' },
    { key: 'closing_time_weekend', value: '22:00' },
    { key: 'closed_days', value: '' }, // e.g., comma separated day numbers: 0=Sunday, 5=Friday etc. Empty = open everyday
    { key: 'slot_interval', value: '30' }, // in minutes
    { key: 'buffer_time', value: '10' }, // in minutes between bookings
    { key: 'booking_window_days', value: '30' }, // allow booking up to 30 days ahead
    { key: 'auto_confirm', value: 'true' }, // if true, status = CONFIRMED, else PENDING
    { key: 'currency', value: '৳' },
    { key: 'timezone', value: 'Asia/Dhaka' },
  ];

  for (const s of defaultSettings) {
    await prisma.businessSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
  }
  console.log('Business settings seeded.');

  // 3. Seed Services
  const initialServices = [
    {
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

  for (const s of initialServices) {
    const existing = await prisma.service.findFirst({
      where: { name: s.name },
    });
    if (!existing) {
      await prisma.service.create({
        data: s,
      });
    } else {
      await prisma.service.update({
        where: { id: existing.id },
        data: s,
      });
    }
  }
  console.log('Services seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
