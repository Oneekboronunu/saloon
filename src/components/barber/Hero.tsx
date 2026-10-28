'use client';

import React from 'react';
import { Calendar, ArrowDown, Scissors, Clock, ShieldCheck, MapPin } from 'lucide-react';

interface HeroProps {
  salonName?: string;
  tagline?: string;
}

export default function Hero({
  salonName = 'GOLDEN CUTS',
  tagline = 'YOUR STYLE. YOUR SIGNATURE.',
}: HeroProps) {
  return (
    <section className="relative min-h-[90vh] sm:min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#0B0B0B]">
      {/* Background Ambience & Pattern (Pure lightweight CSS gradient - zero render delay) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Subtle radial gold spotlight */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[600px] h-[340px] sm:h-[600px] bg-[#C8A24D]/10 rounded-full blur-[100px] sm:blur-[140px]" />
        
        {/* Fine crosshatch grid overlay for tactile luxury feel */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `radial-gradient(circle, #C8A24D 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }} 
        />

        {/* Cinematic dark vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-[#0B0B0B]/80" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Location & Status Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#151515] border border-[#C8A24D]/30 mb-6 sm:mb-8 animate-in fade-in duration-500">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-[11px] sm:text-xs font-medium uppercase tracking-[0.2em] text-[#C8A24D]">
            Dhanmondi, Dhaka • Appointments Open
          </span>
        </div>

        {/* Master Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-[#F5F2EA] tracking-tight leading-[1.15] mb-5 sm:mb-6">
          YOUR STYLE.{' '}
          <span className="gold-gradient-text block sm:inline">
            YOUR SIGNATURE.
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="text-base sm:text-lg md:text-xl text-[#A6A6A6] font-normal max-w-2xl leading-relaxed mb-8 sm:mb-10 px-2">
          Precision cuts. Refined grooming. A better version of you. Experience bespoke barbering crafted by master artisans in a private, unhurried atmosphere.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-4 sm:px-0">
          <a
            href="#booking"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-4 rounded-xl bg-[#C8A24D] hover:bg-[#D8B45E] text-[#0B0B0B] font-bold text-sm tracking-wider uppercase transition-all shadow-lg hover:shadow-xl active:scale-[0.98] group"
          >
            <Calendar className="w-4 h-4 text-[#0B0B0B] group-hover:scale-110 transition-transform" />
            <span>BOOK YOUR APPOINTMENT</span>
          </a>

          <a
            href="#services"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-4 rounded-xl bg-[#151515] hover:bg-[#1E1E1E] text-[#F5F2EA] border border-[#262626] hover:border-[#C8A24D]/50 font-semibold text-sm tracking-wide transition-all active:scale-[0.98]"
          >
            <span>EXPLORE OUR SERVICES</span>
          </a>
        </div>

        {/* Trust & Craft Indicators (Clean, honest, no fabricated statistics) */}
        <div className="grid grid-cols-3 gap-3 sm:gap-8 mt-12 sm:mt-16 pt-8 border-t border-[#262626] w-full max-w-2xl">
          <div className="flex flex-col items-center text-center">
            <Scissors className="w-5 h-5 text-[#C8A24D] mb-1.5" />
            <span className="text-xs sm:text-sm font-semibold text-[#F5F2EA]">Precision Cut</span>
            <span className="text-[11px] text-[#A6A6A6] hidden sm:inline">Tailored to face shape</span>
          </div>

          <div className="flex flex-col items-center text-center">
            <ShieldCheck className="w-5 h-5 text-[#C8A24D] mb-1.5" />
            <span className="text-xs sm:text-sm font-semibold text-[#F5F2EA]">Sterilized Tools</span>
            <span className="text-[11px] text-[#A6A6A6] hidden sm:inline">Medical grade hygiene</span>
          </div>

          <div className="flex flex-col items-center text-center">
            <Clock className="w-5 h-5 text-[#C8A24D] mb-1.5" />
            <span className="text-xs sm:text-sm font-semibold text-[#F5F2EA]">Reserved Slots</span>
            <span className="text-[11px] text-[#A6A6A6] hidden sm:inline">Zero unnecessary wait</span>
          </div>
        </div>

        {/* Scroll down indicator */}
        <a
          href="#services"
          className="mt-8 text-[#A6A6A6] hover:text-[#C8A24D] transition-colors p-2"
          aria-label="Scroll to services"
        >
          <ArrowDown className="w-4 h-4 animate-bounce text-[#C8A24D]/70" />
        </a>
      </div>
    </section>
  );
}
