# SANDWINA Career Coaching Marketplace

**Empowering women to get more out of work**

A modern, full-stack career coaching marketplace platform connecting women clients with certified career coaches. Built with Next.js 14, TypeScript, Supabase, and Stripe.

---

## 🎯 **Project Overview**

SANDWINA is a two-sided marketplace that makes professional career coaching **affordable** ($150 vs. $500), **approachable** (certified, vetted coaches), and **actionable** (transformative results).

### **Key Features**

✅ Beautiful landing page with SANDWINA branding
✅ LiftMatcher® quiz for personalized coach recommendations
✅ Real-time availability booking system
✅ Stripe payments & Stripe Connect marketplace payouts
✅ Zoom integration (coaches use FREE Zoom accounts)
✅ Email automation (booking confirmations, reminders)
✅ Progress tracking & goal setting
✅ Resource library with premium content gating

---

## 🛠 **Tech Stack**

### **Frontend**
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Query + Zustand
- **Forms**: React Hook Form + Zod validation

### **Backend**
- **Database**: Supabase (PostgreSQL 15+)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Realtime**: Supabase Realtime

### **Hosting & Services**
- **Platform**: Vercel
- **Payments**: Stripe Checkout + Stripe Connect
- **Email**: Resend + React Email
- **Quiz**: Typeform API
- **Video**: Zoom (FREE coach accounts)
- **Analytics**: Vercel Analytics + PostHog

---

## 🚀 **Quick Start**

### **Prerequisites**

- Node.js 21.6.0+
- npm 10.2.4+
- Supabase account
- Stripe account
- Resend account
- Typeform account

### **1. Clone & Install**

```bash
cd /path/to/SANDWINA
npm install
```

### **2. Environment Setup**

Create `.env.local` from `.env.local.example`:

```bash
cp .env.local.example .env.local
```

Fill in your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_CONNECT_WEBHOOK_SECRET=your_stripe_connect_webhook_secret

# Resend
RESEND_API_KEY=your_resend_api_key

# Typeform
TYPEFORM_API_KEY=your_typeform_api_key
NEXT_PUBLIC_TYPEFORM_FORM_ID=your_typeform_form_id
TYPEFORM_WEBHOOK_SECRET=your_typeform_webhook_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Cron
CRON_SECRET=your_cron_secret
```

### **3. Database Setup**

Run the database schema in your Supabase SQL editor (see `PRD.md` for complete schema).

### **4. Run Development Server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

---

## 📁 **Project Structure**

```
sandwina/
├── app/
│   ├── (auth)/               # Authentication pages
│   ├── (marketing)/          # Marketing pages (about, how-it-works, etc.)
│   ├── dashboard/            # User dashboards (client/coach/admin)
│   ├── coaches/              # Coach directory & profiles
│   ├── quiz/                 # LiftMatcher® quiz
│   ├── resources/            # Resource library
│   ├── booking/              # Booking flow
│   ├── api/                  # API routes
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Landing page ⭐
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── landing/              # Landing page sections ⭐
│   ├── auth/                 # Auth components
│   ├── coaches/              # Coach components
│   ├── booking/              # Booking components
│   ├── progress/             # Progress tracking
│   └── dashboard/            # Dashboard components
├── lib/
│   ├── auth.ts               # Authentication utilities
│   ├── supabase.ts           # Supabase client
│   ├── utils.ts              # General utilities
│   └── zoom/                 # Zoom validation
├── emails/                   # React Email templates
├── tests/                    # Unit & E2E tests
├── public/                   # Static assets
└── PRD.md                    # Complete Product Requirements ⭐
```

---

## 🎨 **Design System**

### **Brand Colors**

```typescript
colors: {
  brand: {
    red: "#FF0000",      // Primary brand color
    maroon: "#5C0A0A",   // Secondary/accents
    pink: "#FFE5E5",     // Backgrounds
    dark: "#2D2D2D",     // Text
  }
}
```

### **Typography**

- **Headings**: Kumbh Sans (Bold)
- **Body**: Open Sans (Regular, Light)

### **Components**

All UI components use shadcn/ui with custom SANDWINA branding.

---

## 🧪 **Testing**

### **Unit Tests (Vitest)**

```bash
npm run test
```

### **E2E Tests (Playwright)**

```bash
npm run test:e2e
```

---

## 📦 **Deployment**

### **Vercel (Recommended)**

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

### **Environment Variables (Production)**

Make sure to set all `.env.local` variables in Vercel dashboard.

### **Cron Jobs**

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/send-reminders",
      "schedule": "*/15 * * * *"
    },
    {
      "path": "/api/cron/check-zoom-links",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

---

## 📋 **Sprint Roadmap**

### **✅ Sprint 1 (Weeks 1-2): Foundation & Landing Page**
- [x] Next.js 14 project setup
- [x] Landing page with all sections
- [x] Navigation & footer
- [x] Authentication system
- [x] Database schema

### **🚧 Sprint 2 (Weeks 3-4): Dashboards & Zoom**
- [ ] Client dashboard
- [ ] Coach dashboard
- [ ] Admin dashboard
- [ ] Coach application flow
- [ ] Zoom integration (default link setup)

### **⏳ Sprint 3 (Weeks 5-6): Booking System**
- [ ] Coach directory
- [ ] Coach profiles
- [ ] Availability calendar
- [ ] Booking flow

### **⏳ Sprint 4 (Weeks 7-8): Payments**
- [ ] Stripe Checkout
- [ ] Stripe Connect onboarding
- [ ] Payment webhooks
- [ ] Automatic payouts

### **⏳ Sprint 5 (Weeks 9-10): Quiz & Emails**
- [ ] Typeform quiz integration
- [ ] Coach matching algorithm
- [ ] Email automation (Resend)
- [ ] Reminder system (cron jobs)

### **⏳ Sprint 6 (Weeks 11-12): Resources & Launch**
- [ ] Resource library
- [ ] Progress tracking
- [ ] E2E testing
- [ ] Production deployment

---

## 🔑 **Key Innovations**

### **1. Zero Zoom API Costs**
- Coaches use FREE Zoom accounts
- Default Zoom link stored in database
- Automatic link assignment to bookings
- Cron job checks for missing links

### **2. Complete Automation**
- Bookings → automatic
- Payments → automatic
- Emails → automatic
- Payouts → automatic
- Reminders → automatic

### **3. Scalable Architecture**
- Works for 10 or 1,000 coaches
- Near-zero marginal costs
- Network effects compound growth

---

## 📞 **Support**

For questions or issues:
- **Email**: thelifters@sandwina.org
- **Documentation**: See `PRD.md`

---

## 📄 **License**

© 2025 SANDWINA. All rights reserved.

---

## 🎯 **Success Metrics**

- **Booking conversion**: >15%
- **Coach utilization**: >40%
- **Client retention**: >50% book 2nd session
- **Platform uptime**: 99.9%
- **Page load**: <2 seconds
- **Lighthouse score**: >90

---

**Ready to build. Ready to launch. Ready to lift women. 💪**
