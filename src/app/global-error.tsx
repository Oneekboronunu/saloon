'use client';

import React, { useEffect } from 'react';
import { Scissors } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global application error:', error);
  }, [error]);

  const handleReset = () => {
    try {
      if (typeof window !== 'undefined') {
        window.location.href = '/';
        return;
      }
    } catch {}
    try {
      reset();
    } catch {
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    }
  };

  return (
    <html lang="en">
      <body className="bg-[#0B0B0B] text-[#F5F2EA] min-h-screen flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-[#141414] border border-[#C8A24D]/40 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#0B0B0B] text-[#C8A24D] border border-[#C8A24D]/40 flex items-center justify-center mx-auto">
            <Scissors className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-serif font-bold text-[#F5F2EA]">
            GOLDEN CUTS
          </h2>
          <p className="text-xs text-[#A6A6A6]">
            A temporary system issue occurred. Click below to refresh the page.
          </p>
          {error?.message && (
            <p className="text-[11px] font-mono text-red-400 bg-black/40 p-2 rounded break-all">
              {error.message}
            </p>
          )}
          <button
            onClick={handleReset}
            className="w-full py-3 bg-[#C8A24D] hover:bg-[#D8B45E] text-[#0B0B0B] text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-lg"
          >
            Refresh Website
          </button>
        </div>
      </body>
    </html>
  );
}
