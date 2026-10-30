'use client';

import React, { useRef, useEffect } from 'react';
import { Calendar, ArrowDown, Scissors, Clock, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface HeroProps {
  salonName?: string;
  tagline?: string;
}

export default function Hero({
  salonName = 'GOLDEN CUTS',
  tagline = 'YOUR STYLE. YOUR SIGNATURE.',
}: HeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    // Force muted and autoplay programmatically for seamless cross-browser playback
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay handled by browser
        });
      }
    }
  }, []);

  return (
    <section className="relative min-h-[95vh] sm:min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#0B0B0B]">
      {/* ================= BACKGROUND VIDEO & CINEMATIC OVERLAYS ================= */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none">
        {/* Background HTML5 Video - Seamless continuous loop */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105 opacity-80 sm:opacity-85 transition-opacity duration-700"
          style={{
            filter: 'contrast(1.1) brightness(0.92)',
          }}
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
          <source src="https://api-f.streamable.com/api/v1/videos/akquln/mp4" type="video/mp4" />
        </video>

        {/* Focused cinematic gradient: dark at edges, crystal clear over barber action */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 45%, rgba(11,11,11,0.25) 0%, rgba(11,11,11,0.65) 60%, rgba(11,11,11,0.95) 100%)',
          }}
        />

        {/* Top bar header protection & bottom transition to services */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0B]/80 via-transparent to-[#0B0B0B]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent" />

        {/* Subtle gold ambient glow in center */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[680px] h-[340px] sm:h-[680px] bg-[#C8A24D]/10 rounded-full blur-[130px] pointer-events-none" />
      </div>

      {/* ================= HERO FOREGROUND CONTENT ================= */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Location & Status Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#151515]/90 backdrop-blur-md border border-[#C8A24D]/40 mb-6 sm:mb-8 animate-in fade-in duration-500 shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-[11px] sm:text-xs font-medium uppercase tracking-[0.2em] text-[#C8A24D]">
            {t('hero_badge')}
          </span>
        </div>

        {/* Master Headline with enhanced readability against live video */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-[#F5F2EA] tracking-tight leading-[1.12] mb-5 sm:mb-6 drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
          {t('hero_headline_1')}{' '}
          <span className="gold-gradient-text block sm:inline">
            {t('hero_headline_2')}
          </span>
        </h1>

        {/* Supporting Copy with enhanced contrast */}
        <p className="text-base sm:text-lg md:text-xl text-[#F5F2EA] font-normal max-w-2xl leading-relaxed mb-8 sm:mb-10 px-2 drop-shadow-[0_2px_18px_rgba(0,0,0,1)]">
          {t('hero_description')}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-4 sm:px-0">
          <a
            href="#booking"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-[#ECC876] via-[#C8A24D] to-[#9F7A28] hover:from-[#F5D589] hover:via-[#D4AE55] hover:to-[#B08832] text-[#0B0B0B] font-extrabold text-sm tracking-wider uppercase transition-all shadow-[0_0_35px_rgba(200,162,77,0.5)] hover:shadow-[0_0_50px_rgba(200,162,77,0.7)] border border-[#F5E6B3]/45 active:scale-[0.98] group"
          >
            <Calendar className="w-4 h-4 text-[#0B0B0B] group-hover:scale-110 transition-transform" />
            <span>{t('hero_cta_book')}</span>
          </a>

          <a
            href="#services"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-4 rounded-xl bg-[#151515]/90 hover:bg-[#1E1E1E] backdrop-blur-md text-[#F5F2EA] border border-[#C8A24D]/30 hover:border-[#C8A24D] font-semibold text-sm tracking-wide transition-all active:scale-[0.98] shadow-lg"
          >
            <span>{t('hero_cta_services')}</span>
          </a>
        </div>

        {/* Trust & Craft Indicators */}
        <div className="grid grid-cols-3 gap-3 sm:gap-8 mt-12 sm:mt-16 pt-8 border-t border-[#262626]/90 w-full max-w-2xl bg-[#0B0B0B]/70 backdrop-blur-md rounded-2xl px-4 py-4 sm:p-5 shadow-2xl">
          <div className="flex flex-col items-center text-center">
            <div className="w-9 h-9 rounded-lg bg-[#141414] border border-[#C8A24D]/35 flex items-center justify-center mb-1.5 text-[#C8A24D]">
              <Scissors className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-[#F5F2EA]">{t('hero_feature_1')}</span>
            <span className="text-[11px] text-[#A6A6A6] hidden sm:inline">{t('hero_feature_1_desc')}</span>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-9 h-9 rounded-lg bg-[#141414] border border-[#C8A24D]/35 flex items-center justify-center mb-1.5 text-[#C8A24D]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-[#F5F2EA]">{t('hero_feature_2')}</span>
            <span className="text-[11px] text-[#A6A6A6] hidden sm:inline">{t('hero_feature_2_desc')}</span>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-9 h-9 rounded-lg bg-[#141414] border border-[#C8A24D]/35 flex items-center justify-center mb-1.5 text-[#C8A24D]">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-[#F5F2EA]">{t('hero_feature_3')}</span>
            <span className="text-[11px] text-[#A6A6A6] hidden sm:inline">{t('hero_feature_3_desc')}</span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-8 flex items-center justify-center">
          <a
            href="#services"
            className="text-[#A6A6A6] hover:text-[#C8A24D] transition-colors p-2"
            aria-label="Scroll to services"
          >
            <ArrowDown className="w-5 h-5 animate-bounce text-[#C8A24D]" />
          </a>
        </div>
      </div>
    </section>
  );
}
