'use client';

import React, { useEffect, useState } from 'react';

export default function SiteLoader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Show the luxury monogram splash briefly, then smoothly fade out
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 700);

    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, 1100);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0B0B] transition-all duration-400 ease-out ${
        fading ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'
      }`}
      style={{ willChange: 'opacity, transform' }}
      aria-hidden="true"
    >
      {/* Background radial gold glow */}
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#C8A24D]/20 blur-[100px] pointer-events-none animate-pulse" />

      {/* Luxury Gold Shears Monogram Logo */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-8">
          <img
            src="/images/logo.png"
            alt="AIYAN Logo"
            className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(200,162,77,0.55)] animate-in zoom-in-95 duration-400"
          />
        </div>

        {/* Minimal Metallic Loading Progress Bar */}
        <div className="w-36 h-[2px] bg-[#1E1E1E] rounded-full overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#8C6D2D] via-[#C8A24D] to-[#F5E6B3] w-full animate-loader-slide rounded-full shadow-[0_0_12px_#C8A24D]" />
        </div>
      </div>
    </div>
  );
}
