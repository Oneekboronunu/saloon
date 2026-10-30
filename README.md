# GOLDEN CUTS — Premium Men's Barbershop & Grooming Salon

A production-ready website, real-time appointment booking system, and protected administrative dashboard built for **GOLDEN CUTS** barbershop in North Patenga, Chattogram.

---

## 💈 Brand Identity & Design Direction

- **Primary Background**: Deep matte black (`#0B0B0B`)
- **Secondary Background**: Charcoal (`#151515`)
- **Accent**: Metallic Gold (`#C8A24D`, hover `#D8B45E`, border `rgba(200, 162, 77, 0.22)`)
- **Main Text**: Warm White (`#F5F2EA`)
- **Secondary Text**: Muted Gray (`#A6A6A6`)
- **Atmosphere**: International luxury grooming lounge with minimal gold dividers, elegant serif typography, clean spacing, and zero bloated animations.

---

## ⚡ Mobile-First Performance & Architecture

- **Target Viewport**: Designed 360px-wide mobile screen first; scales fluidly to desktop.
- **Initial Payload**: Ultra-lightweight ~111 kB First Load JS; zero blocking video dependencies.
- **Hero Fallback**: Pure CSS atmospheric radial spotlight and luxury pattern with instant LCP under 1.2s.
- **Touch-Friendly**: Every button and slot has a minimum touch target of 44×44px.
- **Accessibility & SEO**: Semantic HTML, OpenGraph tags, WCAG AA color contrast, and reduced-motion support.

---

## ✂️ Configured Initial Services (Configurable in Admin)

1. **Classic Haircut** — ৳250 (30 min)
2. **Skin Fade** — ৳350 (45 min)
3. **Haircut and Beard Trim** — ৳450 (60 min)
4. **Beard Trim and Shape** — ৳150 (20 min)
5. **Hair Wash and Styling** — ৳150 (20 min)
6. **Premium Grooming Package** — ৳600 (75 min)

> **Important**: Changing service prices in the Admin panel applies **strictly to future bookings**. Existing bookings retain an immutable snapshot (`servicesSnapshot`) of their originally agreed services and prices.

---

## 📅 Complete 5-Step Booking Engine

1. **Step 1: Choose Services** — Multi-service selection with dynamic calculation of combined duration and total price in BDT (৳).
2. **Step 2: Choose Date** — Interactive monthly calendar with Asia/Dhaka (UTC+6) timezone handling. Disables past dates and salon closed days.
3. **Step 3: Choose Time Slot** — Live server-side availability engine (`/api/availability`) checks opening/closing hours, slot intervals (30m), buffer time (10m), and active bookings to verify a contiguous free time block.
4. **Step 4: Customer Details** — Full name, Bangladeshi 11-digit phone number validation (`017...`), optional email, and grooming notes. No mandatory account creation.
5. **Step 5: Review & Atomic Confirmation** — Atomic SQLite/PostgreSQL transaction check (`isSlotFreeAtomic`) prevents concurrent double-booking. Generates unique reference code (`GC-YYYYMMDD-XXXX`), confirms slot, and provides 1-click WhatsApp confirmation dispatch.

---

## 🛡️ Administrative Dashboard (`/admin`)

- **Secure Route**: Protected by HMAC-SHA256 HttpOnly session cookies and bcrypt password hashing.
- **Admin Authentication**: Configured via secure environment variables (`ADMIN_DEFAULT_EMAIL` and `ADMIN_DEFAULT_PASSWORD`).
- **Dashboard Overview**: Database-backed metrics (Today's bookings, Upcoming, Pending, Confirmed, Completed, Cancelled, and Total Revenue).
- **Appointment Management**:
  - Filter by status (`ALL`, `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`).
  - Search by customer name, phone number, or booking reference.
  - Quick action buttons to Confirm, Complete, or Cancel.
  - Interactive **Reschedule Modal**: Choose new date and time with live availability verification.
  - **Export to CSV**: Instant download of complete booking records.
- **Service Management**: Add new services, edit prices/durations/descriptions, and toggle active status.
- **Salon Business Settings**: Persistent configuration of Salon Name, Phone, WhatsApp, Physical Address, Opening Hours, Slot Intervals, Buffer Time, and Booking Window.

---

## 💬 WhatsApp Integration

- **Floating Button**: Positioned fixed in the bottom-right corner across all public pages.
- **International Number**: `8801780625295` (Local: `01780625295`).
- **One-Click Pre-filled Message**: Pre-formats customer appointments or questions directly into WhatsApp.

---

## 🚀 Quickstart & Setup Guide

### 1. Prerequisites
- Node.js 18.x or 20.x
- npm or pnpm

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
The `.env` file is pre-configured for local development:
```env
DATABASE_URL="file:./dev.db"
ADMIN_JWT_SECRET="golden_cuts_super_secret_jwt_key_2026_barbershop_luxury"
ADMIN_DEFAULT_EMAIL="<configured_admin_email>"
ADMIN_DEFAULT_PASSWORD="<configured_admin_password>"
NEXT_PUBLIC_BRAND_NAME="GOLDEN CUTS"
NEXT_PUBLIC_PHONE="01780625295"
NEXT_PUBLIC_WHATSAPP_NUMBER="8801780625295"
NEXT_PUBLIC_CURRENCY="৳"
NEXT_PUBLIC_TIMEZONE="Asia/Dhaka"
```

### 4. Database Setup & Seed
```bash
# Push schema to SQLite database
npm run db:push

# Seed admin user, business settings, and initial services
npm run seed
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the barbershop website.
Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the Admin Dashboard.

### 6. Run Integration Test Suite
```bash
npm run test:booking
```
Verifies settings, service catalog, admin token auth, availability engine, atomic booking, and collision prevention.

### 7. Production Build
```bash
npm run build
npm start
```

---

## 🌐 Production Deployment Guide (Vercel / VPS)

### Deploying on Vercel
1. Push repository to GitHub or GitLab.
2. Import project into Vercel.
3. For serverless SQLite, attach a PostgreSQL database (e.g. Supabase or Vercel Postgres) by updating `provider = "postgresql"` in `prisma/schema.prisma` and setting `DATABASE_URL`.
4. Add environment variables in Vercel Project Settings (`ADMIN_JWT_SECRET`, `ADMIN_DEFAULT_EMAIL`, `ADMIN_DEFAULT_PASSWORD`).
5. Deploy!
