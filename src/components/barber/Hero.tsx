'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Calendar, ArrowDown, Scissors, Clock, ShieldCheck, Play, Pause, Volume2, VolumeX, X, Maximize2 } from 'lucide-react';

interface HeroProps {
  salonName?: string;
  tagline?: string;
}

export default function Hero({
  salonName = 'GOLDEN CUTS',
  tagline = 'YOUR STYLE. YOUR SIGNATURE.',
}: HeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Force muted and autoplay programmatically for maximum mobile/desktop browser compatibility
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Browser restricted autoplay without user interaction
            setIsPlaying(false);
          });
      }
    }
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const openModal = () => {
    setShowModal(true);
    // Pause background video to save resources
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    // Resume background video
    if (videoRef.current) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <section className="relative min-h-[95vh] sm:min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#0B0B0B]">
      {/* ================= BACKGROUND VIDEO & CINEMATIC OVERLAYS ================= */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none">
        {/* Background HTML5 Video - Clearly visible & vibrant */}
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
            Dhanmondi, Dhaka • Appointments Open
          </span>
        </div>

        {/* Master Headline with enhanced readability against live video */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-[#F5F2EA] tracking-tight leading-[1.12] mb-5 sm:mb-6 drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
          YOUR STYLE.{' '}
          <span className="gold-gradient-text block sm:inline">
            YOUR SIGNATURE.
          </span>
        </h1>

        {/* Supporting Copy with enhanced contrast */}
        <p className="text-base sm:text-lg md:text-xl text-[#F5F2EA] font-normal max-w-2xl leading-relaxed mb-8 sm:mb-10 px-2 drop-shadow-[0_2px_18px_rgba(0,0,0,1)]">
          Precision cuts. Refined grooming. A better version of you. Experience bespoke barbering crafted by master artisans in an unhurried, private lounge.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-4 sm:px-0">
          <a
            href="#booking"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-4 rounded-xl bg-[#C8A24D] hover:bg-[#D8B45E] text-[#0B0B0B] font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_35px_rgba(200,162,77,0.45)] hover:shadow-[0_0_45px_rgba(200,162,77,0.6)] active:scale-[0.98] group"
          >
            <Calendar className="w-4 h-4 text-[#0B0B0B] group-hover:scale-110 transition-transform" />
            <span>BOOK YOUR APPOINTMENT</span>
          </a>

          <a
            href="#services"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-4 rounded-xl bg-[#151515]/90 hover:bg-[#1E1E1E] backdrop-blur-md text-[#F5F2EA] border border-[#C8A24D]/30 hover:border-[#C8A24D] font-semibold text-sm tracking-wide transition-all active:scale-[0.98] shadow-lg"
          >
            <span>EXPLORE OUR SERVICES</span>
          </a>

          {/* Quick Watch Reel Button */}
          <button
            onClick={openModal}
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-4 rounded-xl bg-[#0B0B0B]/80 hover:bg-[#151515] backdrop-blur-md text-[#C8A24D] border border-[#C8A24D]/40 hover:border-[#C8A24D] font-semibold text-sm tracking-wide transition-all active:scale-[0.98] shadow-lg"
          >
            <Play className="w-4 h-4 fill-[#C8A24D]" />
            <span>WATCH REEL (HD)</span>
          </button>
        </div>

        {/* Trust & Craft Indicators */}
        <div className="grid grid-cols-3 gap-3 sm:gap-8 mt-12 sm:mt-16 pt-8 border-t border-[#262626]/90 w-full max-w-2xl bg-[#0B0B0B]/70 backdrop-blur-md rounded-2xl px-4 py-4 sm:p-5 shadow-2xl">
          <div className="flex flex-col items-center text-center">
            <div className="w-9 h-9 rounded-lg bg-[#141414] border border-[#C8A24D]/35 flex items-center justify-center mb-1.5 text-[#C8A24D]">
              <Scissors className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-[#F5F2EA]">Precision Cut</span>
            <span className="text-[11px] text-[#A6A6A6] hidden sm:inline">Tailored to face shape</span>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-9 h-9 rounded-lg bg-[#141414] border border-[#C8A24D]/35 flex items-center justify-center mb-1.5 text-[#C8A24D]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-[#F5F2EA]">Sterilized Tools</span>
            <span className="text-[11px] text-[#A6A6A6] hidden sm:inline">Medical grade hygiene</span>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-9 h-9 rounded-lg bg-[#141414] border border-[#C8A24D]/35 flex items-center justify-center mb-1.5 text-[#C8A24D]">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-[#F5F2EA]">Reserved Slots</span>
            <span className="text-[11px] text-[#A6A6A6] hidden sm:inline">Zero unnecessary wait</span>
          </div>
        </div>

        {/* Background Video Control Bar */}
        <div className="mt-8 flex items-center space-x-4">
          <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-[#141414]/90 backdrop-blur-md border border-[#C8A24D]/30 text-xs text-[#F5F2EA] shadow-xl">
            <button
              onClick={togglePlay}
              className="hover:text-[#C8A24D] transition flex items-center space-x-1.5 focus:outline-none"
              aria-label={isPlaying ? 'Pause background video' : 'Play background video'}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-[#C8A24D]" />
                  <span className="text-[11px] text-[#A6A6A6] font-medium">Pause Background</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-[#C8A24D] fill-[#C8A24D]" />
                  <span className="text-[11px] text-[#C8A24D] font-medium">Play Background</span>
                </>
              )}
            </button>
            <span className="text-[#333]">|</span>
            <button
              onClick={toggleMute}
              className="hover:text-[#C8A24D] transition flex items-center space-x-1 focus:outline-none"
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-[#A6A6A6]" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-[#C8A24D]" />
              )}
              <span className="text-[11px] text-[#A6A6A6] hidden sm:inline">
                {isMuted ? 'Muted' : 'Sound On'}
              </span>
            </button>
          </div>

          <a
            href="#services"
            className="text-[#A6A6A6] hover:text-[#C8A24D] transition-colors p-2"
            aria-label="Scroll to services"
          >
            <ArrowDown className="w-4 h-4 animate-bounce text-[#C8A24D]" />
          </a>
        </div>
      </div>

      {/* ================= FULLSCREEN / MODAL VIDEO VIEWER ================= */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
          onClick={closeModal}
        >
          <div 
            className="relative w-full max-w-4xl bg-[#151515] border border-[#C8A24D]/40 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(200,162,77,0.25)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#262626] bg-[#0E0E0E]">
              <div className="flex items-center space-x-2">
                <Scissors className="w-4 h-4 text-[#C8A24D]" />
                <span className="font-serif font-bold text-sm text-[#F5F2EA] tracking-wider">
                  GOLDEN CUTS — CRAFTSMANSHIP REEL
                </span>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-lg bg-[#1B1B1B] hover:bg-[#252525] border border-[#333] flex items-center justify-center text-[#A6A6A6] hover:text-white transition"
                aria-label="Close video"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Player in Modal */}
            <div className="relative aspect-video w-full bg-black">
              <video
                ref={modalVideoRef}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
                src="/videos/hero.mp4"
              >
                <source src="/videos/hero.mp4" type="video/mp4" />
                <source src="https://api-f.streamable.com/api/v1/videos/akquln/mp4" type="video/mp4" />
                Your browser does not support HTML5 video.
              </video>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#0E0E0E] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#A6A6A6]">
              <span>Direct Stream: <a href="https://streamable.com/akquln" target="_blank" rel="noopener noreferrer" className="text-[#C8A24D] underline hover:text-white">streamable.com/akquln</a></span>
              <a
                href="#booking"
                onClick={closeModal}
                className="px-4 py-2 rounded-lg bg-[#C8A24D] text-[#0B0B0B] font-bold tracking-wider hover:bg-[#D8B45E] transition"
              >
                BOOK THIS CUT NOW
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
