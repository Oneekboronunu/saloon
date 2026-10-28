'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F2EA] flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center p-8 bg-[#141414] rounded-2xl border border-[#262626] shadow-2xl">
        <div className="w-14 h-14 rounded-full bg-red-950/60 border border-red-500/40 text-red-400 mx-auto flex items-center justify-center mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>

        <h2 className="font-serif font-bold text-xl text-[#F5F2EA] mb-2">
          Something went wrong
        </h2>

        <p className="text-xs sm:text-sm text-[#A6A6A6] mb-6 leading-relaxed">
          An unexpected glitch occurred while loading the barbering portal. Please retry or return to homepage.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-[#C8A24D] text-[#0B0B0B] text-xs font-bold uppercase tracking-wider hover:bg-[#D8B45E] transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl border border-[#2B2B2B] text-xs font-semibold text-[#A6A6A6] hover:text-[#F5F2EA] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
