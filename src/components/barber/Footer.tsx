'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface FooterProps {
  salonName?: string;
  phone?: string;
  address?: string;
}

export default function Footer({
  salonName = 'GOLDEN CUTS',
  phone = '01780625295',
  address = 'Housing Colony Road, Steel Mill, North Patenga, Chattogram',
}: FooterProps) {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-[#070707] border-t border-[#1C1C1C] text-[#A6A6A6] pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-[#1C1C1C]">
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="relative w-9 h-9 rounded-xl bg-[#141414] border border-[#C8A24D]/35 flex items-center justify-center p-1 overflow-hidden shadow-md">
                <img
                  src="/images/logo-nav.png"
                  alt="Golden Cuts Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-serif tracking-widest text-lg font-bold text-[#F5F2EA]">
                {salonName}
              </span>
            </div>
            <p className="text-xs text-[#A6A6A6] max-w-sm leading-relaxed">
              {t('footer_desc')}
            </p>
            <div className="flex items-center space-x-4 pt-1 text-xs">
              <span className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C8A24D]" />
                <span>{language === 'bn' ? 'উত্তর পতেঙ্গা, চট্টগ্রাম' : 'North Patenga, Chattogram'}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-[#C8A24D]" />
                <span>{phone}</span>
              </span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#F5F2EA] font-semibold mb-3">
              {language === 'bn' ? 'মেনু' : 'Navigation'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#services" className="hover:text-[#C8A24D] transition-colors">
                  {t('nav_services')} & {t('nav_pricing')}
                </a>
              </li>
              <li>
                <a href="#booking" className="hover:text-[#C8A24D] transition-colors">
                  {t('nav_book')}
                </a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-[#C8A24D] transition-colors">
                  {t('nav_why_us')}
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-[#C8A24D] transition-colors">
                  {t('nav_gallery')}
                </a>
              </li>
              <li>
                <a href="#location" className="hover:text-[#C8A24D] transition-colors">
                  {t('nav_location')}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Hours & Quick Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#F5F2EA] font-semibold mb-3">
              {language === 'bn' ? 'কার্যঘণ্টা' : 'Hours'}
            </h4>
            <div className="space-y-1.5 text-xs text-[#A6A6A6]">
              <p className="text-[#F5F2EA]">
                {language === 'bn' ? 'শনি – বৃহস্পতি: সকাল ১০:০০ – রাত ১০:০০' : 'Sat – Thu: 10:00 AM – 10:00 PM'}
              </p>
              <p>
                {language === 'bn' ? 'শুক্রবার: দুপুর ০২:০০ – রাত ১০:০০' : 'Friday: 02:00 PM – 10:00 PM'}
              </p>
              <div className="pt-2">
                <a
                  href={`tel:${phone}`}
                  className="inline-block text-[#C8A24D] hover:underline font-mono"
                >
                  {phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#737373] space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <span>© {new Date().getFullYear()} {salonName}. {t('footer_rights')}</span>
          </div>

          <div className="flex items-center space-x-6">
            <Link href="/admin/login" className="hover:text-[#C8A24D] transition-colors font-mono">
              {language === 'bn' ? 'এডমিন পোর্টাল' : 'Staff Portal'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
