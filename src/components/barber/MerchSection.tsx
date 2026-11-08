'use client';

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Check, 
  Sparkles, 
  X, 
  Phone, 
  MapPin, 
  User, 
  Plus, 
  Minus, 
  ShieldCheck, 
  Truck, 
  ExternalLink 
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export interface MerchProduct {
  id: string;
  name: string;
  nameBn: string;
  tag: string;
  tagBn: string;
  price: number;
  size: string;
  image: string;
  secondaryImage?: string;
  description: string;
  descriptionBn: string;
  features: string[];
  featuresBn: string[];
}

export const MERCH_PRODUCTS: MerchProduct[] = [
  {
    id: 'matte-clay',
    name: 'Matte Hair Clays & Waxes',
    nameBn: 'ম্যাট হেয়ার ক্লে ও ওয়াক্স',
    tag: 'Best Seller • Firm Hold',
    tagBn: 'সর্বাধিক বিক্রিত • স্ট্রং হোল্ড',
    price: 850,
    size: '100g / 3.53oz',
    image: '/images/products/matte-clay-model.jpg',
    secondaryImage: '/images/products/matte-clay.jpg',
    description:
      'Hair clays are the highest-selling hair styling items for modern salons. They offer a firm, re-stylable hold with a natural, no-shine matte finish that helps clients recreate sharp texture at home.',
    descriptionBn:
      'আধুনিক সেলুনের সবচেয়ে জনপ্রিয় ও সর্বোচ্চ বিক্রিত হেয়ার স্টাইলিং আইটেম। এটি কোনো অতিরিক্ত গ্লেস ছাড়াই ন্যাচারাল নো-শাইন ম্যাট ফিনিশ এবং রিস্টাইলেবল স্ট্রং হোল্ড প্রদান করে যা সেলুনের মতো টেক্সচার প্রতিদিন ঘরে বসেই এনে দেয়।',
    features: ['Strong Re-stylable Hold', 'Natural Zero-Shine Matte Finish', 'Easy Water-Soluble Rinse'],
    featuresBn: ['স্ট্রং রিস্টাইলেবল হোল্ড', 'ন্যাচারাল নো-শাইন ম্যাট লুক', 'সহজেই পানিতে পরিষ্কারযোগ্য'],
  },
  {
    id: 'styling-powder',
    name: 'Volumizing Styling Powders',
    nameBn: 'ভলিউমাইজিং স্টাইলিং পাউডার',
    tag: 'Trending • Instant Lift',
    tagBn: 'টপ ট্রেন্ডিং • ইনস্ট্যান্ট ভলিউম',
    price: 750,
    size: '10.2g / 0.36oz',
    image: '/images/products/styling-powder.jpg',
    description:
      'Styling powder is a massively trending product category. It provides instant root lift, invisible grip, and oil absorption for fine or thinning hair without leaving any greasy residue.',
    descriptionBn:
      'বর্তমানে তরুণদের কাছে অত্যন্ত ট্রেন্ডি হেয়ার প্রোডাক্ট। এটি পাতলা চুলের গোড়া থেকে ইনস্ট্যান্ট লিফট, অদৃশ্য গ্রিপ ও অতিরিক্ত তেল শুষে নেয়—কোনো রকম চটচটে বা আঠালো ভাব ছাড়াই।',
    features: ['Instant Root Volume & Lift', 'Absorbs Excess Scalp Oil', 'Lightweight & Non-Greasy'],
    featuresBn: ['চুলের গোড়ায় তাৎক্ষণিক ভলিউম', 'অতিরিক্ত তেল ও তৈলাক্ততা দূরীকরণ', 'হালকা ও সম্পূর্ণ নন-গ্রিসি'],
  },
  {
    id: 'beard-oil',
    name: 'Premium Beard Oils & Serums',
    nameBn: 'প্রিমিয়াম বিয়ার্ড অয়েল ও সিরাম',
    tag: 'Botanical • Deep Care',
    tagBn: 'ন্যাচারাল কেয়ার • সফট ফিনিশ',
    price: 650,
    size: '50ml / 1.69 fl oz',
    image: '/images/products/beard-oil.jpg',
    description:
      'Retailing beard oils is highly profitable. They are lightweight, aromatic serums blended with botanical extracts (like argan or jojoba) designed to tame coarse facial hair and eliminate under-beard itch.',
    descriptionBn:
      'আর্গান ও জোজোবা বোটানিক্যাল এক্সট্রাক্ট সমৃদ্ধ হালকা সুবাসিত প্রিমিয়াম সিরাম। রুক্ষ দাড়ি কোমল ও মসৃণ করে, দাড়ির ভেতরের চুলকানি ও শুষ্কতা পুরোপুরি দূর করে স্মার্ট শাইন এনে দেয়।',
    features: ['Argan & Jojoba Botanical Blend', 'Eliminates Under-Beard Itch', 'Softens & Tames Coarse Hair'],
    featuresBn: ['আর্গান ও জোজোবা এসেনশিয়াল ব্লেন্ড', 'দাড়ির নিচের চুলকানি ও শুষ্কতা দূর করে', 'রুক্ষ দাড়ি নরম ও সুবিন্যস্ত রাখে'],
  },
  {
    id: 'aftershave-balm',
    name: 'Soothing Aftershave Balms & Skincare',
    nameBn: 'সুদিং আফটারশেভ বাম ও স্কিনকেয়ার',
    tag: 'Alcohol-Free • Calm Skin',
    tagBn: 'অ্যালকোহল মুক্ত • স্কিন রিপেয়ার',
    price: 800,
    size: '100ml / 3.4 fl oz',
    image: '/images/products/aftershave-balm.jpg',
    description:
      'Perfect for an impulse checkout, these non-greasy, alcohol-free post-shave balms immediately calm razor burn, lock in moisture, and repair the skin barrier after a fresh lineup or clean shave.',
    descriptionBn:
      'শেভ বা ফ্রেশ লাইন-আপের পর ত্বকের যত্নে অসাধারণ নন-গ্রিসি ও অ্যালকোহল মুক্ত আফটারশেভ বাম। এটি রেজার বার্ন তাৎক্ষণিকভাবে শান্ত করে, ত্বকের আর্দ্রতা ধরে রাখে এবং ত্বককে রাখে কোমল ও ঠান্ডা।',
    features: ['Calms Razor Burn Immediately', '100% Alcohol-Free Gentle Formula', 'Repairs & Hydrates Skin Barrier'],
    featuresBn: ['রেজার বার্ন ও জ্বালা দূর করে', '১০০% অ্যালকোহল-মুক্ত কোমল ফর্মুলা', 'ত্বকের আর্দ্রতা রক্ষা ও রিপেয়ার করে'],
  },
];

