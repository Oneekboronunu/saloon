'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Calendar, ArrowDown, Scissors, Clock, ShieldCheck, Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface HeroProps {
  salonName?: string;
  tagline?: string;
}

export default function Hero({
  salonName = 'GOLDEN CUTS',
  tagline = 'YOUR STYLE. YOUR SIGNATURE.',
}: HeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    // Attempt autoplay (muted by default to comply with browser policies)
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <section className="relative min-h-[95vh] sm:min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#0B0B0B]">
      {/* ================= BACKGROUND VIDEO & CINEMATIC OVERLAYS ================= */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        {/* Background HTML5 Video */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          onLoadedData={() => setVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover object-center scale-105 transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-40' : 'opacity-0'
          }`}
          style={{
            filter: 'contrast(1.15) brightness(0.85)',
          }}
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
          <source src="https://api-f.streamable.com/api/v1/videos/akquln/mp4" type="video/mp4" />
        </video>

        {/* Cinematic Vignette Overlay (Dark edges, clear center) */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 45%, rgba(11,11,11,0.5) 0%, rgba(11,11,11,0.85) 65%, #0B0B0B 100%)',
          }}
        />

        {/* Top & Bottom Deep Matte Black Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-[#0B0B0B]/90" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0B]/80 via-transparent to-[#0B0B0B]" />

        {/* Radial Gold Ambient Glow behind master headline */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[680px] h-[340px] sm:h-[680px] bg-[#C8A24D]/15 rounded-full blur-[110px] sm:blur-[160px] pointer-events-none" />

        {/* Fine crosshatch grid overlay for tactile luxury finish */}
        <div 
          className="absolute inset-0 opacity-[0.035]" 
          style={{
            backgroundImage: `radial-gradient(circle, #C8A24D 1px, transparent 1px)`,
            backgroundSize: '26px 26px',
          }} 
        />
      </div>

      {/* ================= HERO FOREGROUND CONTENT ================= */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Location & Status Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#151515]/90 backdrop-blur-md border border-[#C8A24D]/35 mb-6 sm:mb-8 animate-in fade-in duration-500 shadow-xl">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-[11px] sm:text-xs font-medium uppercase tracking-[0.2em] text-[#C8A24D]">
            Dhanmondi, Dhaka • Appointments Open
          </span>
        </div>

        {/* Master Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-[#F5F2EA] tracking-tight leading-[1.12] mb-5 sm:mb-6 drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
          YOUR STYLE.{' '}
          <span className="gold-gradient-text block sm:inline">
            YOUR SIGNATURE.
          </span>
        </h1>

        {/* Supporting Copy with enhanced contrast */}
        <p className="text-base sm:text-lg md:text-xl text-[#F5F2EA]/90 font-normal max-w-2xl leading-relaxed mb-8 sm:mb-10 px-2 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
          Precision cuts. Refined grooming. A better version of you. Experience bespoke barbering crafted by master artisans in an unhurried, private lounge.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-4 sm:px-0">
          <a
            href="#booking"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-4 rounded-xl bg-[#C8A24D] hover:bg-[#D8B45E] text-[#0B0B0B] font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_30px_rgba(200,162,77,0.35)] hover:shadow-[0_0_40px_rgba(200,162,77,0.5)] active:scale-[0.98] group"
          >
            <Calendar className="w-4 h-4 text-[#0B0B0B] group-hover:scale-110 transition-transform" />
            <span>BOOK YOUR APPOINTMENT</span>
          </a>

          <a
            href="#services"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-4 rounded-xl bg-[#151515]/80 hover:bg-[#1E1E1E] backdrop-blur-md text-[#F5F2EA] border border-[#262626] hover:border-[#C8A24D]/50 font-semibold text-sm tracking-wide transition-all active:scale-[0.98]"
          >
            <span>EXPLORE OUR SERVICES</span>
          </a>
        </div>

        {/* Trust & Craft Indicators */}
        <div className="grid grid-cols-3 gap-3 sm:gap-8 mt-12 sm:mt-16 pt-8 border-t border-[#262626]/80 w-full max-w-2xl bg-[#0B0B0B]/40 backdrop-blur-sm rounded-2xl px-4 py-4 sm:bg-transparent sm:backdrop-blur-none sm:p-0">
          <div className="flex flex-col items-center text-center">
            <div className="w-9 h-9 rounded-lg bg-[#141414]/90 border border-[#C8A24D]/30 flex items-center justify-center mb-1.5 text-[#C8A24D]">
              <Scissors className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-[#F5F2EA]">Precision Cut</span>
            <span className="text-[11px] text-[#A6A6A6] hidden sm:inline">Tailored to face shape</span>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-9 h-9 rounded-lg bg-[#141414]/90 border border-[#C8A24D]/30 flex items-center justify-center mb-1.5 text-[#C8A24D]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-[#F5F2EA]">Sterilized Tools</span>
            <span className="text-[11px] text-[#A6A6A6] hidden sm:inline">Medical grade hygiene</span>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-9 h-9 rounded-lg bg-[#141414]/90 border border-[#C8A24D]/30 flex items-center justify-center mb-1.5 text-[#C8A24D]">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-[#F5F2EA]">Reserved Slots</span>
            <span className="text-[11px] text-[#A6A6A6] hidden sm:inline">Zero unnecessary wait</span>
          </div>
        </div>

        {/* Video Controls Pill & Scroll Indicator */}
        <div className="mt-8 flex items-center space-x-4">
          {/* Subtle Ambient Video Controller */}
          <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#141414]/80 backdrop-blur-md border border-[#2B2B2B] text-[11px] text-[#A6A6A6]">
            <button
              onClick={togglePlay}
              className="hover:text-[#C8A24D] transition flex items-center space-x-1 focus:outline-none"
              aria-label={isPlaying ? 'Pause ambient video' : 'Play ambient video'}
            >
              {isPlaying ? <Pause className="w-3 h-3 text-[#C8A24D]" /> : <Play className="w-3 h-3 text-[#C8A24D]" />}
              <span className="hidden sm:inline">{isPlaying ? 'Live Video' : 'Paused'}</span>
            </button>
            <span className="text-[#333]">•</span>
            <button
              onClick={toggleMute}
              className="hover:text-[#C8A24D] transition focus:outline-none"
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            >
              {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-[#C8A24D]" />}
            </button>
          </div>

          {/* Scroll Down Arrow */}
          <a
            href="#services"
            className="text-[#A6A6A6] hover:text-[#C8A24D] transition-colors p-2"
            aria-label="Scroll to services"
          >
            <ArrowDown className="w-4 h-4 animate-bounce text-[#C8A24D]/80" />
          </a>
        </div>
      </div>
    </section>
  );
}
