'use client';

import React from 'react';
import { Clock, Check, Plus, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  category: string;
  imageUrl?: string | null;
  isActive: boolean;
}

interface ServicesSectionProps {
  services: ServiceItem[];
  selectedServiceIds: string[];
  onToggleService: (id: string) => void;
  onProceedToBooking: () => void;
  currency?: string;
}

const BENGALI_SERVICE_MAP: Record<string, { name: string; description: string }> = {
  'srv-1': {
    name: 'ক্লাসিক হেয়ারকাট',
    description: 'ব্যক্তিগত পরামর্শ, নিখুঁত কাঁচি ও ক্লিপার কাটিং, গরম ফোম ও নেক শেভ এবং পারফেক্ট স্টাইলিং।',
  },
  'srv-2': {
    name: 'স্কিন ফেইড',
    description: 'রেজার-শার্প লো, মিড বা হাই স্কিন ফেইড, ফয়েল শেভার এবং প্রিমিয়াম মেট ক্লে টেক্সচারিং।',
  },
  'srv-3': {
    name: 'হেয়ারকাট ও দাড়ি ট্রিম',
    description: 'সিগনেচার কম্বো: কাস্টম প্রিসিশন হেয়ারকাটের সাথে নিখুঁত দাড়ি ট্রিম ও শার্প রেজার লাইন-আপ।',
  },
  'srv-4': {
    name: 'দাড়ি ট্রিম ও শেপিং',
    description: 'দাড়ির সুনির্দিষ্ট লাইন-আপ, অর্গানিক বাটার ম্যাসাজ এবং রিফ্রেশিং হট টাওয়েল বাষ্প।',
  },
  'srv-5': {
    name: 'হেয়ার ওয়াশ ও স্টাইলিং',
    description: 'স্ক্যাল্প পিউরিফাইং শ্যাম্পু, কুলিং কন্ডিশনার, ব্লো-ড্রাই এবং লাক্সারি মেট ফিনিশ।',
  },
  'srv-6': {
    name: 'প্রিমিয়াম গ্রুমিং প্যাকেজ',
    description: 'ভিআইপি ফুল প্যাকেজ: মাস্টার হেয়ারকাট, বিয়ার্ড শেপিং, চারকোল ফেস স্ক্রাব, হট টাওয়েল ও হেড ম্যাসাজ।',
  },
};

export default function ServicesSection({
  services,
  selectedServiceIds,
  onToggleService,
  onProceedToBooking,
  currency = '৳',
}: ServicesSectionProps) {
  const { t, language } = useLanguage();
  const selectedServices = services.filter((s) => selectedServiceIds.includes(s.id));
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.durationMinutes, 0);

  return (
    <section id="services" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#0B0B0B] border-t border-[#1C1C1C]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C8A24D] font-semibold block mb-3">
            {t('services_subtitle')}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#F5F2EA] tracking-tight">
            {t('services_title')}
          </h2>
          <div className="w-16 h-0.5 bg-[#C8A24D] mx-auto mt-4 mb-4 opacity-70" />
          <p className="text-sm sm:text-base text-[#A6A6A6] leading-relaxed">
            {t('services_desc')}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {services.map((service) => {
            const isSelected = selectedServiceIds.includes(service.id);
            const bnData = BENGALI_SERVICE_MAP[service.id];
            const displayName = language === 'bn' && bnData ? bnData.name : service.name;
            const displayDesc = language === 'bn' && bnData ? bnData.description : service.description;

            return (
              <div
                key={service.id}
                onClick={() => onToggleService(service.id)}
                className={`relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl cursor-pointer transition-all duration-200 border ${
                  isSelected
                    ? 'bg-[#181818] border-[#C8A24D] shadow-[0_0_20px_rgba(200,162,77,0.2)] ring-1 ring-[#C8A24D]'
                    : 'bg-[#121212] border-[#262626] hover:border-[#C8A24D]/40 hover:bg-[#151515]'
                }`}
              >
                {/* Header row: Name + Price */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#F5F2EA] leading-snug">
                      {displayName}
                    </h3>
                    <div className="flex flex-col items-end flex-shrink-0">
                      <span className="text-lg sm:text-xl font-bold text-[#C8A24D] tracking-tight">
                        {currency}{service.price}
                      </span>
                    </div>
                  </div>

                  {/* Duration & Category row */}
                  <div className="flex items-center space-x-3 mb-3 text-xs text-[#A6A6A6]">
                    <span className="inline-flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-[#C8A24D]" />
                      <span>{service.durationMinutes} {language === 'bn' ? 'মিনিট' : 'mins'}</span>
                    </span>
                    <span className="text-[#333]">•</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] tracking-wider uppercase font-medium bg-[#1F1F1F] text-[#A6A6A6] border border-[#2B2B2B]">
                      {service.category}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#A6A6A6] leading-relaxed mb-6">
                    {displayDesc}
                  </p>
                </div>

                {/* Card Action Button */}
                <div className="pt-3 border-t border-[#222222] flex items-center justify-between">
                  <span className="text-xs font-medium text-[#737373]">
                    {isSelected 
                      ? (language === 'bn' ? 'সেবা নির্বাচিত' : 'Service Selected') 
                      : (language === 'bn' ? 'বাছাই করতে চাপুন' : 'Tap to Select')}
                  </span>
                  <div
                    className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      isSelected
                        ? 'bg-[#C8A24D] text-[#0B0B0B]'
                        : 'bg-[#1C1C1C] text-[#F5F2EA] hover:bg-[#252525] border border-[#2B2B2B]'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'নির্বাচিত' : 'Selected'}</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 text-[#C8A24D]" />
                        <span>{language === 'bn' ? 'বাছাই করুন' : 'Select'}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Services Summary & Quick Proceed Bar */}
        {selectedServices.length > 0 && (
          <div className="sticky bottom-4 z-30 mt-8 p-4 sm:p-5 rounded-2xl bg-[#151515]/95 backdrop-blur-md border border-[#C8A24D]/50 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-xl bg-[#C8A24D]/10 border border-[#C8A24D]/30 flex items-center justify-center text-[#C8A24D] flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-[#F5F2EA]">
                    {language === 'bn' 
                      ? `${selectedServices.length}টি সেবা নির্বাচিত`
                      : `${selectedServices.length} ${selectedServices.length === 1 ? 'Service' : 'Services'} Chosen`}
                  </span>
                  <span className="text-xs text-[#737373]">•</span>
                  <span className="text-xs text-[#A6A6A6]">~{totalDuration} {language === 'bn' ? 'মিনিট' : 'mins'}</span>
                </div>
                <p className="text-xs text-[#A6A6A6] line-clamp-1">
                  {selectedServices.map((s) => {
                    const bn = BENGALI_SERVICE_MAP[s.id];
                    return language === 'bn' && bn ? bn.name : s.name;
                  }).join(', ')}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end space-x-4 w-full sm:w-auto">
              <div className="text-right">
                <span className="text-[10px] text-[#A6A6A6] uppercase tracking-wider block">
                  {language === 'bn' ? 'মোট মূল্য' : 'Total Amount'}
                </span>
                <span className="text-xl sm:text-2xl font-serif font-bold text-[#C8A24D]">
                  {currency}{totalPrice}
                </span>
              </div>
              <button
                onClick={onProceedToBooking}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#C8A24D] hover:bg-[#D8B45E] text-[#0B0B0B] font-bold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all"
              >
                <span>{language === 'bn' ? 'পরবর্তী ধাপ' : 'Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
