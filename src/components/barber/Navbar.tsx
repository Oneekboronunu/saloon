'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Calendar, Phone, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface NavbarProps {
  salonName?: string;
  phone?: string;
}

export default function Navbar({
  salonName = 'GOLDEN CUTS',
  phone = '01780625295',
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t('nav_services'), href: '#services' },
    { label: t('nav_pricing'), href: '#pricing' },
    { label: t('nav_why_us'), href: '#why-us' },
    { label: t('nav_gallery'), href: '#gallery' },
    { label: t('nav_location'), href: '#location' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0B0B0B]/95 backdrop-blur-md border-b border-[#262626] shadow-xl py-3'
          : 'bg-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A24D]"
          >
            <div className="relative w-10 h-10 rounded-xl bg-[#141414] border border-[#C8A24D]/35 flex items-center justify-center p-1 group-hover:border-[#C8A24D] group-hover:shadow-[0_0_18px_rgba(200,162,77,0.35)] transition-all overflow-hidden">
              <img
                src="/images/logo-nav.png"
                alt="Golden Cuts Logo"
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif tracking-widest text-lg sm:text-xl font-bold text-[#F5F2EA] group-hover:text-[#C8A24D] transition-colors">
                {salonName}
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C8A24D] font-medium -mt-1">
                {language === 'bn' ? 'গ্রুমিং ও সেলুন' : 'Grooming & Salon'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-[#A6A6A6] hover:text-[#F5F2EA] transition-colors tracking-wide py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Right CTA & Language Switcher */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Bilingual Toggle Pill */}
            <div className="inline-flex items-center rounded-lg bg-[#141414] border border-[#C8A24D]/30 p-0.5 text-xs">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  language === 'en'
                    ? 'bg-[#C8A24D] text-[#0B0B0B] font-bold shadow-sm'
                    : 'text-[#A6A6A6] hover:text-[#F5F2EA]'
                }`}
                title="Switch to English"
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('bn')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  language === 'bn'
                    ? 'bg-[#C8A24D] text-[#0B0B0B] font-bold shadow-sm'
                    : 'text-[#A6A6A6] hover:text-[#F5F2EA]'
                }`}
                title="বাংলায় পরিবর্তন করুন"
              >
                বাংলা
              </button>
            </div>

            <a
              href={`tel:${phone}`}
              className="flex items-center space-x-1.5 text-xs text-[#A6A6A6] hover:text-[#C8A24D] transition-colors px-2.5 py-2 rounded-lg border border-transparent hover:border-[#262626]"
              aria-label={`Call us at ${phone}`}
            >
              <Phone className="w-3.5 h-3.5 text-[#C8A24D]" />
              <span>{phone}</span>
            </a>

            <a
              href="#booking"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-[#C8A24D] hover:bg-[#D8B45E] text-[#0B0B0B] font-semibold text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{t('nav_book')}</span>
            </a>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center space-x-2 md:hidden">
            {/* Mobile Language Switcher */}
            <div className="inline-flex items-center rounded-lg bg-[#141414] border border-[#C8A24D]/30 p-0.5 text-[11px]">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded-md transition-all ${
                  language === 'en'
                    ? 'bg-[#C8A24D] text-[#0B0B0B] font-bold'
                    : 'text-[#A6A6A6]'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('bn')}
                className={`px-2 py-1 rounded-md transition-all ${
                  language === 'bn'
                    ? 'bg-[#C8A24D] text-[#0B0B0B] font-bold'
                    : 'text-[#A6A6A6]'
                }`}
              >
                বাংলা
              </button>
            </div>

            <a
              href="#booking"
              className="px-3 py-1.5 rounded-lg bg-[#C8A24D] text-[#0B0B0B] font-bold text-xs uppercase tracking-wider active:scale-95 transition"
            >
              {language === 'bn' ? 'বুক' : 'Book'}
            </a>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-[#F5F2EA] hover:text-[#C8A24D] bg-[#151515] border border-[#262626] focus:outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0E0E0E] border-b border-[#262626] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-[#F5F2EA] hover:text-[#C8A24D] transition-colors py-2 px-3 rounded-lg hover:bg-[#181818]"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-3 border-t border-[#1F1F1F] flex flex-col space-y-2.5">
            <a
              href={`tel:${phone}`}
              className="flex items-center justify-center space-x-2 py-2.5 rounded-lg bg-[#151515] text-xs font-medium text-[#F5F2EA] border border-[#2B2B2B]"
            >
              <Phone className="w-3.5 h-3.5 text-[#C8A24D]" />
              <span>{language === 'bn' ? 'সরাসরি কল করুন:' : 'Call us:'} {phone}</span>
            </a>
            <a
              href="#booking"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center space-x-2 py-3 rounded-lg bg-[#C8A24D] text-[#0B0B0B] text-xs font-bold uppercase tracking-wider shadow-md"
            >
              <Calendar className="w-4 h-4" />
              <span>{t('nav_book')}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
