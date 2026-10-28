'use client';

import React from 'react';
import Link from 'next/link';
import { Scissors, Shield, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  salonName?: string;
  phone?: string;
  address?: string;
}

export default function Footer({
  salonName = 'GOLDEN CUTS',
  phone = '01780625295',
  address = 'Housing Colony Road, Steel Mill, North Patenga, Chattogram',
}: FooterProps) {
  return (
    <footer className="bg-[#070707] border-t border-[#1C1C1C] text-[#A6A6A6] pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-[#1C1C1C]">
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="relative w-9 h-9 rounded-xl bg-[#141414] border border-[#C8A24D]/35 flex items-center justify-center p-1 overflow-hidden shadow-md">
                <img
                  src="/images/logo-nav.png"
                  alt="Golden Cuts Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-serif tracking-widest text-lg font-bold text-[#F5F2EA]">
                {salonName}
              </span>
            </div>
            <p className="text-xs text-[#A6A6A6] max-w-sm leading-relaxed">
              Premium men&apos;s barbering and grooming salon. Providing bespoke precision haircuts, beard detailing, and luxury hot towel rituals.
            </p>
            <div className="flex items-center space-x-4 pt-1 text-xs">
              <span className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C8A24D]" />
                <span>North Patenga, Chattogram</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-[#C8A24D]" />
                <span>{phone}</span>
              </span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#F5F2EA] font-semibold mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#services" className="hover:text-[#C8A24D] transition-colors">
                  Services & Pricing
                </a>
              </li>
              <li>
                <a href="#booking" className="hover:text-[#C8A24D] transition-colors">
                  Book Appointment
                </a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-[#C8A24D] transition-colors">
                  Why Golden Cuts
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-[#C8A24D] transition-colors">
                  Portfolio Gallery
                </a>
              </li>
              <li>
                <a href="#location" className="hover:text-[#C8A24D] transition-colors">
                  Location & Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal & Support */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#F5F2EA] font-semibold mb-3">
              Staff Portal
            </h4>
            <p className="text-xs text-[#737373] mb-3 leading-relaxed">
              Authorized barbershop management system.
            </p>
            <Link
              href="/admin/login"
              className="inline-flex items-center space-x-1.5 text-xs text-[#C8A24D] hover:underline"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#666] gap-3">
          <p>© {new Date().getFullYear()} {salonName}. All rights reserved.</p>
          <p className="text-[11px] text-[#555]">
            Built with modern performance standards for mobile devices.
          </p>
        </div>
      </div>
    </footer>
  );
}
