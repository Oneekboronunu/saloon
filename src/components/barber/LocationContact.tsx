'use client';

import React from 'react';
import { MapPin, Phone, MessageCircle, Clock, ExternalLink } from 'lucide-react';

interface LocationContactProps {
  salonName?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  mapUrl?: string;
  weekdayHours?: string;
  weekendHours?: string;
}

export default function LocationContact({
  salonName = 'GOLDEN CUTS',
  address = 'House 42, Road 27 (Old), Dhanmondi, Dhaka 1209, Bangladesh',
  phone = '01780625295',
  whatsapp = '8801780625295',
  mapUrl = 'https://maps.google.com/?q=Dhanmondi+27+Dhaka',
  weekdayHours = 'Saturday – Thursday: 10:00 AM – 10:00 PM',
  weekendHours = 'Friday: 02:00 PM – 10:00 PM',
}: LocationContactProps) {
  return (
    <section id="location" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#0B0B0B] border-t border-[#1C1C1C]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C8A24D] font-semibold block mb-2">
            Visit & Connect
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#F5F2EA] tracking-tight">
            Location & Contact
          </h2>
          <div className="w-14 h-0.5 bg-[#C8A24D] mx-auto mt-3 mb-3 opacity-70" />
          <p className="text-xs sm:text-sm text-[#A6A6A6]">
            Centrally situated in Dhanmondi. Easy parking and convenient access.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Contact Details Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#121212] border border-[#262626] space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#C8A24D] font-mono block mb-1">
                The Salon
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#F5F2EA]">
                {salonName} Barbershop
              </h3>
            </div>

            {/* Address */}
            <div className="flex items-start space-x-3.5">
              <div className="w-9 h-9 rounded-lg bg-[#1A1A1A] border border-[#2B2B2B] flex items-center justify-center text-[#C8A24D] flex-shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#F5F2EA] block">Address</span>
                <p className="text-xs sm:text-sm text-[#A6A6A6] mt-0.5 leading-relaxed">
                  {address}
                </p>
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-xs text-[#C8A24D] hover:underline mt-1.5"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="flex items-start space-x-3.5">
              <div className="w-9 h-9 rounded-lg bg-[#1A1A1A] border border-[#2B2B2B] flex items-center justify-center text-[#C8A24D] flex-shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-xs sm:text-sm text-[#A6A6A6] space-y-1">
                <span className="text-xs font-semibold text-[#F5F2EA] block">Opening Hours</span>
                <p className="text-[#F5F2EA]">{weekdayHours}</p>
                <p className="text-[#A6A6A6]">{weekendHours}</p>
              </div>
            </div>

            {/* Direct Connect Buttons */}
            <div className="pt-4 border-t border-[#222] flex flex-col sm:flex-row gap-3">
              <a
                href={`tel:${phone}`}
                className="flex-1 inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] border border-[#2B2B2B] text-xs font-bold uppercase tracking-wider text-[#F5F2EA] transition"
              >
                <Phone className="w-4 h-4 text-[#C8A24D]" />
                <span>Call: {phone}</span>
              </a>

              <a
                href={`https://wa.me/${whatsapp}?text=Hello%2C%20I'd%20like%20to%20inquire%20about%20a%20salon%20appointment.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-bold uppercase tracking-wider transition shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Chat</span>
              </a>
            </div>
          </div>

          {/* Interactive Map Embed / Visual Location Card */}
          <div className="rounded-2xl bg-[#121212] border border-[#262626] overflow-hidden flex flex-col justify-between h-full min-h-[340px]">
            <div className="p-4 bg-[#181818] border-b border-[#222] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                <span className="text-xs font-semibold text-[#F5F2EA]">Location Preview</span>
              </div>
              <span className="text-[11px] text-[#A6A6A6]">Dhanmondi, Dhaka</span>
            </div>

            {/* Stylized Dark Map Canvas */}
            <div className="flex-1 p-6 relative flex flex-col items-center justify-center text-center bg-[#0D0D0D]">
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle, #C8A24D 1px, transparent 1px)`,
                  backgroundSize: '24px 24px',
                }}
              />
              <div className="w-14 h-14 rounded-2xl bg-[#C8A24D]/10 border border-[#C8A24D]/40 flex items-center justify-center text-[#C8A24D] mb-4 relative z-10 shadow-lg">
                <MapPin className="w-7 h-7" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#F5F2EA] mb-1 relative z-10">
                {salonName} Barbershop
              </h4>
              <p className="text-xs text-[#A6A6A6] max-w-xs mb-5 relative z-10">
                {address}
              </p>
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#C8A24D] hover:bg-[#D8B45E] text-[#0B0B0B] font-bold text-xs uppercase tracking-wider transition shadow-md"
              >
                <span>Navigate via Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
