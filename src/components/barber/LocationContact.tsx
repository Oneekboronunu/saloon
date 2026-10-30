'use client';

import React from 'react';
import { MapPin, Phone, MessageCircle, Clock, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

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
  address = 'Housing Colony Road, Steel Mill, North Patenga, Chattogram, Bangladesh',
  phone = '01780625295',
  whatsapp = '8801780625295',
  mapUrl = 'https://maps.app.goo.gl/zwGhp83YAC5YiwHq5',
  weekdayHours = 'Saturday – Thursday: 10:00 AM – 10:00 PM',
  weekendHours = 'Friday: 02:00 PM – 10:00 PM',
}: LocationContactProps) {
  const { t, language } = useLanguage();

  const displayAddress = language === 'bn' 
    ? 'হাউজিং কলোনি রোড, স্টিল মিল, উত্তর পতেঙ্গা, চট্টগ্রাম, বাংলাদেশ'
    : address;

  const displayWeekdayHours = language === 'bn'
    ? 'শনিবার – বৃহস্পতিবার: সকাল ১০:০০ – রাত ১০:০০'
    : weekdayHours;

  const displayWeekendHours = language === 'bn'
    ? 'শুক্রবার: দুপুর ০২:০০ – রাত ১০:০০'
    : weekendHours;

  return (
    <section id="location" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#0B0B0B] border-t border-[#1C1C1C]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C8A24D] font-semibold block mb-2">
            {t('location_subtitle')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#F5F2EA] tracking-tight">
            {t('location_title')}
          </h2>
          <div className="w-14 h-0.5 bg-[#C8A24D] mx-auto mt-3 mb-3 opacity-70" />
          <p className="text-xs sm:text-sm text-[#A6A6A6]">
            {t('location_desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Contact Details Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#121212] border border-[#262626] space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#C8A24D] font-mono block mb-1">
                {language === 'bn' ? 'আমাদের সেলুন' : 'The Salon'}
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
                <span className="text-xs font-semibold text-[#F5F2EA] block">
                  {t('location_address_title')}
                </span>
                <p className="text-xs sm:text-sm text-[#A6A6A6] mt-0.5 leading-relaxed">
                  {displayAddress}
                </p>
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-xs text-[#C8A24D] hover:underline mt-1.5"
                >
                  <span>{language === 'bn' ? 'গুগল ম্যাপে দেখুন' : 'Open in Google Maps'}</span>
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
                <span className="text-xs font-semibold text-[#F5F2EA] block">
                  {t('location_hours_title')}
                </span>
                <p className="text-[#F5F2EA]">{displayWeekdayHours}</p>
                <p className="text-[#A6A6A6]">{displayWeekendHours}</p>
              </div>
            </div>

            {/* Direct Connect Buttons */}
            <div className="pt-4 border-t border-[#222] flex flex-col sm:flex-row gap-3">
              <a
                href={`tel:${phone}`}
                className="flex-1 inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] border border-[#2B2B2B] text-xs font-bold uppercase tracking-wider text-[#F5F2EA] transition"
              >
                <Phone className="w-4 h-4 text-[#C8A24D]" />
                <span>{language === 'bn' ? 'কল করুন:' : 'Call:'} {phone}</span>
              </a>

              <a
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(language === 'bn' ? 'নমস্কার / আসসালামু আলাইকুম, আমি গোল্ডেন কাটস বারবারশপে একটি অ্যাপয়েন্টমেন্ট বুকিং সম্পর্কে জানতে চাচ্ছি।' : "Hello, I'd like to inquire about a salon appointment.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-bold uppercase tracking-wider transition shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{language === 'bn' ? 'হোয়াটসঅ্যাপ চ্যাট' : 'WhatsApp Chat'}</span>
              </a>
            </div>
          </div>

          {/* Interactive Map Embed / Visual Location Card */}
          <div className="rounded-2xl bg-[#121212] border border-[#262626] overflow-hidden flex flex-col justify-between h-full min-h-[360px] relative">
            <div className="p-4 bg-[#181818] border-b border-[#222] flex items-center justify-between relative z-10">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                <span className="text-xs font-semibold text-[#F5F2EA]">
                  {language === 'bn' ? 'সরাসরি লোকেশন' : 'Live Location'}
                </span>
              </div>
              <span className="text-[11px] text-[#C8A24D] font-medium">
                {language === 'bn' ? 'উত্তর পতেঙ্গা, চট্টগ্রাম' : 'North Patenga, Chattogram'}
              </span>
            </div>

            {/* Map Container with Live Interactive Street Map & Luxury Overlay */}
            <div className="flex-1 min-h-[260px] relative flex flex-col items-center justify-center text-center p-6 bg-[#0D0D0D] overflow-hidden">
              <iframe
                src="https://maps.google.com/maps?q=Housing+Colony+Road,+Steel+Mill,+North+Patenga,+Chattogram&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                className="w-full h-full border-0 absolute inset-0 opacity-40 hover:opacity-70 transition-opacity filter grayscale contrast-125"
                loading="lazy"
                title="Google Maps Location"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-[#121212]/80 pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-13 h-13 p-3 rounded-2xl bg-[#151515]/95 border border-[#C8A24D]/60 flex items-center justify-center text-[#C8A24D] mb-3 shadow-[0_0_25px_rgba(200,162,77,0.3)]">
                  <MapPin className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-base sm:text-lg font-bold text-[#F5F2EA] mb-1 drop-shadow-md">
                  {salonName} Barbershop
                </h4>
                <p className="text-xs text-[#E5E0D8] max-w-xs mb-4 drop-shadow-md font-medium">
                  {displayAddress}
                </p>
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ECC876] via-[#C8A24D] to-[#9F7A28] hover:from-[#F5D589] hover:via-[#D4AE55] hover:to-[#B08832] text-[#0B0B0B] font-bold text-xs uppercase tracking-wider transition shadow-[0_4px_20px_rgba(200,162,77,0.35)] border border-[#F5E6B3]/40 active:scale-95"
                >
                  <span>{t('location_map_btn')}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#0B0B0B]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
