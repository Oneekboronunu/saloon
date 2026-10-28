'use client';

import React, { useState } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import ServicesSection, { ServiceItem } from './ServicesSection';
import WhyChooseUs from './WhyChooseUs';
import BookingWizard from './BookingWizard';
import Gallery from './Gallery';
import LocationContact from './LocationContact';
import Footer from './Footer';

interface BarberHomeClientProps {
  initialServices: ServiceItem[];
  settings: Record<string, string>;
}

export default function BarberHomeClient({
  initialServices,
  settings,
}: BarberHomeClientProps) {
  // Shared state: services selected by client across the page
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(() => {
    // Default to the first popular service (e.g., Classic Haircut) so users can immediately see the flow
    return initialServices.length > 0 ? [initialServices[0].id] : [];
  });

  const handleToggleService = (id: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleProceedToBooking = () => {
    const bookingEl = document.getElementById('booking');
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const salonName = settings.salon_name || 'GOLDEN CUTS';
  const salonPhone = settings.phone || '01780625295';
  const whatsappNumber = settings.whatsapp || '8801780625295';
  const salonAddress = settings.address || 'House 42, Road 27 (Old), Dhanmondi, Dhaka 1209, Bangladesh';
  const currency = settings.currency || '৳';

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F2EA] flex flex-col font-sans">
      {/* 1. Header Navigation */}
      <Navbar salonName={salonName} phone={salonPhone} />

      {/* Main Content */}
      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero salonName={salonName} />

        {/* 3. Services and Pricing Section */}
        <ServicesSection
          services={initialServices}
          selectedServiceIds={selectedServiceIds}
          onToggleService={handleToggleService}
          onProceedToBooking={handleProceedToBooking}
          currency={currency}
        />

        {/* 4. Complete Appointment Booking System */}
        <BookingWizard
          services={initialServices}
          selectedServiceIds={selectedServiceIds}
          onToggleService={handleToggleService}
          currency={currency}
          salonPhone={salonPhone}
          whatsappNumber={whatsappNumber}
          salonAddress={salonAddress}
        />

        {/* 5. Why Choose Us */}
        <WhyChooseUs />

        {/* 6. Responsive Gallery */}
        <Gallery />

        {/* 7. Location and Contact */}
        <LocationContact
          salonName={salonName}
          address={salonAddress}
          phone={salonPhone}
          whatsapp={whatsappNumber}
          mapUrl={settings.map_url}
        />
      </main>

      {/* 8. Footer */}
      <Footer salonName={salonName} phone={salonPhone} address={salonAddress} />
    </div>
  );
}
