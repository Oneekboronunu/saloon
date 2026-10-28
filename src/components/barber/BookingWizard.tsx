'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader2,
  ArrowRight,
  Scissors,
  MessageCircle,
  RefreshCw,
  Printer,
  Sparkles,
} from 'lucide-react';
import { ServiceItem } from './ServicesSection';

interface BookingWizardProps {
  services: ServiceItem[];
  selectedServiceIds: string[];
  onToggleService: (id: string) => void;
  currency?: string;
  salonPhone?: string;
  whatsappNumber?: string;
  salonAddress?: string;
}

interface TimeSlot {
  time: string;
  displayTime: string;
  available: boolean;
  reason?: string;
}

interface ConfirmedBooking {
  reference: string;
  customerName: string;
  customerPhone: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  totalDuration: number;
  totalPrice: number;
  status: string;
  services: { id: string; name: string; price: number; durationMinutes: number }[];
  notes?: string;
}

export default function BookingWizard({
  services,
  selectedServiceIds,
  onToggleService,
  currency = '৳',
  salonPhone = '01780625295',
  whatsappNumber = '8801780625295',
  salonAddress = 'House 42, Road 27 (Old), Dhanmondi, Dhaka',
}: BookingWizardProps) {
  // Current active step in wizard: 1=Services, 2=Date, 3=Time, 4=Details, 5=Summary/Confirmed
  const [step, setStep] = useState<number>(1);

  // Date selection state
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Time slot state
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [slotError, setSlotError] = useState<string>('');

  // Customer details state
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Submission state
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [confirmedBooking, setConfirmedBooking] = useState<ConfirmedBooking | null>(null);

  // Selected services calculations
  const selectedServices = services.filter((s) => selectedServiceIds.includes(s.id));
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.durationMinutes, 0);

  // Today in YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  // Auto-set initial date to today if none selected
  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(todayStr);
    }
  }, [todayStr]);

  // Fetch available slots whenever date or selected services duration changes
  useEffect(() => {
    if (!selectedDate || totalDuration <= 0) return;

    let isMounted = true;
    async function fetchSlots() {
      setLoadingSlots(true);
      setSlotError('');
      setSelectedSlot('');

      try {
        const res = await fetch(`/api/availability?date=${selectedDate}&duration=${totalDuration}`);
        const data = await res.json();

        if (!isMounted) return;

        if (data.success && data.availability) {
          if (data.availability.isClosed) {
            setSlotError(data.availability.closedReason || 'The salon is closed on this date.');
            setTimeSlots([]);
          } else {
            setTimeSlots(data.availability.slots || []);
            if (data.availability.slots.length === 0 || data.availability.availableCount === 0) {
              setSlotError('All appointment slots are fully booked on this date. Please choose another date.');
            }
          }
        } else {
          setSlotError(data.error || 'Failed to load available times');
        }
      } catch (err) {
        if (isMounted) setSlotError('Network connection issue. Please check your internet.');
      } finally {
        if (isMounted) setLoadingSlots(false);
      }
    }

    fetchSlots();
    return () => {
      isMounted = false;
    };
  }, [selectedDate, totalDuration]);

  // Calendar Helpers
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon, etc.

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const handlePrevMonth = () => {
    const prev = new Date(year, month - 1, 1);
    const now = new Date();
    // Don't allow going back before current month
    if (prev.getFullYear() < now.getFullYear() || (prev.getFullYear() === now.getFullYear() && prev.getMonth() < now.getMonth())) {
      return;
    }
    setCurrentMonth(prev);
  };

  const handleNextMonth = () => {
    // Limit to 2 months in advance
    const next = new Date(year, month + 1, 1);
    setCurrentMonth(next);
  };

  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!customerName.trim() || customerName.trim().length < 2) {
      errors.name = 'Please provide your full name.';
    }

    const cleanPhone = customerPhone.replace(/[\s-]/g, '');
    const bdRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
    if (!cleanPhone) {
      errors.phone = 'Phone number is required.';
    } else if (!bdRegex.test(cleanPhone)) {
      errors.phone = 'Please enter a valid 11-digit Bangladeshi number (e.g. 01780625295).';
    }

    if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      errors.email = 'Please enter a valid email address.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Booking
  const handleBookingSubmit = async () => {
    if (!validateForm()) {
      setStep(4);
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerPhone: customerPhone.replace(/[\s-]/g, ''),
          customerEmail: customerEmail.trim() || undefined,
          notes: notes.trim() || undefined,
          serviceIds: selectedServiceIds,
          appointmentDate: selectedDate,
          startTime: selectedSlot,
        }),
      });

      const data = await res.json();

      if (data.success && data.booking) {
        setConfirmedBooking(data.booking);
        setStep(5);
      } else {
        setSubmitError(data.error || 'Failed to complete booking. Please try another time.');
        if (res.status === 409) {
          // Slot conflict: bounce back to slot selection
          setStep(3);
        }
      }
    } catch (err) {
      setSubmitError('Network error. Please verify your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // WhatsApp confirmation url for client
  const generateWhatsAppConfirmationUrl = () => {
    if (!confirmedBooking) return `https://wa.me/${whatsappNumber}`;
    const text = encodeURIComponent(
      `Hello Golden Cuts,\nI have scheduled an appointment.\n\n` +
      `Booking Ref: ${confirmedBooking.reference}\n` +
      `Name: ${confirmedBooking.customerName}\n` +
      `Date: ${confirmedBooking.appointmentDate}\n` +
      `Time: ${confirmedBooking.startTime} - ${confirmedBooking.endTime}\n` +
      `Services: ${confirmedBooking.services.map((s) => s.name).join(', ')}\n` +
      `Total: ${currency}${confirmedBooking.totalPrice}\n\n` +
      `Please confirm my slot. Thank you!`
    );
    return `https://wa.me/${whatsappNumber}?text=${text}`;
  };

  return (
    <section id="booking" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#101010] border-t border-[#222222]">
      <div className="max-w-4xl mx-auto">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C8A24D] font-semibold block mb-2">
            Online Reservation
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#F5F2EA] tracking-tight">
            Book Your Appointment
          </h2>
          <div className="w-12 h-0.5 bg-[#C8A24D] mx-auto mt-3 mb-3 opacity-70" />
          <p className="text-xs sm:text-sm text-[#A6A6A6]">
            Real-time scheduling with atomic slot reservation. No queues, no waiting.
          </p>
        </div>

        {/* Wizard Step Progress Tracker */}
        {!confirmedBooking && (
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-2xl mx-auto relative px-2">
              {/* Connecting line */}
              <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-0.5 bg-[#262626] -z-0" />
              
              {[
                { num: 1, label: 'Services' },
                { num: 2, label: 'Date' },
                { num: 3, label: 'Time' },
                { num: 4, label: 'Details' },
                { num: 5, label: 'Confirm' },
              ].map((s) => {
                const isActive = step === s.num;
                const isPassed = step > s.num;

                return (
                  <button
                    key={s.num}
                    onClick={() => {
                      // Allow going back to earlier completed steps
                      if (isPassed) setStep(s.num);
                    }}
                    disabled={!isPassed && !isActive}
                    className="relative z-10 flex flex-col items-center group focus:outline-none"
                  >
                    <div
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-[#C8A24D] text-[#0B0B0B] ring-4 ring-[#C8A24D]/20 shadow-md'
                          : isPassed
                          ? 'bg-[#1F1F1F] text-[#C8A24D] border border-[#C8A24D]/50'
                          : 'bg-[#151515] text-[#555] border border-[#2B2B2B]'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                    </div>
                    <span
                      className={`text-[10px] sm:text-xs mt-1 font-medium transition-colors hidden sm:block ${
                        isActive ? 'text-[#C8A24D]' : isPassed ? 'text-[#F5F2EA]' : 'text-[#555]'
                      }`}
                    >
                      {s.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Wizard Box */}
        <div className="bg-[#141414] border border-[#262626] rounded-2xl p-5 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* STEP 1: CHOOSE SERVICES */}
          {step === 1 && (
            <div className="animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#222]">
                <div>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-[#F5F2EA]">
                    Select Services
                  </h3>
                  <p className="text-xs text-[#A6A6A6]">
                    Choose one or more grooming services.
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-[#1F1F1F] text-[#C8A24D] font-mono border border-[#333]">
                  Step 1 of 5
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 max-h-[380px] overflow-y-auto pr-1">
                {services.map((service) => {
                  const isSelected = selectedServiceIds.includes(service.id);
                  return (
                    <div
                      key={service.id}
                      onClick={() => onToggleService(service.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#1C1C1C] border-[#C8A24D] ring-1 ring-[#C8A24D]'
                          : 'bg-[#0E0E0E] border-[#262626] hover:border-[#383838]'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-[#F5F2EA] truncate">
                            {service.name}
                          </h4>
                        </div>
                        <p className="text-[11px] text-[#A6A6A6] line-clamp-1 mt-0.5">
                          {service.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-2 text-[11px] text-[#737373]">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-[#C8A24D]" />
                            <span>{service.durationMinutes}m</span>
                          </span>
                          <span>•</span>
                          <span className="font-semibold text-[#C8A24D]">
                            {currency}{service.price}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 border ${
                          isSelected
                            ? 'bg-[#C8A24D] border-[#C8A24D] text-[#0B0B0B]'
                            : 'border-[#333] bg-[#1A1A1A]'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Step 1 Footer Summary */}
              <div className="pt-4 border-t border-[#222] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <span className="text-xs text-[#A6A6A6]">
                    Selected: <strong className="text-[#F5F2EA]">{selectedServices.length}</strong> services (~{totalDuration} mins)
                  </span>
                  <div className="text-lg font-bold text-[#C8A24D]">
                    Total: {currency}{totalPrice}
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={selectedServices.length === 0}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#C8A24D] hover:bg-[#D8B45E] disabled:opacity-40 disabled:cursor-not-allowed text-[#0B0B0B] font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition shadow-md"
                >
                  <span>Select Date</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CHOOSE DATE */}
          {step === 2 && (
            <div className="animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#222]">
                <div>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-[#F5F2EA]">
                    Choose Date
                  </h3>
                  <p className="text-xs text-[#A6A6A6]">
                    Current timezone: Asia/Dhaka (UTC+6)
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-[#1F1F1F] text-[#C8A24D] font-mono border border-[#333]">
                  Step 2 of 5
                </span>
              </div>

              {/* Month Header Navigation */}
              <div className="flex items-center justify-between mb-4 bg-[#0E0E0E] p-3 rounded-xl border border-[#222]">
                <button
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-lg text-[#A6A6A6] hover:text-[#F5F2EA] hover:bg-[#1C1C1C] transition"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="font-serif font-bold text-sm sm:text-base text-[#F5F2EA]">
                  {monthNames[month]} {year}
                </div>
                <button
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-lg text-[#A6A6A6] hover:text-[#F5F2EA] hover:bg-[#1C1C1C] transition"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Days of week */}
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                  <div key={d} className="text-[11px] font-semibold text-[#737373] py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 text-center mb-6">
                {/* Blank days before day 1 */}
                {Array.from({ length: firstDayIndex }).map((_, i) => (
                  <div key={`blank-${i}`} className="h-10 sm:h-12" />
                ))}

                {/* Day numbers */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                  const isPast = dateStr < todayStr;
                  const isSelected = dateStr === selectedDate;
                  const isToday = dateStr === todayStr;

                  return (
                    <button
                      key={dateStr}
                      disabled={isPast}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`h-10 sm:h-12 rounded-xl flex flex-col items-center justify-center text-xs transition-all relative ${
                        isSelected
                          ? 'bg-[#C8A24D] text-[#0B0B0B] font-bold shadow-md'
                          : isPast
                          ? 'text-[#444] cursor-not-allowed bg-transparent'
                          : 'text-[#F5F2EA] hover:bg-[#1F1F1F] hover:border-[#C8A24D]/40 border border-transparent'
                      }`}
                    >
                      <span>{dayNum}</span>
                      {isToday && !isSelected && (
                        <span className="w-1 h-1 rounded-full bg-[#C8A24D] mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Step 2 Footer */}
              <div className="pt-4 border-t border-[#222] flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-[#2B2B2B] text-xs font-semibold text-[#A6A6A6] hover:text-[#F5F2EA]"
                >
                  Back
                </button>

                <button
                  onClick={() => setStep(3)}
                  disabled={!selectedDate}
                  className="px-6 py-2.5 rounded-xl bg-[#C8A24D] hover:bg-[#D8B45E] disabled:opacity-40 text-[#0B0B0B] font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition"
                >
                  <span>Select Time</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CHOOSE TIME SLOT */}
          {step === 3 && (
            <div className="animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#222]">
                <div>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-[#F5F2EA]">
                    Available Times on {selectedDate}
                  </h3>
                  <p className="text-xs text-[#A6A6A6]">
                    Slot blocks calculated for {totalDuration} minutes total service duration.
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-[#1F1F1F] text-[#C8A24D] font-mono border border-[#333]">
                  Step 3 of 5
                </span>
              </div>

              {submitError && (
                <div className="mb-4 p-3 rounded-xl bg-[#2A1616] border border-[#EF4444]/40 flex items-center space-x-2 text-xs text-[#FCA5A5]">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Loading State */}
              {loadingSlots ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-3 text-[#A6A6A6]">
                  <Loader2 className="w-7 h-7 animate-spin text-[#C8A24D]" />
                  <span className="text-xs font-medium">Checking live slot availability...</span>
                </div>
              ) : slotError ? (
                <div className="py-8 px-4 text-center bg-[#1A1414] rounded-xl border border-[#332222]">
                  <AlertCircle className="w-7 h-7 text-[#EF4444] mx-auto mb-2" />
                  <p className="text-sm font-semibold text-[#F5F2EA] mb-1">{slotError}</p>
                  <p className="text-xs text-[#A6A6A6] mb-4">
                    Please navigate to a different date on the calendar.
                  </p>
                  <button
                    onClick={() => setStep(2)}
                    className="px-4 py-2 rounded-lg bg-[#C8A24D] text-[#0B0B0B] text-xs font-bold uppercase tracking-wider"
                  >
                    Change Date
                  </button>
                </div>
              ) : (
                <div className="mb-6">
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                    {timeSlots.map((slot) => {
                      const isSelected = selectedSlot === slot.time;
                      return (
                        <button
                          key={slot.time}
                          disabled={!slot.available}
                          onClick={() => setSelectedSlot(slot.time)}
                          className={`py-3 px-2 rounded-xl text-xs font-semibold transition-all border flex flex-col items-center justify-center ${
                            isSelected
                              ? 'bg-[#C8A24D] text-[#0B0B0B] border-[#C8A24D] shadow-md scale-[1.02]'
                              : slot.available
                              ? 'bg-[#0E0E0E] text-[#F5F2EA] border-[#262626] hover:border-[#C8A24D]/50 hover:bg-[#1A1A1A]'
                              : 'bg-[#121212] text-[#444] border-transparent cursor-not-allowed line-through opacity-50'
                          }`}
                        >
                          <span>{slot.displayTime}</span>
                          {!slot.available && (
                            <span className="text-[9px] text-[#EF4444] mt-0.5 no-underline font-normal">
                              Booked
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3 Footer */}
              <div className="pt-4 border-t border-[#222] flex items-center justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl border border-[#2B2B2B] text-xs font-semibold text-[#A6A6A6] hover:text-[#F5F2EA]"
                >
                  Back
                </button>

                <button
                  onClick={() => setStep(4)}
                  disabled={!selectedSlot}
                  className="px-6 py-2.5 rounded-xl bg-[#C8A24D] hover:bg-[#D8B45E] disabled:opacity-40 text-[#0B0B0B] font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition"
                >
                  <span>Customer Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CUSTOMER DETAILS */}
          {step === 4 && (
            <div className="animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#222]">
                <div>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-[#F5F2EA]">
                    Your Contact Information
                  </h3>
                  <p className="text-xs text-[#A6A6A6]">
                    No registration required. We respect your privacy.
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-[#1F1F1F] text-[#C8A24D] font-mono border border-[#333]">
                  Step 4 of 5
                </span>
              </div>

              <div className="space-y-4 mb-6">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-medium text-[#F5F2EA] mb-1.5">
                    Full Name <span className="text-[#C8A24D]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Tanvir Ahmed"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0E0E0E] border border-[#262626] text-sm text-[#F5F2EA] placeholder-[#555] focus:outline-none focus:border-[#C8A24D] transition"
                    />
                  </div>
                  {formErrors.name && (
                    <p className="text-[11px] text-[#EF4444] mt-1">{formErrors.name}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-medium text-[#F5F2EA] mb-1.5">
                    Phone Number (BD) <span className="text-[#C8A24D]">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. 01780625295"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0E0E0E] border border-[#262626] text-sm text-[#F5F2EA] placeholder-[#555] focus:outline-none focus:border-[#C8A24D] transition"
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="text-[11px] text-[#EF4444] mt-1">{formErrors.phone}</p>
                  )}
                </div>

                {/* Email (Optional) */}
                <div>
                  <label className="block text-xs font-medium text-[#A6A6A6] mb-1.5">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="e.g. tanvir@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0E0E0E] border border-[#262626] text-sm text-[#F5F2EA] placeholder-[#555] focus:outline-none focus:border-[#C8A24D] transition"
                    />
                  </div>
                  {formErrors.email && (
                    <p className="text-[11px] text-[#EF4444] mt-1">{formErrors.email}</p>
                  )}
                </div>

                {/* Special Instructions / Notes */}
                <div>
                  <label className="block text-xs font-medium text-[#A6A6A6] mb-1.5">
                    Grooming Preferences / Notes (Optional)
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-[#737373] absolute left-3.5 top-3" />
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Low skin taper, sensitive neck skin, prefer natural beard oil..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0E0E0E] border border-[#262626] text-sm text-[#F5F2EA] placeholder-[#555] focus:outline-none focus:border-[#C8A24D] transition"
                    />
                  </div>
                </div>
              </div>

              {/* Step 4 Footer */}
              <div className="pt-4 border-t border-[#222] flex items-center justify-between">
                <button
                  onClick={() => setStep(3)}
                  className="px-4 py-2.5 rounded-xl border border-[#2B2B2B] text-xs font-semibold text-[#A6A6A6] hover:text-[#F5F2EA]"
                >
                  Back
                </button>

                <button
                  onClick={() => {
                    if (validateForm()) setStep(5);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#C8A24D] hover:bg-[#D8B45E] text-[#0B0B0B] font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition"
                >
                  <span>Review Booking</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW SUMMARY & CONFIRMATION */}
          {step === 5 && !confirmedBooking && (
            <div className="animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#222]">
                <div>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-[#F5F2EA]">
                    Review & Confirm
                  </h3>
                  <p className="text-xs text-[#A6A6A6]">
                    Please verify your appointment details before final scheduling.
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-[#1F1F1F] text-[#C8A24D] font-mono border border-[#333]">
                  Step 5 of 5
                </span>
              </div>

              {submitError && (
                <div className="mb-4 p-3 rounded-xl bg-[#2A1616] border border-[#EF4444]/40 flex items-center space-x-2 text-xs text-[#FCA5A5]">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Summary Card */}
              <div className="bg-[#0E0E0E] rounded-xl border border-[#262626] p-4 sm:p-5 mb-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#1E1E1E]">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#737373] block mb-0.5">
                      Client
                    </span>
                    <span className="text-sm font-bold text-[#F5F2EA]">{customerName}</span>
                    <span className="text-xs text-[#A6A6A6] block">{customerPhone}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#737373] block mb-0.5">
                      Appointment Schedule
                    </span>
                    <span className="text-sm font-bold text-[#C8A24D]">{selectedDate}</span>
                    <span className="text-xs text-[#A6A6A6] block">
                      Starting at {selectedSlot} (~{totalDuration} mins)
                    </span>
                  </div>
                </div>

                {/* Selected Services breakdown */}
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#737373] block mb-2">
                    Selected Services
                  </span>
                  <div className="space-y-1.5">
                    {selectedServices.map((s) => (
                      <div key={s.id} className="flex items-center justify-between text-xs text-[#F5F2EA]">
                        <span>{s.name} ({s.durationMinutes}m)</span>
                        <span className="font-mono text-[#C8A24D]">{currency}{s.price}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#1E1E1E] flex items-center justify-between font-bold text-sm">
                    <span className="text-[#F5F2EA]">Total Due at Salon</span>
                    <span className="text-lg text-[#C8A24D] font-mono">{currency}{totalPrice}</span>
                  </div>
                </div>

                {notes && (
                  <div className="pt-2 border-t border-[#1E1E1E] text-xs text-[#A6A6A6]">
                    <strong className="text-[#F5F2EA]">Notes:</strong> {notes}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#222] flex items-center justify-between">
                <button
                  onClick={() => setStep(4)}
                  disabled={submitting}
                  className="px-4 py-2.5 rounded-xl border border-[#2B2B2B] text-xs font-semibold text-[#A6A6A6] hover:text-[#F5F2EA]"
                >
                  Back
                </button>

                <button
                  onClick={handleBookingSubmit}
                  disabled={submitting}
                  className="px-8 py-3 rounded-xl bg-[#C8A24D] hover:bg-[#D8B45E] disabled:opacity-50 text-[#0B0B0B] font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition shadow-xl"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#0B0B0B]" />
                      <span>Reserving Slot...</span>
                    </>
                  ) : (
                    <>
                      <span>CONFIRM APPOINTMENT</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* SUCCESS CONFIRMATION RECEIPT */}
          {confirmedBooking && (
            <div className="animate-in fade-in zoom-in-95 duration-300 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] mx-auto mb-4">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <span className="text-xs uppercase tracking-[0.25em] text-[#10B981] font-bold block mb-1">
                Booking Confirmed
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5F2EA] mb-2">
                We Look Forward To Welcoming You
              </h3>
              <p className="text-xs sm:text-sm text-[#A6A6A6] max-w-md mx-auto mb-6">
                Your reservation is locked in our system. Please arrive 5 minutes before your scheduled slot.
              </p>

              {/* Official Receipt Card */}
              <div className="max-w-md mx-auto bg-[#0E0E0E] rounded-2xl border border-[#C8A24D]/40 p-5 text-left mb-6 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-[#222]">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#737373]">
                      Booking Reference
                    </span>
                    <div className="text-lg font-mono font-bold text-[#C8A24D] tracking-wider">
                      {confirmedBooking.reference}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                    {confirmedBooking.status}
                  </span>
                </div>

                <div className="py-3 space-y-2 text-xs border-b border-[#222]">
                  <div className="flex justify-between">
                    <span className="text-[#A6A6A6]">Customer</span>
                    <span className="font-semibold text-[#F5F2EA]">{confirmedBooking.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A6A6A6]">Phone</span>
                    <span className="font-mono text-[#F5F2EA]">{confirmedBooking.customerPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A6A6A6]">Date</span>
                    <span className="font-semibold text-[#F5F2EA]">{confirmedBooking.appointmentDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A6A6A6]">Time Window</span>
                    <span className="font-semibold text-[#C8A24D]">
                      {confirmedBooking.startTime} – {confirmedBooking.endTime} ({confirmedBooking.totalDuration} mins)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A6A6A6]">Location</span>
                    <span className="text-[#F5F2EA] text-right line-clamp-1">{salonAddress}</span>
                  </div>
                </div>

                <div className="pt-3">
                  <span className="text-[10px] uppercase tracking-wider text-[#737373] block mb-1">
                    Services
                  </span>
                  <div className="space-y-1 mb-2">
                    {confirmedBooking.services.map((s, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-[#A6A6A6]">
                        <span>{s.name}</span>
                        <span className="font-mono text-[#F5F2EA]">{currency}{s.price}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#222] font-bold text-sm">
                    <span className="text-[#F5F2EA]">Total Due</span>
                    <span className="text-[#C8A24D] font-mono">{currency}{confirmedBooking.totalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Instant WhatsApp Share & Print Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                <a
                  href={generateWhatsAppConfirmationUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center space-x-2 py-3 px-5 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-xs uppercase tracking-wider shadow-lg transition active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send to WhatsApp</span>
                </a>

                <button
                  onClick={() => window.print()}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-[#1A1A1A] hover:bg-[#252525] border border-[#333] text-xs font-semibold text-[#F5F2EA] transition"
                >
                  <Printer className="w-4 h-4 text-[#A6A6A6]" />
                  <span>Print Receipt</span>
                </button>
              </div>

              {/* Book Another Link */}
              <button
                onClick={() => {
                  setConfirmedBooking(null);
                  setStep(1);
                }}
                className="mt-6 text-xs text-[#A6A6A6] hover:text-[#C8A24D] transition underline"
              >
                Schedule another appointment
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
