import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0B0B]">
      {/* Background radial gold glow */}
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#C8A24D]/15 blur-[90px] pointer-events-none animate-pulse" />

      {/* Luxury Gold Monogram Logo */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 mb-6">
          <img
            src="/images/logo.png"
            alt="GOLDEN CUTS"
            className="w-full h-full object-contain filter drop-shadow-[0_0_25px_rgba(200,162,77,0.45)] animate-gold-pulse"
          />
        </div>

        {/* Brand Name */}
        <span className="font-serif text-lg sm:text-xl font-bold tracking-[0.25em] text-[#F5F2EA] mb-2 drop-shadow-md">
          GOLDEN CUTS
        </span>

        <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.3em] text-[#C8A24D] mb-6">
          Bespoke Barbering • Chattogram
        </span>

        {/* Minimal Metallic Loading Progress Bar */}
        <div className="w-36 h-[2px] bg-[#1E1E1E] rounded-full overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#8C6D2D] via-[#C8A24D] to-[#F5E6B3] w-full animate-loader-slide rounded-full shadow-[0_0_10px_#C8A24D]" />
        </div>
      </div>
    </div>
  );
}
