'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Scissors, Menu, X, Calendar, Phone } from 'lucide-react';

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Services', href: '#services' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Why Us', href: '#why-us' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Location', href: '#location' },
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
            <div className="w-9 h-9 rounded-lg bg-[#151515] border border-[#C8A24D]/30 flex items-center justify-center text-[#C8A24D] group-hover:border-[#C8A24D] transition-colors">
              <Scissors className="w-5 h-5 transition-transform group-hover:rotate-45" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif tracking-widest text-lg sm:text-xl font-bold text-[#F5F2EA] group-hover:text-[#C8A24D] transition-colors">
                {salonName}
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C8A24D] font-medium -mt-1">
                Grooming & Salon
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

          {/* Desktop Right CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href={`tel:${phone}`}
              className="flex items-center space-x-2 text-xs text-[#A6A6A6] hover:text-[#C8A24D] transition-colors px-3 py-2 rounded-lg border border-transparent hover:border-[#262626]"
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
              <span>Book Appointment</span>
            </a>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center space-x-2 md:hidden">
            <a
              href="#booking"
              className="px-3.5 py-2 rounded-lg bg-[#C8A24D] text-[#0B0B0B] font-bold text-xs uppercase tracking-wider active:scale-95 transition"
            >
              Book
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
        <div className="md:hidden bg-[#0B0B0B]/98 border-b border-[#262626] px-5 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-2 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-base font-medium text-[#F5F2EA] hover:text-[#C8A24D] py-2 border-b border-[#181818] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 flex flex-col space-y-3">
            <a
              href={`tel:${phone}`}
              className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-lg border border-[#262626] text-sm text-[#A6A6A6]"
            >
              <Phone className="w-4 h-4 text-[#C8A24D]" />
              <span>Call: {phone}</span>
            </a>
            <a
              href="#booking"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center space-x-2 w-full py-3 rounded-lg bg-[#C8A24D] text-[#0B0B0B] font-bold text-sm uppercase tracking-wider shadow-lg"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
