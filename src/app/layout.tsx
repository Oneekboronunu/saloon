import type { Metadata, Viewport } from 'next';
import './globals.css';
import WhatsAppButton from '@/components/barber/WhatsAppButton';

export const viewport: Viewport = {
  themeColor: '#0B0B0B',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'GOLDEN CUTS — Premium Men’s Barbershop & Grooming Salon',
  description:
    'Experience bespoke barbering in Chattogram. Precision haircuts, skin fades, sculpted beard shaping, and hot towel treatments by master craftsmen in North Patenga.',
  keywords: [
    'Golden Cuts',
    'Barbershop Chattogram',
    'Men Salon Patenga',
    'Steel Mill Saloon',
    'Skin Fade Chattogram',
    'Beard Trim Bangladesh',
    'Luxury Grooming Salon',
    'Online Barber Booking',
  ],
  openGraph: {
    title: 'GOLDEN CUTS — Premium Men’s Barbershop & Grooming Salon',
    description:
      'Precision cuts. Refined grooming. A better version of you. Real-time online appointment scheduling in North Patenga, Chattogram.',
    type: 'website',
    locale: 'en_BD',
    siteName: 'GOLDEN CUTS',
  },
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0B0B0B] text-[#F5F2EA] min-h-screen antialiased selection:bg-[#C8A24D] selection:text-[#0B0B0B]">
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
