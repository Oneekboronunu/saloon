'use client';

import React, { useState } from 'react';
import { Eye, X, Scissors, Sparkles, Filter } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  description: string;
  imageAlt: string;
  tag: string;
}

export default function Gallery() {
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: '1',
      title: 'Precision Mid Skin Fade',
      category: 'FADES',
      tag: 'Fade & Taper',
      description: 'Zero foil blend seamlessly transitioning into a textured matte crop.',
      imageAlt: 'Sample Mid Skin Fade transformation demonstration',
    },
    {
      id: '2',
      title: 'Sculpted Beard & Razor Contour',
      category: 'BEARDS',
      tag: 'Beard Art',
      description: 'Crisp cheek lines with tapered sideburns and steam treatment.',
      imageAlt: 'Sample Beard trim and straight razor lineup demonstration',
    },
    {
      id: '3',
      title: 'Classic Side Part & Scissor Finish',
      category: 'HAIRCUTS',
      tag: 'Classic Cut',
      description: 'Timeless scissor taper cut with natural flow and soft neckline.',
      imageAlt: 'Sample classic gentleman side part haircut',
    },
    {
      id: '4',
      title: 'Low Drop Fade with Crop Top',
      category: 'FADES',
      tag: 'Modern Fade',
      description: 'Subtle low curve around the ears highlighting dense top texture.',
      imageAlt: 'Sample low drop fade styling demonstration',
    },
    {
      id: '5',
      title: 'Full Beard Shaping & Mustache Detailing',
      category: 'BEARDS',
      tag: 'Beard Care',
      description: 'Volume reduction with organic oil conditioning and scissor finishing.',
      imageAlt: 'Sample full beard shaping and styling',
    },
    {
      id: '6',
      title: 'Executive Pompadour & Taper',
      category: 'HAIRCUTS',
      tag: 'Signature Styling',
      description: 'High-volume blowout styled with water-based matte pomade.',
      imageAlt: 'Sample executive pompadour hairstyle',
    },
  ];

  const filteredItems = activeTab === 'ALL'
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeTab);

  return (
    <section id="gallery" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#101010] border-t border-[#1F1F1F]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C8A24D] font-semibold block mb-2">
            Visual Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#F5F2EA] tracking-tight">
            Craftsmanship Gallery
          </h2>
          <div className="w-14 h-0.5 bg-[#C8A24D] mx-auto mt-3 mb-3 opacity-70" />
          <p className="text-xs sm:text-sm text-[#A6A6A6]">
            Representative sample cuts and grooming techniques. Curated to illustrate our barbering standards.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
          {[
            { id: 'ALL', label: 'All Works' },
            { id: 'FADES', label: 'Skin Fades' },
            { id: 'BEARDS', label: 'Beard Grooming' },
            { id: 'HAIRCUTS', label: 'Classic Cuts' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === tab.id
                  ? 'bg-[#C8A24D] text-[#0B0B0B] shadow-md'
                  : 'bg-[#181818] text-[#A6A6A6] hover:text-[#F5F2EA] border border-[#262626]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group relative rounded-2xl bg-[#141414] border border-[#262626] overflow-hidden cursor-pointer hover:border-[#C8A24D]/50 transition-all duration-300"
            >
              {/* Image Canvas / Card Artwork */}
              <div className="h-56 sm:h-64 bg-[#181818] relative flex items-center justify-center p-6 overflow-hidden">
                {/* Stylized Barber Visual Placeholder Pattern */}
                <div
                  className="absolute inset-0 opacity-15"
                  style={{
                    backgroundImage: `radial-gradient(circle at 50% 50%, #C8A24D 1.5px, transparent 1.5px)`,
                    backgroundSize: '20px 20px',
                  }}
                />
                
                {/* Central Iconic Badge */}
                <div className="relative z-10 w-20 h-20 rounded-2xl bg-[#0B0B0B]/80 border border-[#C8A24D]/30 flex flex-col items-center justify-center text-[#C8A24D] group-hover:scale-105 group-hover:border-[#C8A24D] transition-transform">
                  <Scissors className="w-8 h-8" />
                  <span className="text-[9px] font-mono tracking-widest uppercase mt-1 text-[#F5F2EA]">
                    {item.tag}
                  </span>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#C8A24D] text-[#0B0B0B] text-xs font-bold uppercase tracking-wider">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </span>
                </div>
              </div>

              {/* Item Info */}
              <div className="p-4 sm:p-5">
                <span className="text-[10px] uppercase tracking-wider text-[#C8A24D] font-mono font-medium block mb-1">
                  {item.tag}
                </span>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#F5F2EA] mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-[#A6A6A6] line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#141414] border border-[#C8A24D]/40 rounded-2xl max-w-lg w-full p-6 relative animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 p-2 rounded-lg text-[#A6A6A6] hover:text-[#F5F2EA] bg-[#1E1E1E]"
                aria-label="Close preview"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="h-52 bg-[#0B0B0B] rounded-xl border border-[#262626] flex items-center justify-center text-[#C8A24D] mb-5">
                <Scissors className="w-12 h-12" />
              </div>

              <span className="text-xs uppercase tracking-widest text-[#C8A24D] font-mono block mb-1">
                {selectedItem.tag}
              </span>
              <h3 className="font-serif text-xl font-bold text-[#F5F2EA] mb-2">
                {selectedItem.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#A6A6A6] leading-relaxed mb-6">
                {selectedItem.description}
              </p>

              <div className="pt-4 border-t border-[#262626] flex items-center justify-between">
                <span className="text-xs text-[#737373]">Representative Sample Portfolio</span>
                <a
                  href="#booking"
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#ECC876] via-[#C8A24D] to-[#9F7A28] hover:from-[#F5D589] hover:via-[#D4AE55] hover:to-[#B08832] text-[#0B0B0B] font-bold text-xs uppercase tracking-wider shadow-md border border-[#F5E6B3]/40 active:scale-95 transition-all"
                >
                  Book Similar Cut
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
