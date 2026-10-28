import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getSettingsMap } from '@/lib/bookingEngine';
import { memoryStore } from '@/lib/memoryStore';
import { Scissors, CheckCircle2, Clock, Phone, MapPin, Calendar, ArrowLeft, MessageCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface BookingDetailPageProps {
  params: { reference: string };
}

export default async function BookingDetailPage({ params }: BookingDetailPageProps) {
  const reference = params.reference.toUpperCase().trim();

  let appointment: any = null;
  const settings = await getSettingsMap();

  try {
    appointment = await prisma.appointment.findUnique({
      where: { reference },
    });
  } catch (error) {
    // Fallback to memoryStore
  }

  if (!appointment) {
    appointment = memoryStore.findAppointmentByRef(reference);
  }

  if (!appointment) {
    notFound();
  }

  const services = JSON.parse(appointment.servicesSnapshot);
  const currency = settings.currency || '৳';
  const whatsapp = settings.whatsapp || '8801780625295';

  const waText = encodeURIComponent(
    `Hello Golden Cuts,\nI'm inquiring regarding my appointment:\nRef: ${appointment.reference}\nName: ${appointment.customerName}\nDate: ${appointment.appointmentDate} at ${appointment.startTime}`
  );

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F2EA] py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="max-w-lg w-full">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xs text-[#A6A6A6] hover:text-[#C8A24D] transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Homepage</span>
        </Link>

        <div className="bg-[#141414] border border-[#C8A24D]/40 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-[#222]">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#1F1F1F] border border-[#C8A24D]/30 flex items-center justify-center text-[#C8A24D]">
                <Scissors className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif font-bold text-base text-[#F5F2EA]">
                  {settings.salon_name || 'GOLDEN CUTS'}
                </span>
                <span className="text-[10px] text-[#A6A6A6] block">Reservation Receipt</span>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${
                appointment.status === 'CONFIRMED'
                  ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30'
                  : appointment.status === 'COMPLETED'
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                  : appointment.status === 'CANCELLED'
                  ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                  : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
              }`}
            >
              {appointment.status}
            </span>
          </div>

          <div className="my-5 p-4 rounded-xl bg-[#0B0B0B] border border-[#262626] text-center">
            <span className="text-[10px] uppercase tracking-widest text-[#737373] block mb-1">
              Booking Reference
            </span>
            <span className="text-xl sm:text-2xl font-mono font-bold text-[#C8A24D] tracking-wider">
              {appointment.reference}
            </span>
          </div>

          <div className="space-y-3 text-xs sm:text-sm py-2 border-b border-[#222]">
            <div className="flex justify-between">
              <span className="text-[#A6A6A6]">Customer Name:</span>
              <span className="font-semibold text-[#F5F2EA]">{appointment.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A6A6A6]">Phone Number:</span>
              <span className="font-mono text-[#F5F2EA]">{appointment.customerPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A6A6A6]">Appointment Date:</span>
              <span className="font-semibold text-[#F5F2EA]">{appointment.appointmentDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A6A6A6]">Time Window:</span>
              <span className="font-semibold text-[#C8A24D]">
                {appointment.startTime} – {appointment.endTime} ({appointment.totalDuration} min)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A6A6A6]">Salon Address:</span>
              <span className="text-[#F5F2EA] text-right line-clamp-1 max-w-[200px]">
                {settings.address}
              </span>
            </div>
          </div>

          <div className="py-4 border-b border-[#222]">
            <span className="text-[10px] uppercase tracking-wider text-[#737373] block mb-2">
              Reserved Services
            </span>
            <div className="space-y-1.5">
              {services.map((s: any, idx: number) => (
                <div key={idx} className="flex justify-between text-xs text-[#A6A6A6]">
                  <span>{s.name} ({s.durationMinutes}m)</span>
                  <span className="font-mono text-[#F5F2EA]">{currency}{s.price}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-3 mt-3 border-t border-[#1F1F1F] font-bold text-sm">
              <span className="text-[#F5F2EA]">Total Due</span>
              <span className="text-[#C8A24D] font-mono">{currency}{appointment.totalPrice}</span>
            </div>
          </div>

          <div className="pt-5 flex flex-col gap-3">
            <a
              href={`https://wa.me/${whatsapp}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center space-x-2 py-3 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-xs uppercase tracking-wider transition shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contact Salon on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
