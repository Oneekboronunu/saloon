'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Scissors, Lock, Mail, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your admin email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch {
      setError('Network communication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F2EA] flex items-center justify-center px-4 sm:px-6">
      <div className="max-w-md w-full">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="relative w-20 h-20 mx-auto mb-3 p-1">
            <img
              src="/images/logo.png"
              alt="GOLDEN CUTS"
              className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(200,162,77,0.4)]"
            />
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-[#F5F2EA]">
            GOLDEN CUTS
          </h1>
          <p className="text-xs text-[#C8A24D] uppercase tracking-[0.25em] mt-1 font-medium">
            Executive Portal
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 sm:p-8 shadow-2xl relative">
          <h2 className="text-lg font-serif font-bold text-[#F5F2EA] mb-1">
            Sign In
          </h2>
          <p className="text-xs text-[#A6A6A6] mb-6">
            Enter authorized credentials to manage appointments and salon settings.
          </p>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-[#2A1616] border border-[#EF4444]/40 flex items-center space-x-2 text-xs text-[#FCA5A5]">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#F5F2EA] mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@goldencuts.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B0B0B] border border-[#262626] text-sm text-[#F5F2EA] placeholder-[#555] focus:outline-none focus:border-[#C8A24D] transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F5F2EA] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B0B0B] border border-[#262626] text-sm text-[#F5F2EA] placeholder-[#555] focus:outline-none focus:border-[#C8A24D] transition"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#C8A24D] hover:bg-[#D8B45E] disabled:opacity-50 text-[#0B0B0B] font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#0B0B0B]" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Authenticate</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Default credentials note for review */}
          <div className="mt-6 pt-5 border-t border-[#222] text-center">
            <span className="text-[11px] text-[#737373] block mb-1">
              Initial Demo Admin Credentials:
            </span>
            <code className="text-[10px] bg-[#0E0E0E] px-2 py-1 rounded text-[#C8A24D] border border-[#262626]">
              admin@goldencuts.com / GoldenCuts@2026
            </code>
          </div>
        </div>

        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs text-[#737373] hover:text-[#C8A24D] transition"
          >
            ← Return to Golden Cuts Website
          </a>
        </div>
      </div>
    </div>
  );
}
