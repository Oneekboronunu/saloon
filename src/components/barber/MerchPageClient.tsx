'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from './Navbar';
import MerchSection from './MerchSection';
import Footer from './Footer';
import { useLanguage } from '@/context/LanguageContext';
import { ShieldCheck, Truck, MessageCircle, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

interface MerchPageClientProps {
  salonName: string;
  salonPhone: string;
  salonAddress: string;
}

export default function MerchPageClient({
  salonName,
  salonPhone,
  salonAddress,
}: MerchPageClientProps) {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F2EA] flex flex-col font-sans">
      <Navbar salonName={salonName} phone={salonPhone} />

      <main className="flex-1 pt-24 pb-16">
        {/* Breadcrumb & Hero Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
          <div className="flex items-center space-x-2 text-xs text-[#A6A6A6] mb-6">
            <Link
              href="/"
              className="inline-flex items-center space-x-1.5 hover:text-[#C8A24D] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'হোমপেজে ফিরুন' : 'Back to Home'}</span>
            </Link>
            <span>/</span>
            <span className="text-[#C8A24D]">
              {language === 'bn' ? 'সেলুন মার্চেন্ডাইজ' : 'Salon Store'}
            </span>
          </div>

          <div className="bg-gradient-to-b from-[#18150E] to-[#121212] border border-[#C8A24D]/30 rounded-2xl p-6 sm:p-10 mb-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#C8A24D]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C8A24D]/15 border border-[#C8A24D]/40 text-[#C8A24D] text-xs font-semibold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#C8A24D]" />
                <span>{language === 'bn' ? 'এক্সক্লুসিভ রিটেল কালেকশন' : 'Exclusive Retail Grooming Collection'}</span>
              </div>
              
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#F5F2EA] tracking-wide leading-tight mb-3">
                {language === 'bn'
                  ? 'আইয়ান হেয়ার কাটিং সেলুন প্রিমিয়াম গ্রুমিং প্রোডাক্টস'
                  : 'Salon-Grade Styling & Care for Home Re-creation'}
              </h1>
              
              <p className="text-sm sm:text-base text-[#D4C8B0] leading-relaxed mb-6">
                {language === 'bn'
                  ? 'আমাদের মাস্টার বারবারদের ব্যবহৃত আসল হেয়ার ক্লে, ভলিউমাইজিং পাউডার, হারবাল বিয়ার্ড অয়েল ও আফটারশেভ বাম এখন আপনার জন্য। অনলাইনে "Buy Now" ক্লিক করে সহজেই হোম ডেলিভারি অর্ডার করুন।'
                  : 'Master craftsmen formulas designed to tame, texture, and protect your signature style daily. Instant checkout via WhatsApp with verified doorstep delivery.'}
              </p>

              {/* Trust highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[#C8A24D]/20 text-xs text-[#E5DFD0]">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#C8A24D] shrink-0" />
                  <span>{language === 'bn' ? '১০০% অরিজিনাল' : '100% Authentic'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-[#C8A24D] shrink-0" />
                  <span>{language === 'bn' ? 'দ্রুত হোম ডেলিভারি' : 'Express Delivery'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4 text-[#C8A24D] shrink-0" />
                  <span>{language === 'bn' ? 'হোয়াটসঅ্যাপ অর্ডার' : 'WhatsApp Checkout'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C8A24D] shrink-0" />
                  <span>{language === 'bn' ? 'বারবার টেস্টেড' : 'Barber Tested'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The Merch Products Component */}
        <MerchSection />
      </main>

      <Footer salonName={salonName} phone={salonPhone} address={salonAddress} />
    </div>
  );
}
