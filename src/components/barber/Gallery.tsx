'use client';

import React, { useState, useEffect } from 'react';
import { Eye, X, Scissors, Play, Video, Sparkles, Filter, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { GalleryItem, DEFAULT_GALLERY_ITEMS, getEmbedVideoUrl, getVideoThumbnail } from '@/lib/gallery';

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>(DEFAULT_GALLERY_ITEMS);
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const { language } = useLanguage();

  // Fetch live gallery items updated from the Admin Panel
  useEffect(() => {
    let isMounted = true;
    async function loadGallery() {
      try {
        const res = await fetch('/api/gallery');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.items) && data.items.length > 0 && isMounted) {
            setItems(data.items);
          }
        }
      } catch (err) {
        // Fallback gracefully to default items
      }
    }
    loadGallery();
    return () => {
      isMounted = false;
    };
  }, []);

  const filterTabs = [
    { id: 'ALL', label: language === 'bn' ? 'সকল কাজ' : 'All Works' },
    { id: 'FADES', label: language === 'bn' ? 'স্কিন ফেডস' : 'Skin Fades' },
    { id: 'BEARDS', label: language === 'bn' ? 'বিয়ার্ড আর্ট' : 'Beard Grooming' },
    { id: 'HAIRCUTS', label: language === 'bn' ? 'ক্লাসিক কাটস' : 'Classic Cuts' },
    { id: 'STYLING', label: language === 'bn' ? 'সিগনেচার স্টাইলিং' : 'Signature Styling' },
  ];

  const filteredItems = activeTab === 'ALL'
    ? items
    : items.filter((item) => item.category === activeTab);

  return (
    <section id="gallery" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#101010] border-t border-[#1F1F1F]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C8A24D] font-semibold block mb-2">
            {language === 'bn' ? 'ভিজ্যুয়াল পোর্টফোলিও' : 'Visual Portfolio'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#F5F2EA] tracking-tight">
            {language === 'bn' ? 'ক্রাফটম্যানশিপ গ্যালারি' : 'Craftsmanship Gallery'}
          </h2>
          <div className="w-14 h-0.5 bg-gradient-to-r from-transparent via-[#C8A24D] to-transparent mx-auto mt-3 mb-3 opacity-80" />
          <p className="text-xs sm:text-sm text-[#A6A6A6]">
            {language === 'bn'
              ? 'আমাদের মাস্টার বারবারদের নিপুন হেয়ারকাট, স্কিন ফেড, দাড়ি ডিজাইন ও স্টাইলিংয়ের বাস্তব পোর্টফোলিও।'
              : 'Real photographs and transformations created by our master craftsmen. Tailored to your signature style.'}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#ECC876] via-[#C8A24D] to-[#9F7A28] text-[#0B0B0B] font-bold shadow-[0_2px_12px_rgba(200,162,77,0.35)]'
                  : 'bg-[#181818] text-[#A6A6A6] hover:text-[#F5F2EA] border border-[#262626]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isVideo = item.mediaType === 'VIDEO';
            const displayImage = isVideo ? getVideoThumbnail(item.mediaUrl, item.thumbnailUrl) : item.mediaUrl;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group relative rounded-2xl bg-[#141414] border border-[#262626] overflow-hidden cursor-pointer hover:border-[#C8A24D]/60 hover:shadow-[0_8px_30px_rgba(200,162,77,0.2)] transition-all duration-300 flex flex-col"
              >
                {/* Media Artwork Area */}
                <div className="h-60 sm:h-64 bg-[#0B0B0B] relative overflow-hidden shrink-0">
                  <img
                    src={displayImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />

                  {/* Gradient bottom shadow for legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {/* Video Badge or Category Pill */}
                  <div className="absolute top-3 left-3 z-10 flex items-center space-x-1.5">
                    {isVideo ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-red-600/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-md">
                        <Video className="w-3 h-3" />
                        <span>VIDEO</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#0B0B0B]/80 text-[#C8A24D] border border-[#C8A24D]/35 text-[10px] font-mono uppercase tracking-wider backdrop-blur-md">
                        <Scissors className="w-2.5 h-2.5" />
                        <span>{item.tag}</span>
                      </span>
                    )}
                  </div>

                  {/* Center Play Button for Videos */}
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-[#0B0B0B]/80 border-2 border-[#C8A24D] text-[#C8A24D] flex items-center justify-center shadow-[0_0_20px_rgba(200,162,77,0.5)] group-hover:scale-110 group-hover:bg-[#C8A24D] group-hover:text-[#0B0B0B] transition-all duration-300">
                        <Play className="w-6 h-6 ml-0.5 fill-current" />
                      </div>
                    </div>
                  )}

                  {/* Hover Inspect Pill */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    {!isVideo && (
                      <span className="inline-flex items-center space-x-1 px-4 py-2 rounded-xl bg-gradient-to-r from-[#ECC876] via-[#C8A24D] to-[#9F7A28] text-[#0B0B0B] text-xs font-bold uppercase tracking-wider shadow-lg">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'বিস্তারিত দেখুন' : 'Inspect Details'}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Info Text */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#C8A24D] font-mono font-medium block mb-1">
                      {item.tag}
                    </span>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#F5F2EA] group-hover:text-[#C8A24D] transition-colors mb-1.5 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#A6A6A6] line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#262626] flex items-center justify-between text-[11px] text-[#8E8E8E]">
                    <span className="font-medium text-[#C8A24D]/80">
                      {isVideo ? (language === 'bn' ? 'ভিডিও শোকেস' : 'Video Showcase') : (language === 'bn' ? 'ফটো পোর্টফোলিও' : 'HD Showcase')}
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform text-[#C8A24D]">
                      →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Lightbox / Video Player Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
            <div className="bg-[#141414] border border-[#C8A24D]/40 rounded-2xl max-w-2xl w-full p-5 sm:p-7 relative shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-xl text-[#A6A6A6] hover:text-[#F5F2EA] bg-[#1E1E1E] border border-[#2B2B2B] hover:border-[#C8A24D] transition-all"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Media Display: Video Player or High-Res Image */}
              <div className="relative rounded-xl overflow-hidden bg-black border border-[#262626] mb-5 shrink-0 aspect-video flex items-center justify-center">
                {selectedItem.mediaType === 'VIDEO' ? (
                  selectedItem.mediaUrl.includes('youtube') || selectedItem.mediaUrl.includes('youtu.be') || selectedItem.mediaUrl.includes('vimeo') ? (
                    <iframe
                      src={getEmbedVideoUrl(selectedItem.mediaUrl)}
                      title={selectedItem.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={selectedItem.mediaUrl}
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  )
                ) : (
                  <img
                    src={selectedItem.mediaUrl}
                    alt={selectedItem.title}
                    className="w-full h-full object-cover sm:object-contain"
                  />
                )}
              </div>

              {/* Content Details */}
              <div className="overflow-y-auto pr-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-[11px] uppercase tracking-wider text-[#C8A24D] font-mono px-2 py-0.5 rounded-md bg-[#C8A24D]/10 border border-[#C8A24D]/30">
                    {selectedItem.tag}
                  </span>
                  {selectedItem.mediaType === 'VIDEO' && (
                    <span className="text-[10px] uppercase tracking-wider bg-red-600/90 text-white font-bold px-2 py-0.5 rounded-md">
                      Video Demonstration
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#F5F2EA] mb-2 leading-tight">
                  {selectedItem.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#BDB5A3] leading-relaxed mb-6">
                  {selectedItem.description}
                </p>

                {/* Footer Action */}
                <div className="pt-4 border-t border-[#262626] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs text-[#737373]">
                    {language === 'bn' ? 'আইয়ান সেলুন প্রিমিয়াম বারবারিং' : 'AIYAN Hair Cutting Salon Showcase'}
                  </span>
                  <a
                    href="/#booking"
                    onClick={() => setSelectedItem(null)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ECC876] via-[#C8A24D] to-[#9F7A28] hover:from-[#F5D589] hover:via-[#D4AE55] hover:to-[#B08832] text-[#0B0B0B] font-bold text-xs uppercase tracking-wider shadow-lg border border-[#F5E6B3]/40 active:scale-95 transition-all text-center flex items-center justify-center space-x-1.5"
                  >
                    <span>{language === 'bn' ? 'এই স্টাইলটি বুক করুন' : 'Book Similar Style'}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