interface MerchSectionProps {
  currency?: string;
  whatsappNumber?: string;
}

export default function MerchSection({
  currency = '৳',
  whatsappNumber = '8801780625295',
}: MerchSectionProps) {
  const { t, language } = useLanguage();

  const [activeProduct, setActiveProduct] = useState<MerchProduct | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderRef, setOrderRef] = useState('');

  const openOrderModal = (product: MerchProduct) => {
    setActiveProduct(product);
    setQuantity(1);
    setIsSubmitted(false);
    setOrderRef(`GC-PRD-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  const closeOrderModal = () => {
    setActiveProduct(null);
    setIsSubmitted(false);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!activeProduct || !clientName.trim() || !phone.trim() || !address.trim()) {
      return;
    }

    const prodName = language === 'bn' ? activeProduct.nameBn : activeProduct.name;
    const totalAmount = activeProduct.price * quantity;

    // Clean phone number for WhatsApp message
    const formattedPhone = phone.trim();

    // Compose luxury WhatsApp order dispatch message
    const message = `🛍️ *NEW PRODUCT ORDER — GOLDEN CUTS*
━━━━━━━━━━━━━━━━━━━━
📦 *Product:* ${prodName}
📏 *Size/Vol:* ${activeProduct.size}
🔢 *Quantity:* ${quantity}
💰 *Total Amount:* ${currency}${totalAmount}
🔖 *Order Ref:* ${orderRef}

👤 *Client Name:* ${clientName.trim()}
📱 *WhatsApp/Phone:* ${formattedPhone}
📍 *Delivery Address:* ${address.trim()}
━━━━━━━━━━━━━━━━━━━━
_Please confirm my order and share delivery schedule._`;

    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encoded}`;

    // Mark as submitted and open WhatsApp in new tab
    setIsSubmitted(true);
    if (typeof window !== 'undefined') {
      window.open(waUrl, '_blank');
    }
  };

  return (
    <section id="merch" className="py-20 sm:py-28 bg-[#0E0E0E] relative border-t border-[#1C1C1C] overflow-hidden">
      {/* Background ambient gold lighting */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#C8A24D]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-80 h-80 bg-[#C8A24D]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#181818] border border-[#C8A24D]/35 text-[#C8A24D] text-[11px] font-semibold tracking-widest uppercase mb-3 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-[#C8A24D]" />
            <span>{t('merch_subtitle')}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#F5F2EA] tracking-tight mb-4">
            {t('merch_title')}
          </h2>

          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#C8A24D] to-transparent mx-auto mb-4" />

          <p className="text-sm sm:text-base text-[#A6A6A6] leading-relaxed">
            {t('merch_desc')}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-[#737373]">
            <span className="flex items-center space-x-1.5">
              <Truck className="w-3.5 h-3.5 text-[#C8A24D]" />
              <span>{t('merch_fast_delivery')}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C8A24D]" />
              <span>100% Authentic Salon Grade</span>
            </span>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MERCH_PRODUCTS.map((prod) => {
            const displayName = language === 'bn' ? prod.nameBn : prod.name;
            const displayTag = language === 'bn' ? prod.tagBn : prod.tag;
            const displayDesc = language === 'bn' ? prod.descriptionBn : prod.description;
            const displayFeatures = language === 'bn' ? prod.featuresBn : prod.features;

            return (
              <div
                key={prod.id}
                className="group flex flex-col justify-between rounded-2xl bg-[#141414] border border-[#222222] hover:border-[#C8A24D]/60 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-[0_8px_30px_rgba(200,162,77,0.18)]"
              >
                {/* Product Image & Badges */}
                <div>
                  <div className="relative aspect-square w-full bg-[#1A1A1A] overflow-hidden flex items-center justify-center p-3">
                    <img
                      src={prod.image}
                      alt={displayName}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 rounded-xl"
                    />

                    {/* Gradient overlay for text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/20 pointer-events-none" />

                    {/* Category Tag */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-[#0B0B0B]/90 backdrop-blur-md text-[#C8A24D] border border-[#C8A24D]/40 shadow-md">
                        {displayTag}
                      </span>
                    </div>

                    {/* Size Pill */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono text-[#E5E5E5] bg-[#0E0E0E]/85 border border-[#333]">
                        {prod.size}
                      </span>
                    </div>

                    {/* Stock Status */}
                    <div className="absolute bottom-3 left-3 flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-[#0E0E0E]/90 text-[10px] text-[#10B981] border border-[#10B981]/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                      <span>{t('merch_in_stock')}</span>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-5">
                    <h3 className="font-serif text-lg font-bold text-[#F5F2EA] group-hover:text-[#C8A24D] transition-colors leading-snug mb-2">
                      {displayName}
                    </h3>

                    <p className="text-xs text-[#A6A6A6] line-clamp-3 leading-relaxed mb-4">
                      {displayDesc}
                    </p>

                    {/* Feature Bullets */}
                    <ul className="space-y-1.5 mb-5">
                      {displayFeatures.slice(0, 2).map((feat, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-[11px] text-[#C5C5C5]">
                          <Check className="w-3 h-3 text-[#C8A24D] flex-shrink-0" />
                          <span className="line-clamp-1">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Price & Buy Now CTA */}
                <div className="p-5 pt-0">
                  <div className="pt-4 border-t border-[#202020] flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-[#737373] uppercase tracking-wider block">
                        {language === 'bn' ? 'মূল্য' : 'Price'}
                      </span>
                      <span className="text-xl font-serif font-bold text-[#F5F2EA]">
                        <span className="text-[#C8A24D] text-base mr-0.5">{currency}</span>
                        {prod.price}
                      </span>
                    </div>

                    <button
                      onClick={() => openOrderModal(prod)}
                      className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ECC876] via-[#C8A24D] to-[#9F7A28] hover:from-[#F5D589] hover:via-[#D4AE55] hover:to-[#B08832] text-[#0B0B0B] font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_4px_16px_rgba(200,162,77,0.35)] hover:shadow-[0_6px_22px_rgba(200,162,77,0.55)] border border-[#F5E6B3]/45 active:scale-95 flex-shrink-0"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#0B0B0B]" />
                      <span>{language === 'bn' ? 'অর্ডার করুন' : 'Buy Now'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= ORDER MODAL ================= */}
      {activeProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-lg rounded-2xl bg-[#141414] border border-[#C8A24D]/40 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#181818] border-b border-[#262626] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-[#C8A24D]" />
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#F5F2EA]">
                  {t('merch_order_modal_title')}
                </h3>
              </div>
              <button
                onClick={closeOrderModal}
                className="p-1.5 rounded-lg text-[#A6A6A6] hover:text-[#F5F2EA] bg-[#222] hover:bg-[#2A2A2A] transition"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              {!isSubmitted ? (
                <form onSubmit={handleSubmitOrder} className="space-y-5">
                  {/* Selected Product Summary Card */}
                  <div className="p-3.5 rounded-xl bg-[#0D0D0D] border border-[#262626] flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-[#C8A24D]/30 flex-shrink-0 bg-black">
                        <img
                          src={activeProduct.image}
                          alt={activeProduct.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="font-serif font-bold text-sm text-[#F5F2EA] block truncate">
                          {language === 'bn' ? activeProduct.nameBn : activeProduct.name}
                        </span>
                        <span className="text-[11px] text-[#A6A6A6] block">
                          {activeProduct.size} • <span className="text-[#C8A24D]">{currency}{activeProduct.price}</span>
                        </span>
                      </div>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center space-x-2 bg-[#181818] border border-[#333] rounded-lg p-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-7 h-7 flex items-center justify-center rounded bg-[#222] hover:bg-[#2E2E2E] text-[#F5F2EA] transition"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold font-mono text-[#F5F2EA]">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                        className="w-7 h-7 flex items-center justify-center rounded bg-[#222] hover:bg-[#2E2E2E] text-[#F5F2EA] transition"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-[#737373] leading-relaxed">
                    {t('merch_order_modal_desc')}
                  </p>

                  {/* Client Name Input */}
                  <div>
                    <label className="block text-xs font-semibold text-[#F5F2EA] mb-1.5 flex items-center space-x-1.5">
                      <User className="w-3.5 h-3.5 text-[#C8A24D]" />
                      <span>{t('merch_name_label')} <span className="text-red-400">*</span></span>
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder={t('merch_name_placeholder')}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D0D0D] border border-[#2A2A2A] focus:border-[#C8A24D] focus:outline-none text-sm text-[#F5F2EA] placeholder-[#555] transition"
                    />
                  </div>

                  {/* WhatsApp Number Input */}
                  <div>
                    <label className="block text-xs font-semibold text-[#F5F2EA] mb-1.5 flex items-center space-x-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#C8A24D]" />
                      <span>{t('merch_phone_label')} <span className="text-red-400">*</span></span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t('merch_phone_placeholder')}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D0D0D] border border-[#2A2A2A] focus:border-[#C8A24D] focus:outline-none text-sm text-[#F5F2EA] placeholder-[#555] transition"
                    />
                    <span className="text-[10px] text-[#666] mt-1 block">
                      {language === 'bn' ? 'অর্ডার ট্র্যাকিং ও কনফার্মেশনের জন্য হোয়াটসঅ্যাপ নম্বর দিন' : 'We will reach out on WhatsApp to confirm delivery'}
                    </span>
                  </div>

                  {/* Delivery Address Input */}
                  <div>
                    <label className="block text-xs font-semibold text-[#F5F2EA] mb-1.5 flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#C8A24D]" />
                      <span>{t('merch_address_label')} <span className="text-red-400">*</span></span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={t('merch_address_placeholder')}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D0D0D] border border-[#2A2A2A] focus:border-[#C8A24D] focus:outline-none text-sm text-[#F5F2EA] placeholder-[#555] transition resize-none"
                    />
                  </div>

                  {/* Pricing summary */}
                  <div className="pt-3 border-t border-[#222] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-[#888] block">
                        {t('merch_total')} ({quantity} {quantity === 1 ? 'item' : 'items'})
                      </span>
                      <span className="text-2xl font-serif font-bold text-[#C8A24D]">
                        {currency}{activeProduct.price * quantity}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-[#10B981] font-semibold block">
                        ✓ Cash on Delivery / bKash
                      </span>
                      <span className="text-[10px] text-[#666] block">
                        Chattogram & All Districts
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#ECC876] via-[#C8A24D] to-[#9F7A28] hover:from-[#F5D589] hover:via-[#D4AE55] hover:to-[#B08832] text-[#0B0B0B] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-[0_4px_20px_rgba(200,162,77,0.4)] border border-[#F5E6B3]/45 active:scale-98"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#0B0B0B]" />
                      <span>{t('merch_confirm_btn')}</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Order Confirmation Success Screen */
                <div className="text-center py-4 space-y-4 animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-[#10B981]/15 border border-[#10B981]/40 flex items-center justify-center text-[#10B981] mx-auto shadow-lg">
                    <Check className="w-8 h-8" />
                  </div>

                  <h4 className="font-serif text-xl font-bold text-[#F5F2EA]">
                    {t('merch_success_title')}
                  </h4>

                  <p className="text-xs sm:text-sm text-[#A6A6A6] max-w-sm mx-auto leading-relaxed">
                    {t('merch_success_desc')}
                  </p>

                  <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#222] text-left space-y-1.5 text-xs text-[#C5C5C5]">
                    <div className="flex justify-between border-b border-[#1E1E1E] pb-1.5">
                      <span className="text-[#737373]">{t('merch_quantity')}:</span>
                      <span className="font-bold text-[#F5F2EA]">{quantity}x {language === 'bn' ? activeProduct.nameBn : activeProduct.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#1E1E1E] pb-1.5">
                      <span className="text-[#737373]">{t('merch_total')}:</span>
                      <span className="font-bold text-[#C8A24D]">{currency}{activeProduct.price * quantity}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#1E1E1E] pb-1.5">
                      <span className="text-[#737373]">{t('merch_name_label')}:</span>
                      <span className="text-[#F5F2EA]">{clientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#737373]">{t('merch_address_label')}:</span>
                      <span className="text-[#F5F2EA] text-right line-clamp-1">{address}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        const prodName = language === 'bn' ? activeProduct.nameBn : activeProduct.name;
                        const totalAmount = activeProduct.price * quantity;
                        const msg = `🛍️ *PRODUCT ORDER — GOLDEN CUTS*\nProduct: ${prodName}\nQty: ${quantity}\nTotal: ${currency}${totalAmount}\nName: ${clientName}\nPhone: ${phone}\nAddress: ${address}`;
                        window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
                      }}
                      className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition shadow-md"
                    >
                      <span>{t('merch_continue_wa')}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={closeOrderModal}
                      className="w-full py-3 rounded-xl bg-[#222] hover:bg-[#2C2C2C] text-[#F5F2EA] font-semibold text-xs tracking-wider transition"
                    >
                      {t('merch_close')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
