import Link from 'next/link';
import { Scissors, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F2EA] flex flex-col items-center justify-center text-center p-6 space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-[#141414] border border-[#C8A24D]/40 flex items-center justify-center text-[#C8A24D] shadow-xl">
        <Scissors className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <div className="text-xs uppercase font-mono tracking-widest text-[#C8A24D]">
          404 — Page Not Found
        </div>
        <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#F5F2EA]">
          This Page Has Been Trimmed Away
        </h1>
        <p className="text-xs sm:text-sm text-[#A6A6A6] max-w-md mx-auto">
          The link you followed may be expired or the appointment page has been relocated.
        </p>
      </div>

      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-[#C8A24D] hover:bg-[#D8B45E] text-[#0B0B0B] font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition shadow-lg"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Golden Cuts Home</span>
      </Link>
    </div>
  );
}
