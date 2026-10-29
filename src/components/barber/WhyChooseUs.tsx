'use client';

import React from 'react';
import { Scissors, Sparkles, ShieldCheck, Clock, UserCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function WhyChooseUs() {
  const { t, language } = useLanguage();

  const pillars = language === 'bn' ? [
    {
      icon: Scissors,
      title: 'নিখুঁত কারিগরি ও যত্ন',
      description: 'আপনার মুখের গঠন, চুলের প্যাটার্ন ও জীবনযাত্রার সাথে মানিয়ে প্রতিটি হেয়ারকাট ও দাড়ি নিখুঁত করা হয়।',
    },
    {
      icon: Sparkles,
      title: 'পেশাদার ও মার্জিত গ্রুমিং',
      description: 'আধুনিক কাঁচি ও ট্রিমার টেকনিকের সাথে ঐতিহ্যবাহী সেলুন রীতির সমন্বয়ে আপনার ব্যক্তিত্বে আনবে অনন্য দীপ্তি।',
    },
    {
      icon: ShieldCheck,
      title: '১০০% জীবাণুমুক্ত স্বাস্থ্যবিধি',
      description: 'প্রতিটি গ্রাহকের আগে কাঁচি, ট্রিমার ও ব্লেড কঠোরভাবে স্যানিটাইজ করা হয়। সম্পূর্ণ নতুন ব্লেড নিশ্চিত।',
    },
    {
      icon: Clock,
      title: 'সংরক্ষিত সময়ের নিশ্চয়তা',
      description: 'আমরা আপনার সময়ের মূল্য বুঝি। বুক করা স্লট শুধুমাত্র আপনার জন্যই সংরক্ষিত থাকে, দীর্ঘ লাইন বা অপেক্ষা নেই।',
    },
    {
      icon: UserCheck,
      title: 'ব্যক্তিগত গ্রাহক সেবা',
      description: 'সেবা শুরুর আগে আপনার পছন্দ ও স্টাইল নিয়ে আলোচনা, যাতে আপনি পান সম্পূর্ণ প্রত্যাশিত নিখুঁত লুক।',
    },
  ] : [
    {
      icon: Scissors,
      title: 'Precision & Attention to Detail',
      description:
        'Every cut and beard line is meticulously tailored to your cranial structure, hair growth pattern, and personal lifestyle.',
    },
    {
      icon: Sparkles,
      title: 'Professional Grooming',
      description:
        'Modern scissor and fade techniques blended with timeless barbering traditions to elevate your everyday confidence.',
    },
    {
      icon: ShieldCheck,
      title: 'Clean Tools & Hygienic Practices',
      description:
        'All stainless steel clippers, shears, and razors undergo rigorous medical-grade sanitization before each client consultation.',
    },
    {
      icon: Clock,
      title: 'Convenient Reserved Appointments',
      description:
        'We value your schedule. Dedicated time slots prevent overbooking, guaranteeing you walk in directly to your barber chair.',
    },
    {
      icon: UserCheck,
      title: 'Personalized Customer Experience',
      description:
        'One-on-one consultation before every service to understand your grooming goals, texture preferences, and upkeep routine.',
    },
  ];

  return (
    <section id="why-us" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#0B0B0B] border-t border-[#1C1C1C]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C8A24D] font-semibold block mb-3">
            {t('why_subtitle')}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#F5F2EA] tracking-tight">
            {t('why_title')}
          </h2>
          <div className="w-16 h-0.5 bg-[#C8A24D] mx-auto mt-4 mb-4 opacity-70" />
          <p className="text-sm sm:text-base text-[#A6A6A6] leading-relaxed">
            {t('why_desc')}
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#121212] border border-[#222222] hover:border-[#C8A24D]/40 transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] border border-[#2B2B2B] group-hover:border-[#C8A24D]/40 flex items-center justify-center text-[#C8A24D] mb-5 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#F5F2EA] mb-2.5">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A6A6A6] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
