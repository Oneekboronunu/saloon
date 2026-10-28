'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  number?: string; // international format e.g. 8801780625295
  message?: string;
}

export default function WhatsAppButton({
  number = '8801780625295',
  message = "Hello, I'd like to book a salon appointment.",
}: WhatsAppButtonProps) {
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

  return (
    <aside aria-label="WhatsApp customer support" className="fixed bottom-6 right-5 sm:bottom-7 sm:right-7 z-40">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="group relative flex items-center justify-center w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-[0_4px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_6px_30px_rgba(37,211,102,0.6)] active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40"
      >
        {/* Subtle breathing ripple */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/30 animate-ping opacity-50 pointer-events-none" />

        {/* Official WhatsApp-style icon */}
        <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 fill-current text-white relative z-10" />

        {/* Desktop Tooltip */}
        <span className="hidden md:block absolute right-16 px-3 py-1.5 rounded-lg bg-[#141414] border border-[#2B2B2B] text-xs font-semibold text-[#F5F2EA] shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Chat with us on WhatsApp
        </span>
      </a>
    </aside>
  );
}
