SANDWINA Marketplace Platform - Product Requirements Document (PRD)
Version: 1.0
Date: October 6, 2025
Project: SANDWINA Career Coaching Marketplace
Timeline: 12 Weeks (6 Sprints × 2 weeks)
Scope: Enhanced Core MVP
Development Tool: Claude Code

EXECUTIVE SUMMARY
You are building a two-sided marketplace platform that connects women clients with certified career coaches. This platform enables discovery, booking, payment processing, and ongoing coaching relationships. The system must be production-ready, scalable, and provide exceptional user experience.
Core Business Model:

Clients pay $150/session (vs. $500 traditional coaching)
Platform takes 25% fee
Coaches receive ~75% after fees
Automated payments via Stripe Connect
LiftMatcher® quiz drives personalized recommendations

Success Metrics:

Booking conversion: >15% (quiz taker → booking)
Coach utilization: >40% (sessions booked vs. available slots)
Client retention: >50% book 2nd session within 30 days
Platform uptime: 99.9%
Page load time: <2 seconds

Key Technical Principles:

Zero marginal cost - No per-transaction API fees
Free tool leverage - Free Zoom accounts, no paid APIs where possible
Automation first - Minimal manual operations
Exceptional UX - Consumer-grade quality
Scale-ready - Works for 10 or 1,000 coaches

TABLE OF CONTENTS

Technical Stack
System Architecture
Database Schema
User Roles & Permissions
Sprint 1: Foundation & Authentication
Sprint 2: User Dashboards & Profiles
ZOOM INTEGRATION STRATEGY
Sprint 3: Booking System
Sprint 4: Payments & Stripe Connect
Sprint 5: LiftMatcher® Quiz & Email Automation
Sprint 6: Resource Library, Progress Tracking & Launch
API Endpoints
Component Specifications
Third-Party Integrations
Security Requirements
Testing Requirements
Deployment Plan

1. TECHNICAL STACK
   Required Technologies
   yamlFrontend:
   framework: Next.js 14+ (App Router)
   language: TypeScript
   styling: Tailwind CSS
   components: shadcn/ui
   state: React Query (TanStack Query) + Zustand
   forms: React Hook Form + Zod validation

Backend:
database: Supabase (PostgreSQL 15+)
auth: Supabase Auth
storage: Supabase Storage
realtime: Supabase Realtime
edge_functions: Supabase Edge Functions (Deno)

Hosting:
platform: Vercel
cdn: Vercel Edge Network
domain: sandwina.org

Payments:
processor: Stripe Checkout
marketplace: Stripe Connect (Express accounts)
webhooks: Stripe webhook handlers

Email:
service: Resend
templates: React Email

Integrations:
quiz: Typeform API (webhooks + REST)
video: Zoom (FREE accounts - coach-provided links)
analytics: Vercel Analytics + PostHog

Development:
monorepo: Single Next.js project
version_control: Git
ci_cd: Vercel automatic deployments
testing: Vitest (unit) + Playwright (E2E)
linting: ESLint + Prettier
Environment Variables Required
bash# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_CONNECT_WEBHOOK_SECRET=

# Resend

RESEND_API_KEY=

# Typeform

TYPEFORM_API_KEY=
TYPEFORM_FORM_ID=
TYPEFORM_WEBHOOK_SECRET=

# App

NEXT_PUBLIC_APP_URL=https://sandwina.org
NODE_ENV=production

# Cron

CRON_SECRET=

2. SYSTEM ARCHITECTURE
   High-Level Architecture
   ┌─────────────────────────────────────────────────────┐
   │ Client Browser │
   │ (Next.js React App) │
   └──────────────┬──────────────────────────────────────┘
   │
   ▼
   ┌─────────────────────────────────────────────────────┐
   │ Vercel Edge Network │
   │ (CDN + Server Components) │
   └──────┬─────────────────────┬────────────────────────┘
   │ │
   ▼ ▼
   ┌─────────────────┐ ┌─────────────────┐
   │ Supabase │ │ Stripe │
   │ • PostgreSQL │ │ • Checkout │
   │ • Auth │ │ • Connect │
   │ • Storage │ │ • Webhooks │
   │ • Realtime │ └─────────────────┘
   └─────────────────┘
   │
   ▼
   ┌─────────────────┐ ┌─────────────────┐
   │ Resend │ │ Typeform │
   │ (Emails) │ │ (Quiz API) │
   └─────────────────┘ └─────────────────┘
   Data Flow - Booking Process
   Client → Browse Coaches → Select Coach → View Availability
   ↓
   Choose Date/Time
   ↓
   Select Package (1/3/6/12)
   ↓
   Stripe Checkout (payment intent created)
   ↓
   Payment Successful (webhook)
   ↓
   ┌────────────────────────┴────────────────────┐
   ▼ ▼
   Create Session Record Calculate Platform Fee
   (with Coach's Zoom link) & Coach Payout
   ▼ ↓
   Send Confirmation Email Hold funds in Stripe
   (includes Zoom link) ↓
   ▼ On Session Complete:
   Send Calendar Invite Transfer to Coach
   (.ics file) (Stripe Connect)

3. DATABASE SCHEMA
   Complete PostgreSQL Schema
   sql-- =====================================================
   -- CORE TABLES
   -- =====================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
role TEXT NOT NULL CHECK (role IN ('client', 'coach', 'admin')),
full_name TEXT NOT NULL,
email TEXT UNIQUE NOT NULL,
phone TEXT,
avatar_url TEXT,
quiz_archetype TEXT,
quiz_completed_at TIMESTAMPTZ,
onboarding_completed BOOLEAN DEFAULT FALSE,
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coach profiles
CREATE TABLE coaches (
id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
bio TEXT NOT NULL,
specialties TEXT[] NOT NULL,
certifications JSONB,
years_experience INTEGER,
hourly_rate DECIMAL(10,2) NOT NULL DEFAULT 150.00,
video_intro_url TEXT,
linkedin_url TEXT,
stripe_connect_account_id TEXT UNIQUE,
stripe_onboarding_complete BOOLEAN DEFAULT FALSE,
is_approved BOOLEAN DEFAULT FALSE,
is_featured BOOLEAN DEFAULT FALSE,
availability_buffer_hours INTEGER DEFAULT 48,
timezone TEXT DEFAULT 'America/Chicago',
default_zoom_link TEXT,
zoom_preferences JSONB DEFAULT '{"use_personal_meeting_room": true, "meeting_id": null, "passcode": null}'::jsonb,
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coach availability (recurring weekly schedule)
CREATE TABLE availability (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
coach_id UUID NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
start_time TIME NOT NULL,
end_time TIME NOT NULL,
is_active BOOLEAN DEFAULT TRUE,
created_at TIMESTAMPTZ DEFAULT NOW(),
UNIQUE(coach_id, day_of_week, start_time)
);

-- Blocked time slots
CREATE TABLE blocked_slots (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
coach_id UUID NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
start_time TIMESTAMPTZ NOT NULL,
end_time TIMESTAMPTZ NOT NULL,
reason TEXT,
created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- BOOKING & SESSIONS
-- =====================================================

-- Session packages
CREATE TABLE packages (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
coach_id UUID NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
package_type TEXT NOT NULL CHECK (package_type IN ('single', '3pack', '6pack', '12pack', 'monthly_standard', 'monthly_premium')),
total_sessions INTEGER NOT NULL,
sessions_used INTEGER DEFAULT 0,
sessions_remaining INTEGER GENERATED ALWAYS AS (total_sessions - sessions_used) STORED,
amount_paid DECIMAL(10,2) NOT NULL,
stripe_payment_intent_id TEXT,
purchase_date TIMESTAMPTZ DEFAULT NOW(),
expiration_date TIMESTAMPTZ,
is_active BOOLEAN DEFAULT TRUE,
created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual coaching sessions
CREATE TABLE sessions (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
coach_id UUID NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
package_id UUID REFERENCES packages(id) ON DELETE SET NULL,
scheduled_at TIMESTAMPTZ NOT NULL,
duration_minutes INTEGER DEFAULT 45,
status TEXT NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show', 'rescheduled')) DEFAULT 'scheduled',
zoom_meeting_link TEXT,
client_goals TEXT,
coach_private_notes TEXT,
session_summary TEXT,
client_rating INTEGER CHECK (client_rating BETWEEN 1 AND 5),
client_feedback TEXT,
reminder_24h_sent BOOLEAN DEFAULT FALSE,
reminder_1h_sent BOOLEAN DEFAULT FALSE,
post_session_email_sent BOOLEAN DEFAULT FALSE,
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW(),
CONSTRAINT no_overlapping_sessions UNIQUE (coach_id, scheduled_at)
);

-- =====================================================
-- PAYMENTS & TRANSACTIONS
-- =====================================================

CREATE TABLE transactions (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
client_id UUID NOT NULL REFERENCES profiles(id),
coach_id UUID REFERENCES coaches(id),
session_id UUID REFERENCES sessions(id),
package_id UUID REFERENCES packages(id),
transaction_type TEXT NOT NULL CHECK (transaction_type IN ('session', 'package', 'membership', 'refund')),
amount_total DECIMAL(10,2) NOT NULL,
stripe_fee DECIMAL(10,2),
platform_fee DECIMAL(10,2),
coach_payout DECIMAL(10,2),
stripe_payment_intent_id TEXT UNIQUE,
stripe_transfer_id TEXT,
payout_status TEXT CHECK (payout_status IN ('pending', 'processing', 'paid', 'failed')) DEFAULT 'pending',
payout_date TIMESTAMPTZ,
status TEXT NOT NULL CHECK (status IN ('succeeded', 'pending', 'failed', 'refunded')) DEFAULT 'pending',
created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- LIFTMATCHER QUIZ
-- =====================================================

CREATE TABLE quiz_results (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
typeform_response_id TEXT UNIQUE NOT NULL,
responses JSONB NOT NULL,
career_stage TEXT,
primary_goals TEXT[],
work_challenges TEXT[],
coaching_style_preference TEXT,
recommended_coaches JSONB,
archetype TEXT,
created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PROGRESS TRACKING
-- =====================================================

CREATE TABLE client_goals (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
coach_id UUID REFERENCES coaches(id),
goal_statement TEXT NOT NULL,
goal_category TEXT,
target_date DATE,
status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed', 'archived')) DEFAULT 'not_started',
progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE milestones (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
goal_id UUID NOT NULL REFERENCES client_goals(id) ON DELETE CASCADE,
description TEXT NOT NULL,
target_date DATE,
completed BOOLEAN DEFAULT FALSE,
completed_at TIMESTAMPTZ,
notes TEXT,
display_order INTEGER DEFAULT 0,
created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE progress_checkins (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
coach_id UUID NOT NULL REFERENCES coaches(id),
session_id UUID REFERENCES sessions(id),
goal_id UUID REFERENCES client_goals(id),
checkin_date DATE DEFAULT CURRENT_DATE,
progress_note TEXT NOT NULL,
wins TEXT[],
challenges TEXT[],
action_items TEXT[],
created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE client_reflections (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
session_id UUID REFERENCES sessions(id),
reflection_date DATE DEFAULT CURRENT_DATE,
insights TEXT,
actions_taken TEXT,
feeling_rating INTEGER CHECK (feeling_rating BETWEEN 1 AND 5),
created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- RESOURCES LIBRARY
-- =====================================================

CREATE TABLE resources (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
title TEXT NOT NULL,
description TEXT,
resource_type TEXT NOT NULL CHECK (resource_type IN ('pdf', 'video', 'template', 'article', 'tool', 'checklist')),
file_url TEXT,
thumbnail_url TEXT,
file_size_bytes BIGINT,
category TEXT NOT NULL,
tags TEXT[],
is_premium BOOLEAN DEFAULT FALSE,
access_level TEXT CHECK (access_level IN ('all', 'clients_only', 'members_only')) DEFAULT 'clients_only',
view_count INTEGER DEFAULT 0,
download_count INTEGER DEFAULT 0,
uploaded_by UUID REFERENCES profiles(id),
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE resource_access_log (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
access_type TEXT NOT NULL CHECK (access_type IN ('view', 'download')),
accessed_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- EMAIL & NOTIFICATIONS
-- =====================================================

CREATE TABLE email_logs (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
recipient_email TEXT NOT NULL,
recipient_id UUID REFERENCES profiles(id),
email_type TEXT NOT NULL,
subject TEXT,
resend_message_id TEXT UNIQUE,
status TEXT CHECK (status IN ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed')) DEFAULT 'sent',
sent_at TIMESTAMPTZ DEFAULT NOW(),
opened_at TIMESTAMPTZ,
clicked_at TIMESTAMPTZ
);

CREATE TABLE email_templates (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
template_key TEXT UNIQUE NOT NULL,
template_name TEXT NOT NULL,
subject TEXT NOT NULL,
body_html TEXT NOT NULL,
variables JSONB,
is_active BOOLEAN DEFAULT TRUE,
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ADMIN & SYSTEM
-- =====================================================

CREATE TABLE settings (
key TEXT PRIMARY KEY,
value JSONB NOT NULL,
description TEXT,
updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE activity_log (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID REFERENCES profiles(id),
action TEXT NOT NULL,
entity_type TEXT,
entity_id UUID,
metadata JSONB,
created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_coaches_approved ON coaches(is_approved) WHERE is_approved = TRUE;
CREATE INDEX idx_sessions_client_id ON sessions(client_id);
CREATE INDEX idx_sessions_coach_id ON sessions(coach_id);
CREATE INDEX idx_sessions_scheduled_at ON sessions(scheduled_at);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_availability_coach_day ON availability(coach_id, day_of_week);
CREATE INDEX idx_transactions_client_id ON transactions(client_id);
CREATE INDEX idx_transactions_coach_id ON transactions(coach_id);
CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_resources_premium ON resources(is_premium);
CREATE INDEX idx_client_goals_client_id ON client_goals(client_id);
CREATE INDEX idx_client_goals_status ON client_goals(status);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_access_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read their own, admins can read all
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Coaches: Public can read approved coaches
CREATE POLICY "Public can view approved coaches" ON coaches FOR SELECT USING (is_approved = TRUE);
CREATE POLICY "Coaches can update own profile" ON coaches FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can manage coaches" ON coaches FOR ALL USING (
EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Sessions: Clients and coaches see their own
CREATE POLICY "Clients can view own sessions" ON sessions FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "Coaches can view their sessions" ON sessions FOR SELECT USING (auth.uid() = coach_id);
CREATE POLICY "Coaches can update their session notes" ON sessions FOR UPDATE USING (auth.uid() = coach_id);
CREATE POLICY "Admins can view all sessions" ON sessions FOR SELECT USING (
EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Progress: Clients see own, coaches see their clients'
CREATE POLICY "Clients can view own goals" ON client_goals FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "Coaches can view their clients' goals" ON client_goals FOR SELECT USING (auth.uid() = coach_id);
CREATE POLICY "Coaches can update their clients' goals" ON client_goals FOR UPDATE USING (auth.uid() = coach_id);

-- Resources: Based on access level
CREATE POLICY "Users can view accessible resources" ON resources FOR SELECT USING (
access_level = 'all' OR
(access_level = 'clients_only' AND auth.uid() IS NOT NULL) OR
(access_level = 'members_only' AND EXISTS (
SELECT 1 FROM packages WHERE client_id = auth.uid() AND is_active = TRUE AND package_type IN ('monthly_standard', 'monthly_premium')
))
);
CREATE POLICY "Admins can manage resources" ON resources FOR ALL USING (
EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Transactions: Users see their own
CREATE POLICY "Clients can view own transactions" ON transactions FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "Coaches can view their transactions" ON transactions FOR SELECT USING (auth.uid() = coach_id);
CREATE POLICY "Admins can view all transactions" ON transactions FOR SELECT USING (
EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- =====================================================
-- TRIGGERS
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = NOW();
RETURN NEW;
END;

$$
LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coaches_updated_at BEFORE UPDATE ON coaches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_goals_updated_at BEFORE UPDATE ON client_goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Increment sessions_used when completed
CREATE OR REPLACE FUNCTION increment_package_usage()
RETURNS TRIGGER AS
$$

BEGIN
IF NEW.status = 'completed' AND OLD.status != 'completed' AND NEW.package_id IS NOT NULL THEN
UPDATE packages SET sessions_used = sessions_used + 1 WHERE id = NEW.package_id;
END IF;
RETURN NEW;
END;

$$
LANGUAGE plpgsql;

CREATE TRIGGER increment_package_on_session_complete
  AFTER UPDATE ON sessions
  FOR EACH ROW EXECUTE FUNCTION increment_package_usage();

4. USER ROLES & PERMISSIONS
Role Definitions
typescripttype UserRole = 'client' | 'coach' | 'admin';

interface RolePermissions {
  client: {
    can_browse_coaches: true,
    can_take_quiz: true,
    can_book_sessions: true,
    can_view_own_sessions: true,
    can_rate_sessions: true,
    can_access_resources: true,
    can_track_progress: true,
    can_view_own_transactions: true,
  },
  coach: {
    can_view_own_profile: true,
    can_edit_own_profile: true,
    can_set_availability: true,
    can_set_zoom_link: true,
    can_view_own_bookings: true,
    can_view_client_info: true,
    can_add_session_notes: true,
    can_view_own_earnings: true,
    can_add_progress_notes: true,
  },
  admin: {
    can_view_all_users: true,
    can_approve_coaches: true,
    can_view_all_sessions: true,
    can_view_all_transactions: true,
    can_upload_resources: true,
    can_edit_email_templates: true,
    can_view_analytics: true,
  }
}
Route Protection (Middleware)
typescript// /middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const { data: { session } } = await supabase.auth.getSession();
  const path = req.nextUrl.pathname;

  // Protected routes
  if (path.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Admin-only routes
  if (path.startsWith('/dashboard/admin') && session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  // Coach-only routes
  if (path.startsWith('/dashboard/coach') && session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'coach' && profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/booking/:path*']
};

SPRINT 1 (Weeks 1-2): Foundation & Authentication
User Stories
US-1.1: As a new user, I can sign up with email/password
US-1.2: As a user, I can sign in with Google OAuth
US-1.3: As a user, I can reset my forgotten password
US-1.4: As a user, I am redirected to appropriate dashboard based on my role
US-1.5: As a user, I see a responsive navigation bar
Technical Implementation
Authentication System
typescript// /lib/auth.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export async function signUp(email: string, password: string, fullName: string, role: 'client' | 'coach' = 'client') {
  const supabase = createClientComponentClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role
      }
    }
  });

  if (data.user) {
    await supabase.from('profiles').insert({
      id: data.user.id,
      email,
      full_name: fullName,
      role
    });
  }

  return { data, error };
}

export async function signInWithGoogle() {
  const supabase = createClientComponentClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
    }
  });
  return { data, error };
}

export async function signOut() {
  const supabase = createClientComponentClient();
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function resetPassword(email: string) {
  const supabase = createClientComponentClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`
  });
  return { error };
}
Sign Up Form Component
tsx// /components/auth/SignUpForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signUp, signInWithGoogle } from '@/lib/auth';

export function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await signUp(email, password, fullName);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signInWithGoogle();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Creating account...' : 'Sign Up'}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignIn}
        disabled={loading}
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Google
      </Button>
    </form>
  );
}
Project Structure
sandwina/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── reset-password/
│   │       └── page.tsx
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── admin/
│   │   └── coach/
│   ├── api/
│   │   ├── auth/
│   │   ├── webhooks/
│   │   └── emails/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── auth/
│   ├── coaches/
│   ├── booking/
│   └── dashboard/
├── lib/
│   ├── auth.ts
│   ├── supabase.ts
│   └── utils.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── public/
├── .env.local
├── middleware.ts
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
Acceptance Criteria

 Users can sign up with email/password
 Users receive email verification
 Users can sign in with Google OAuth
 Password reset flow works end-to-end
 Protected routes redirect unauthenticated users
 Users redirected to role-appropriate dashboard
 Navigation shows/hides items based on auth state
 All forms have validation and error messages
 Mobile responsive (320px, 768px, 1024px)


SPRINT 2 (Weeks 3-4): User Dashboards & Profiles
User Stories
US-2.1: As a client, I see my dashboard with upcoming sessions and progress
US-2.2: As a coach, I see my dashboard with today's bookings and earnings
US-2.3: As an admin, I see platform overview metrics
US-2.4: As a coach applicant, I can submit my application
US-2.5: As an admin, I can approve/reject coach applications
US-2.6: As a user, I can edit my profile
Client Dashboard
tsx// /app/dashboard/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { UpcomingSessions } from '@/components/dashboard/UpcomingSessions';
import { ProgressOverview } from '@/components/dashboard/ProgressOverview';
import { RecommendedResources } from '@/components/dashboard/RecommendedResources';
import { QuickActions } from '@/components/dashboard/QuickActions';

export default async function ClientDashboard() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  const { data: upcomingSessions } = await supabase
    .from('sessions')
    .select(`
      *,
      coach:coaches(
        profile:profiles!coaches_id_fkey(full_name, avatar_url)
      )
    `)
    .eq('client_id', user?.id)
    .eq('status', 'scheduled')
    .order('scheduled_at', { ascending: true })
    .limit(3);

  const { data: goals } = await supabase
    .from('client_goals')
    .select('*')
    .eq('client_id', user?.id)
    .eq('status', 'in_progress');

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome back!</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <QuickActions />
        <UpcomingSessions sessions={upcomingSessions} />
        <ProgressOverview goals={goals} />
        <RecommendedResources className="md:col-span-2" />
      </div>
    </div>
  );
}
Coach Application Flow
tsx// /app/apply/coach/page.tsx
import { CoachApplicationForm } from '@/components/forms/CoachApplicationForm';

export default function CoachApplication() {
  return (
    <div className="container max-w-2xl mx-auto py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Join SANDWINA as a Coach</h1>
        <p className="text-lg text-muted-foreground">
          Help women achieve their career goals. Share your expertise.
        </p>
      </div>

      <CoachApplicationForm />
    </div>
  );
}
tsx// /components/forms/CoachApplicationForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const coachApplicationSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  bio: z.string().min(100),
  certifications: z.string().min(10),
  yearsExperience: z.number().min(1),
  specialties: z.string().min(10),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  hourlyRate: z.number().min(50).max(500),
});

type CoachApplicationData = z.infer<typeof coachApplicationSchema>;

export function CoachApplicationForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const form = useForm<CoachApplicationData>({
    resolver: zodResolver(coachApplicationSchema),
    defaultValues: {
      hourlyRate: 150,
    }
  });

  const onSubmit = async (data: CoachApplicationData) => {
    setLoading(true);

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: crypto.randomUUID(),
        options: {
          data: {
            full_name: data.fullName,
            role: 'coach'
          }
        }
      });

      if (authError) throw authError;

      // Create profile
      await supabase.from('profiles').insert({
        id: authData.user!.id,
        email: data.email,
        full_name: data.fullName,
        phone: data.phone,
        role: 'coach',
      });

      // Create coach record
      const certificationsArray = data.certifications.split(',').map(c => c.trim());
      const specialtiesArray = data.specialties.split(',').map(s => s.trim());

      await supabase.from('coaches').insert({
        id: authData.user!.id,
        bio: data.bio,
        certifications: certificationsArray,
        years_experience: data.yearsExperience,
        specialties: specialtiesArray,
        linkedin_url: data.linkedinUrl || null,
        hourly_rate: data.hourlyRate,
        is_approved: false,
      });

      router.push('/apply/coach/success');
    } catch (error) {
      console.error('Application error:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Form fields implementation */}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Application'}
      </Button>
    </form>
  );
}
Acceptance Criteria

 Client dashboard displays sessions, progress, resources
 Coach dashboard shows schedule, earnings, clients
 Admin dashboard shows platform metrics
 Coach application validates all fields
 Admin can approve/reject coaches
 Profile edit works for all user types
 All dashboards are mobile responsive


CRITICAL SYSTEM DESIGN: Zoom Integration Strategy
The Challenge
We need video conferencing for coaching sessions but:

❌ Cannot depend on paid Zoom API ($100-$200/month)
❌ Cannot require coaches to buy premium Zoom
❌ Must work at scale (10-1000 coaches)
✅ Must provide enterprise-level UX

The Solution: Free Zoom with Smart Link Management
Design Principles:

Zero Zoom API costs
Works with free Zoom accounts
Set once, works forever
High UX - clients always get working links
Flexible - coaches can customize per session

Database Changes (Already in Schema Above)
sql-- Added to coaches table:
ALTER TABLE coaches ADD COLUMN default_zoom_link TEXT;
ALTER TABLE coaches ADD COLUMN zoom_preferences JSONB DEFAULT '{
  "use_personal_meeting_room": true,
  "meeting_id": null,
  "passcode": null
}'::jsonb;

-- sessions table already has:
-- zoom_meeting_link TEXT (can override default)
Coach Onboarding - Zoom Setup
tsx// /app/dashboard/coach/onboarding/zoom/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Video, ExternalLink, CheckCircle2, Info } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function ZoomSetupPage() {
  const [zoomLink, setZoomLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();

  const validateZoomLink = (url: string): boolean => {
    const zoomPatterns = [
      /https:\/\/.*\.zoom\.us\/j\/\d+/,
      /https:\/\/zoom\.us\/j\/\d+/,
      /https:\/\/.*\.zoom\.us\/my\//,
    ];
    return zoomPatterns.some(pattern => pattern.test(url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateZoomLink(zoomLink)) {
      setError('Please enter a valid Zoom meeting link');
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      await supabase
        .from('coaches')
        .update({ default_zoom_link: zoomLink })
        .eq('id', user?.id);

      router.push('/dashboard/coach/onboarding/complete');
    } catch (err) {
      setError('Failed to save Zoom link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Video className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Set Up Your Zoom Link</h1>
        </div>
        <p className="text-muted-foreground">
          This will be your default meeting link for all coaching sessions
        </p>
      </div>

      {/* Instructions Card */}
      <Card className="mb-6 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            How to Get Your Zoom Link (Free Account)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="font-semibold mb-2">Option 1: Personal Meeting Room (Recommended)</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Log in to <a href="https://zoom.us" target="_blank" rel="noopener" className="text-blue-600 underline">zoom.us</a></li>
              <li>Go to "Profile" → "Personal Meeting Room"</li>
              <li>Copy your Personal Meeting Room URL</li>
              <li>Paste it below</li>
            </ol>
          </div>

          <div className="border-t pt-3">
            <p className="font-semibold mb-2">Option 2: Recurring Meeting</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Go to Zoom → "Meetings" → "Schedule a Meeting"</li>
              <li>Select "Recurring meeting" with "No Fixed Time"</li>
              <li>Copy the meeting URL after creating it</li>
              <li>Paste it below</li>
            </ol>
          </div>

          <Alert>
            <AlertDescription className="text-sm">
              💡 <strong>Pro Tip:</strong> Your Personal Meeting Room is the easiest option.
              It's a permanent link that works for all your sessions.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Your Default Zoom Link</CardTitle>
          <CardDescription>
            This link will be automatically included in all session bookings.
            You can change it anytime or override it for specific sessions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="zoomLink">Zoom Meeting URL</Label>
              <Input
                id="zoomLink"
                type="url"
                placeholder="https://zoom.us/j/1234567890"
                value={zoomLink}
                onChange={(e) => setZoomLink(e.target.value)}
                className="mt-2"
              />
              {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-1 text-sm">
                  <p className="font-semibold">What happens next:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>✓ This link will be sent to clients when they book</li>
                    <li>✓ It will be included in reminder emails</li>
                    <li>✓ You can update it anytime in settings</li>
                    <li>✓ You can provide a different link for specific sessions</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Saving...' : 'Save & Continue'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push('/dashboard/coach')}>
                Skip for Now
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Don't have a Zoom account? <a href="https://zoom.us/signup" target="_blank" rel="noopener" className="text-primary underline">Sign up for free</a>
            </p>
          </form>
        </CardContent>
      </Card>

      {/* Preview Card */}
      {zoomLink && validateZoomLink(zoomLink) && (
        <Card className="mt-6 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              <div className="flex-1">
                <p className="font-semibold text-green-900">Valid Zoom Link!</p>
                <p className="text-sm text-green-700">Your clients will be able to join sessions using this link</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href={zoomLink} target="_blank" rel="noopener">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Test Link
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
Zoom Link Validation Utility
typescript// /lib/zoom/validation.ts

export function isValidZoomLink(url: string): boolean {
  if (!url) return false;

  const zoomPatterns = [
    /^https:\/\/([\w-]+\.)?zoom\.us\/j\/\d{9,11}(\?pwd=[\w-]+)?$/,
    /^https:\/\/([\w-]+\.)?zoom\.us\/my\/([\w-]+)$/,
    /^https:\/\/zoom\.us\/j\/\d{9,11}$/,
  ];

  return zoomPatterns.some(pattern => pattern.test(url.trim()));
}

export function extractZoomMeetingId(url: string): string | null {
  const match = url.match(/\/j\/(\d{9,11})/);
  return match ? match[1] : null;
}
Automatic Zoom Link Assignment
typescript// Update in /app/api/webhooks/stripe/route.ts

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { client_id, coach_id, first_session_at } = session.metadata!;

  // Get coach's default Zoom link
  const { data: coach } = await supabase
    .from('coaches')
    .select('default_zoom_link')
    .eq('id', coach_id)
    .single();

  // Create session with default Zoom link
  const { data: sessionRecord } = await supabase
    .from('sessions')
    .insert({
      client_id,
      coach_id,
      package_id: packageRecord.id,
      scheduled_at: first_session_at,
      duration_minutes: 45,
      status: 'scheduled',
      zoom_meeting_link: coach?.default_zoom_link || null,
    })
    .select()
    .single();

  // If no Zoom link, notify coach
  if (!coach?.default_zoom_link) {
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/emails/coach-add-zoom-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        coachId: coach_id,
        sessionId: sessionRecord.id,
      }),
    });
  }
}
Coach Zoom Settings Management
tsx// /app/dashboard/coach/settings/zoom/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Video, Edit, Check, AlertCircle } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function ZoomSettingsPage() {
  const [currentLink, setCurrentLink] = useState('');
  const [newLink, setNewLink] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [upcomingSessions, setUpcomingSessions] = useState<number>(0);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchZoomSettings();
    fetchUpcomingSessions();
  }, []);

  const fetchZoomSettings = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    const { data: coach } = await supabase
      .from('coaches')
      .select('default_zoom_link')
      .eq('id', user?.id)
      .single();

    setCurrentLink(coach?.default_zoom_link || '');
    setNewLink(coach?.default_zoom_link || '');
  };

  const fetchUpcomingSessions = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    const { count } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .eq('coach_id', user?.id)
      .eq('status', 'scheduled')
      .gte('scheduled_at', new Date().toISOString());

    setUpcomingSessions(count || 0);
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      await supabase
        .from('coaches')
        .update({ default_zoom_link: newLink })
        .eq('id', user?.id);

      // Update future sessions without custom links
      await supabase
        .from('sessions')
        .update({ zoom_meeting_link: newLink })
        .eq('coach_id', user?.id)
        .eq('status', 'scheduled')
        .is('zoom_meeting_link', null)
        .gte('scheduled_at', new Date().toISOString());

      setCurrentLink(newLink);
      setEditing(false);
      alert('Zoom link updated successfully!');
    } catch (error) {
      alert('Failed to update Zoom link');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container max-w-3xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Zoom Settings</h1>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Video className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Default Zoom Link</CardTitle>
                <CardDescription>
                  Used automatically for all new bookings
                </CardDescription>
              </div>
            </div>
            {!editing && currentLink && (
              <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {editing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="newLink">Zoom Meeting URL</Label>
                <Input
                  id="newLink"
                  type="url"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  placeholder="https://zoom.us/j/1234567890"
                  className="mt-2"
                />
              </div>

              {upcomingSessions > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You have <strong>{upcomingSessions} upcoming session{upcomingSessions !== 1 ? 's' : ''}</strong>.
                    Updating this link will affect all future sessions.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3">
                <Button onClick={handleSave} disabled={saving || !newLink}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button variant="outline" onClick={() => {
                  setEditing(false);
                  setNewLink(currentLink);
                }}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div>
              {currentLink ? (
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-1">Current Link</p>
                        <p className="font-mono text-sm break-all">{currentLink}</p>
                      </div>
                      <Badge variant="secondary" className="ml-4">
                        <Check className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You haven't set a default Zoom link yet. Add one now.
                  </AlertDescription>
                  <Button className="mt-4" onClick={() => setEditing(true)}>
                    Add Zoom Link Now
                  </Button>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
Missing Zoom Link Checker (Cron Job)
typescript// /app/api/cron/check-zoom-links/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { addHours } from 'date-fns';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const in48Hours = addHours(new Date(), 48);

    const { data: sessionsWithoutZoom } = await supabase
      .from('sessions')
      .select(`
        *,
        coach:coaches(default_zoom_link, profile:profiles!coaches_id_fkey(full_name, email)),
        client:profiles!sessions_client_id_fkey(full_name, email)
      `)
      .eq('status', 'scheduled')
      .lte('scheduled_at', in48Hours.toISOString())
      .gte('scheduled_at', new Date().toISOString())
      .or('zoom_meeting_link.is.null,zoom_meeting_link.eq.');

    if (!sessionsWithoutZoom || sessionsWithoutZoom.length === 0) {
      return NextResponse.json({ message: 'All sessions have Zoom links' });
    }

    for (const session of sessionsWithoutZoom) {
      if (session.coach.default_zoom_link) {
        await supabase
          .from('sessions')
          .update({ zoom_meeting_link: session.coach.default_zoom_link })
          .eq('id', session.id);

        console.log(`✅ Applied default Zoom link to session ${session.id}`);
      } else {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/emails/urgent-add-zoom`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            coachEmail: session.coach.profile.email,
            coachName: session.coach.profile.full_name,
            clientName: session.client.full_name,
            sessionDate: session.scheduled_at,
            sessionId: session.id,
          }),
        });

        console.log(`⚠️ Sent urgent reminder to coach for session ${session.id}`);
      }
    }

    return NextResponse.json({
      checked: sessionsWithoutZoom.length,
      fixed: sessionsWithoutZoom.filter(s => s.coach.default_zoom_link).length,
    });
  } catch (error) {
    console.error('Error checking Zoom links:', error);
    return NextResponse.json({ error: 'Failed to check Zoom links' }, { status: 500 });
  }
}
Update vercel.json for Cron Jobs
json{
  "crons": [
    {
      "path": "/api/cron/send-reminders",
      "schedule": "*/15 * * * *"
    },
    {
      "path": "/api/cron/check-zoom-links",
      "schedule": "0 */6 * * *"
    },
    {
      "path": "/api/cron/re-engagement",
      "schedule": "0 10 * * *"
    }
  ]
}
Zoom Integration Benefits
✅ $0 Zoom costs - No API fees, no premium plans
✅ Simple for coaches - Set once, works forever
✅ Reliable for clients - Always get working link
✅ Flexible - Can override per session
✅ Failsafe - Automated checks ensure no missing links
✅ Professional UX - Seamless experience
✅ Scalable - Works for 10 or 1,000 coaches

SPRINT 3 (Weeks 5-6): Booking System
User Stories
US-3.1: As a client, I can browse all approved coaches
US-3.2: As a client, I can view detailed coach profile
US-3.3: As a client, I can see coach's real-time availability
US-3.4: As a client, I can select date/time for booking
US-3.5: As a coach, I can set my weekly recurring availability
US-3.6: As a coach, I can block specific dates/times
Coach Directory
tsx// /app/coaches/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { CoachCard } from '@/components/coaches/CoachCard';
import { CoachFilters } from '@/components/coaches/CoachFilters';

export default async function CoachesPage({
  searchParams,
}: {
  searchParams: { specialty?: string; search?: string };
}) {
  const supabase = createServerComponentClient({ cookies });

  let query = supabase
    .from('coaches')
    .select(`
      *,
      profile:profiles!coaches_id_fkey(full_name, avatar_url)
    `)
    .eq('is_approved', true);

  if (searchParams.specialty) {
    query = query.contains('specialties', [searchParams.specialty]);
  }

  if (searchParams.search) {
    query = query.ilike('profile.full_name', `%${searchParams.search}%`);
  }

  const { data: coaches } = await query.order('is_featured', { ascending: false });

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Meet Our Coaches</h1>
        <p className="text-xl text-muted-foreground">
          Certified career coaches ready to help you succeed
        </p>
      </div>

      <CoachFilters />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
        {coaches?.map((coach) => (
          <CoachCard key={coach.id} coach={coach} />
        ))}
      </div>
    </div>
  );
}
Availability Calculation API
typescript// /app/api/coaches/[id]/availability/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { addMinutes, setHours, setMinutes, format, parse } from 'date-fns';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  const searchParams = request.nextUrl.searchParams;
  const dateStr = searchParams.get('date');

  if (!dateStr) {
    return NextResponse.json({ error: 'Date required' }, { status: 400 });
  }

  const date = new Date(dateStr);
  const dayOfWeek = date.getDay();

  try {
    // Get coach's recurring availability
    const { data: availability } = await supabase
      .from('availability')
      .select('start_time, end_time')
      .eq('coach_id', params.id)
      .eq('day_of_week', dayOfWeek)
      .eq('is_active', true);

    if (!availability || availability.length === 0) {
      return NextResponse.json({ slots: [] });
    }

    // Get buffer hours
    const { data: coach } = await supabase
      .from('coaches')
      .select('availability_buffer_hours')
      .eq('id', params.id)
      .single();

    const bufferHours = coach?.availability_buffer_hours || 48;
    const minBookingTime = addMinutes(new Date(), bufferHours * 60);

    // Generate 45-minute slots
    const allSlots: Date[] = [];

    for (const avail of availability) {
      const startTime = parse(avail.start_time, 'HH:mm:ss', date);
      const endTime = parse(avail.end_time, 'HH:mm:ss', date);

      let currentSlot = startTime;
      while (currentSlot < endTime) {
        if (currentSlot >= minBookingTime) {
          allSlots.push(new Date(currentSlot));
        }
        currentSlot = addMinutes(currentSlot, 45);
      }
    }

    // Get existing bookings
    const startOfDay = format(date, 'yyyy-MM-dd') + 'T00:00:00';
    const endOfDay = format(date, 'yyyy-MM-dd') + 'T23:59:59';

    const { data: bookedSessions } = await supabase
      .from('sessions')
      .select('scheduled_at, duration_minutes')
      .eq('coach_id', params.id)
      .in('status', ['scheduled', 'completed'])
      .gte('scheduled_at', startOfDay)
      .lte('scheduled_at', endOfDay);

    // Get blocked slots
    const { data: blockedSlots } = await supabase
      .from('blocked_slots')
      .select('start_time, end_time')
      .eq('coach_id', params.id)
      .gte('start_time', startOfDay)
      .lte('end_time', endOfDay);

    // Filter available slots
    const availableSlots = allSlots.filter((slot) => {
      const hasBooking = bookedSessions?.some((booking) => {
        const bookingStart = new Date(booking.scheduled_at);
        const bookingEnd = addMinutes(bookingStart, booking.duration_minutes);
        return slot >= bookingStart && slot < bookingEnd;
      });

      const isBlocked = blockedSlots?.some((blocked) => {
        const blockedStart = new Date(blocked.start_time);
        const blockedEnd = new Date(blocked.end_time);
        return slot >= blockedStart && slot < blockedEnd;
      });

      return !hasBooking && !isBlocked;
    });

    return NextResponse.json({
      slots: availableSlots.map(slot => slot.toISOString())
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
  }
}
Coach Availability Settings
tsx// /app/dashboard/coach/availability/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

export default function CoachAvailabilityPage() {
  const [availability, setAvailability] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    const { data } = await supabase
      .from('availability')
      .select('*')
      .eq('coach_id', user?.id)
      .order('day_of_week');

    if (!data || data.length === 0) {
      const defaultAvailability = DAYS_OF_WEEK.map(day => ({
        day_of_week: day.value,
        start_time: '09:00:00',
        end_time: '17:00:00',
        is_active: day.value >= 1 && day.value <= 5,
      }));
      setAvailability(defaultAvailability);
    } else {
      setAvailability(data);
    }

    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();

    try {
      await supabase
        .from('availability')
        .delete()
        .eq('coach_id', user?.id);

      const activeAvailability = availability
        .filter(day => day.is_active)
        .map(day => ({
          coach_id: user?.id,
          day_of_week: day.day_of_week,
          start_time: day.start_time,
          end_time: day.end_time,
          is_active: true,
        }));

      if (activeAvailability.length > 0) {
        await supabase
          .from('availability')
          .insert(activeAvailability);
      }

      alert('Availability updated successfully!');
    } catch (error) {
      alert('Failed to save availability');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container max-w-2xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Set Your Availability</h1>

      <div className="space-y-4 mb-8">
        {DAYS_OF_WEEK.map((day) => {
          const dayAvail = availability.find(a => a.day_of_week === day.value);

          return (
            <div key={day.value} className="flex items-center gap-4 p-4 border rounded-lg">
              <Switch
                checked={dayAvail?.is_active || false}
                onCheckedChange={() => {
                  setAvailability(prev =>
                    prev.map(a =>
                      a.day_of_week === day.value
                        ? { ...a, is_active: !a.is_active }
                        : a
                    )
                  );
                }}
              />
              <Label className="font-semibold w-32">{day.label}</Label>
              {/* Time pickers here */}
            </div>
          );
        })}
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full">
        {saving ? 'Saving...' : 'Save Availability'}
      </Button>
    </div>
  );
}
Acceptance Criteria

 Coach directory displays all approved coaches
 Coaches filterable by specialty
 Coach profile shows complete info
 Availability calendar shows next 60 days
 Only future dates with buffer time selectable
 Time slots calculated correctly (45-min intervals)
 Booked slots excluded
 Blocked slots excluded
 Coach can set weekly recurring availability
 Timezone handling works correctly
 Mobile responsive booking interface


SPRINT 4 (Weeks 7-8): Payments & Stripe Connect
User Stories
US-4.1: As a client, I can select a package (1, 3, 6, or 12 sessions)
US-4.2: As a client, I can complete payment via Stripe Checkout
US-4.3: As a client, I receive booking confirmation email
US-4.4: As a coach, I can complete Stripe Connect onboarding
US-4.5: As a coach, I receive automatic payouts after completed sessions
US-4.6: As a coach, I can view earnings dashboard
Package Selection & Checkout
tsx// /components/booking/BookingPanel.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AvailabilityCalendar } from './AvailabilityCalendar';

const PACKAGES = [
  { id: 'single', name: 'Discovery', sessions: 1, price: 150, pricePerSession: 150 },
  { id: '3pack', name: 'Focused 3-Pack', sessions: 3, price: 420, pricePerSession: 140, savings: '7% off' },
  { id: '6pack', name: 'Growth 6-Pack', sessions: 6, price: 750, pricePerSession: 125, savings: '17% off', popular: true },
  { id: '12pack', name: 'Career Plan', sessions: 12, price: 1320, pricePerSession: 110, savings: '27% off' },
];

export function BookingPanel({ coach }: { coach: any }) {
  const [selectedPackage, setSelectedPackage] = useState<string>('6pack');
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!selectedSlot) {
      alert('Please select a date and time');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coachId: coach.id,
          packageType: selectedPackage,
          scheduledAt: selectedSlot.toISOString(),
        }),
      });

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      alert('Failed to start checkout');
      setLoading(false);
    }
  };

  const selectedPkg = PACKAGES.find(p => p.id === selectedPackage);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Choose Your Package</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedPackage} onValueChange={setSelectedPackage}>
            {/* Package options */}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Select Date & Time</CardTitle>
        </CardHeader>
        <CardContent>
          <AvailabilityCalendar
            coachId={coach.id}
            onSelectSlot={setSelectedSlot}
          />
        </CardContent>
      </Card>

      <Button onClick={handleCheckout} disabled={loading} className="w-full" size="lg">
        {loading ? 'Processing...' : 'Proceed to Payment'}
      </Button>
    </div>
  );
}
Stripe Checkout API
typescript// /app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const PACKAGE_PRICES = {
  single: 150_00,
  '3pack': 420_00,
  '6pack': 750_00,
  '12pack': 1320_00,
};

const PACKAGE_SESSIONS = {
  single: 1,
  '3pack': 3,
  '6pack': 6,
  '12pack': 12,
};

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { coachId, packageType, scheduledAt } = body;

    const { data: coach } = await supabase
      .from('coaches')
      .select('*, profile:profiles!coaches_id_fkey(full_name, email)')
      .eq('id', coachId)
      .single();

    const { data: client } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', user.id)
      .single();

    const amount = PACKAGE_PRICES[packageType as keyof typeof PACKAGE_PRICES];
    const sessions = PACKAGE_SESSIONS[packageType as keyof typeof PACKAGE_SESSIONS];

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${sessions} Coaching Session${sessions > 1 ? 's' : ''} with ${coach.profile.full_name}`,
              description: `Package: ${packageType}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      customer_email: client?.email,
      metadata: {
        client_id: user.id,
        client_name: client?.full_name || '',
        coach_id: coachId,
        coach_name: coach.profile.full_name,
        package_type: packageType,
        total_sessions: sessions.toString(),
        first_session_at: scheduledAt,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/coaches/${coachId}`,
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 });
  }
}
Stripe Webhook Handler
typescript// /app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      break;
    case 'payment_intent.succeeded':
      await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
      break;
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const {
    client_id,
    coach_id,
    package_type,
    total_sessions,
    first_session_at,
  } = session.metadata!;

  const amountTotal = session.amount_total! / 100;
  const stripeFee = amountTotal * 0.029 + 0.30;
  const netAmount = amountTotal - stripeFee;
  const platformFee = netAmount * 0.25;
  const coachPayout = netAmount - platformFee;

  try {
    // Get coach's default Zoom link
    const { data: coach } = await supabase
      .from('coaches')
      .select('default_zoom_link')
      .eq('id', coach_id)
      .single();

    // Create package
    const { data: packageRecord } = await supabase
      .from('packages')
      .insert({
        client_id,
        coach_id,
        package_type,
        total_sessions: parseInt(total_sessions),
        amount_paid: amountTotal,
        stripe_payment_intent_id: session.payment_intent,
        purchase_date: new Date().toISOString(),
        expiration_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true,
      })
      .select()
      .single();

    // Create first session with Zoom link
    const { data: sessionRecord } = await supabase
      .from('sessions')
      .insert({
        client_id,
        coach_id,
        package_id: packageRecord.id,
        scheduled_at: first_session_at,
        duration_minutes: 45,
        status: 'scheduled',
        zoom_meeting_link: coach?.default_zoom_link || null,
      })
      .select()
      .single();

    // Create transaction
    await supabase.from('transactions').insert({
      client_id,
      coach_id,
      session_id: sessionRecord.id,
      package_id: packageRecord.id,
      transaction_type: 'package',
      amount_total: amountTotal,
      stripe_fee: stripeFee,
      platform_fee: platformFee,
      coach_payout: coachPayout,
      stripe_payment_intent_id: session.payment_intent,
      payout_status: 'pending',
      status: 'succeeded',
    });

    // Send confirmation email
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/emails/booking-confirmation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: client_id,
        coachId: coach_id,
        sessionId: sessionRecord.id,
        scheduledAt: first_session_at,
        zoomLink: coach?.default_zoom_link,
      }),
    });

    console.log(`✅ Booking completed for client ${client_id}`);
  } catch (error) {
    console.error('Error handling checkout:', error);
    throw error;
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  await supabase
    .from('transactions')
    .update({ status: 'succeeded' })
    .eq('stripe_payment_intent_id', paymentIntent.id);
}
Stripe Connect Onboarding
tsx// /app/dashboard/coach/stripe-connect/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function StripeConnectPage() {
  const [loading, setLoading] = useState(true);
  const [stripeStatus, setStripeStatus] = useState<'not_started' | 'incomplete' | 'complete'>('not_started');
  const supabase = createClientComponentClient();

  useEffect(() => {
    checkStripeStatus();
  }, []);

  const checkStripeStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    const { data: coach } = await supabase
      .from('coaches')
      .select('stripe_connect_account_id, stripe_onboarding_complete')
      .eq('id', user?.id)
      .single();

    if (coach?.stripe_connect_account_id) {
      setStripeStatus(coach.stripe_onboarding_complete ? 'complete' : 'incomplete');
    }

    setLoading(false);
  };

  const handleStartOnboarding = async () => {
    setLoading(true);

    const response = await fetch('/api/stripe/connect/onboard', {
      method: 'POST',
    });

    const { url } = await response.json();
    if (url) window.location.href = url;
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className=container max-w-2xl mx-auto py-12">
<h1 className="text-3xl font-bold mb-8">Payment Setup</h1>
  {stripeStatus === 'complete' ? (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
          <div>
            <CardTitle>Payment Setup Complete</CardTitle>
            <CardDescription className="text-green-700">
              You're all set to receive payments!
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Your Stripe account is connected. You'll automatically receive payouts
          2-7 business days after each completed session.
        </p>
      </CardContent>
    </Card>
  ) : (
    <Card>
      <CardHeader>
        <CardTitle>Connect Your Bank Account</CardTitle>
        <CardDescription>
          Set up automatic payments to receive your earnings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold">How it works:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
            <li>Connect your bank account through Stripe (secure)</li>
            <li>Complete identity verification (required by law)</li>
            <li>Start accepting bookings</li>
            <li>Get paid automatically 2-7 days after each session</li>
          </ol>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">You'll receive:</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>✅ 75% of each session fee (25% platform fee)</li>
            <li>✅ Automatic weekly or monthly payouts</li>
            <li>✅ Full transaction history</li>
            <li>✅ Tax documentation (1099) at year-end</li>
          </ul>
        </div>

        <Button onClick={handleStartOnboarding} disabled={loading} className="w-full">
          {loading ? 'Loading...' : 'Connect Bank Account'}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Powered by Stripe • Secure & PCI compliant
        </p>
      </CardContent>
    </Card>
  )}
</div>
);
}

### Stripe Connect Onboarding API
```typescript
// /app/api/stripe/connect/onboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: coach } = await supabase
      .from('coaches')
      .select('stripe_connect_account_id, profile:profiles!coaches_id_fkey(full_name, email)')
      .eq('id', user.id)
      .single();

    if (!coach) {
      return NextResponse.json({ error: 'Coach not found' }, { status: 404 });
    }

    let accountId = coach.stripe_connect_account_id;

    // Create Stripe Connect account if doesn't exist
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'US',
        email: coach.profile.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'individual',
        business_profile: {
          product_description: 'Career coaching services',
        },
      });

      accountId = account.id;

      await supabase
        .from('coaches')
        .update({ stripe_connect_account_id: accountId })
        .eq('id', user.id);
    }

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/coach/stripe-connect`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/coach/stripe-connect/complete`,
      type: 'account_onboarding',
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error) {
    console.error('Stripe Connect error:', error);
    return NextResponse.json({ error: 'Failed to create onboarding link' }, { status: 500 });
  }
}
Session Completion & Payout
typescript// /app/api/sessions/[id]/complete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: session } = await supabase
      .from('sessions')
      .select('*, coach:coaches(stripe_connect_account_id)')
      .eq('id', params.id)
      .single();

    if (!session || session.coach_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update session status
    await supabase
      .from('sessions')
      .update({ status: 'completed' })
      .eq('id', params.id);

    // Get transaction
    const { data: transaction } = await supabase
      .from('transactions')
      .select('*')
      .eq('session_id', params.id)
      .single();

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Process payout via Stripe Connect
    if (session.coach.stripe_connect_account_id && transaction.coach_payout > 0) {
      const transfer = await stripe.transfers.create({
        amount: Math.round(transaction.coach_payout * 100),
        currency: 'usd',
        destination: session.coach.stripe_connect_account_id,
        transfer_group: `session_${params.id}`,
        metadata: {
          session_id: params.id,
          coach_id: session.coach_id,
          client_id: session.client_id,
        },
      });

      await supabase
        .from('transactions')
        .update({
          payout_status: 'paid',
          payout_date: new Date().toISOString(),
          stripe_transfer_id: transfer.id,
        })
        .eq('id', transaction.id);

      console.log(`✅ Payout processed: $${transaction.coach_payout}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error completing session:', error);
    return NextResponse.json({ error: 'Failed to complete session' }, { status: 500 });
  }
}
Acceptance Criteria

 Client can select package and proceed to checkout
 Stripe Checkout displays correct amount
 Payment confirmation creates package and session records
 Sessions automatically include coach's Zoom link
 Client receives booking confirmation email with Zoom link
 Coach can complete Stripe Connect onboarding
 Coach dashboard shows earnings metrics
 Completed sessions trigger automatic payouts
 Transaction records include all fee breakdowns
 Admin can view all transactions


SPRINT 5 (Weeks 9-10): LiftMatcher® Quiz & Email Automation
User Stories
US-5.1: As a visitor, I can take the LiftMatcher® quiz
US-5.2: As a visitor, I see personalized coach recommendations
US-5.3: As a client, I receive automated booking confirmation emails
US-5.4: As a client, I receive 24-hour and 1-hour session reminders
US-5.5: As a client, I receive post-session follow-up emails
US-5.6: As an admin, I can edit email templates
Typeform Quiz Integration
tsx// /app/quiz/page.tsx
import { QuizEmbed } from '@/components/quiz/QuizEmbed';

export default function QuizPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-3xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Find Your Perfect Coach</h1>
        <p className="text-xl text-muted-foreground">
          Take our 5-minute LiftMatcher® quiz to get personalized recommendations
        </p>
      </div>

      <QuizEmbed />
    </div>
  );
}
tsx// /components/quiz/QuizEmbed.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import * as typeformEmbed from '@typeform/embed';

export function QuizEmbed() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (containerRef.current) {
      typeformEmbed.makeWidget(
        containerRef.current,
        `https://form.typeform.com/to/${process.env.NEXT_PUBLIC_TYPEFORM_FORM_ID}`,
        {
          hideHeaders: true,
          hideFooter: true,
          opacity: 0,
          onSubmit: ({ responseId }) => {
            router.push(`/quiz/results?response_id=${responseId}`);
          },
        }
      );
    }
  }, [router]);

  return (
    <div
      ref={containerRef}
      style={{ height: '600px', width: '100%' }}
      className="rounded-lg overflow-hidden shadow-lg"
    />
  );
}
Quiz Results Processing
typescript// /app/api/webhooks/typeform/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Verify webhook signature
    const signature = request.headers.get('typeform-signature');
    const isValid = verifyTypeformSignature(body, signature);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const { event_type, form_response } = body;

    if (event_type === 'form_response') {
      await processQuizResponse(form_response);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Typeform webhook error:', error);
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
  }
}

function verifyTypeformSignature(body: any, signature: string | null): boolean {
  if (!signature) return false;

  const hash = crypto
    .createHmac('sha256', process.env.TYPEFORM_WEBHOOK_SECRET!)
    .update(JSON.stringify(body))
    .digest('base64');

  return hash === signature;
}

async function processQuizResponse(response: any) {
  const { response_id, answers, hidden } = response;
  const clientId = hidden?.client_id;

  const parsedAnswers = parseQuizAnswers(answers);
  const recommendations = await calculateCoachMatches(parsedAnswers);

  await supabase.from('quiz_results').insert({
    client_id: clientId || null,
    typeform_response_id: response_id,
    responses: answers,
    career_stage: parsedAnswers.careerStage,
    primary_goals: parsedAnswers.goals,
    work_challenges: parsedAnswers.challenges,
    coaching_style_preference: parsedAnswers.coachingStyle,
    recommended_coaches: recommendations,
    archetype: parsedAnswers.archetype,
  });

  if (clientId) {
    await supabase
      .from('profiles')
      .update({
        quiz_archetype: parsedAnswers.archetype,
        quiz_completed_at: new Date().toISOString(),
      })
      .eq('id', clientId);
  }
}

function parseQuizAnswers(answers: any[]): any {
  const goals: string[] = [];
  const challenges: string[] = [];
  let careerStage = '';
  let coachingStyle = '';

  answers.forEach((answer: any) => {
    const field = answer.field;

    switch (field.ref) {
      case 'career_stage':
        careerStage = answer.choice?.label?.toLowerCase() || '';
        break;
      case 'primary_goals':
        if (answer.choices) {
          goals.push(...answer.choices.labels);
        }
        break;
      case 'challenges':
        if (answer.choices) {
          challenges.push(...answer.choices.labels);
        }
        break;
      case 'coaching_style':
        coachingStyle = answer.choice?.label?.toLowerCase() || '';
        break;
    }
  });

  const archetype = determineArchetype(goals, challenges, careerStage);

  return { careerStage, goals, challenges, coachingStyle, archetype };
}

function determineArchetype(goals: string[], challenges: string[], stage: string): string {
  if (goals.includes('career change') || goals.includes('transition')) {
    return 'The Trailblazer';
  } else if (goals.includes('promotion') || goals.includes('leadership')) {
    return 'The Climber';
  } else if (goals.includes('salary') || goals.includes('negotiation')) {
    return 'The Negotiator';
  } else if (stage === 'executive' || stage === 'senior') {
    return 'The Strategist';
  } else {
    return 'The Explorer';
  }
}

async function calculateCoachMatches(answers: any): Promise<any[]> {
  const { data: coaches } = await supabase
    .from('coaches')
    .select(`
      id,
      specialties,
      years_experience,
      profile:profiles!coaches_id_fkey(full_name)
    `)
    .eq('is_approved', true);

  if (!coaches) return [];

  const scoredCoaches = coaches.map((coach) => {
    let score = 0;
    const reasons: string[] = [];

    // Career stage alignment (30%)
    if (answers.careerStage === 'senior' || answers.careerStage === 'executive') {
      if (coach.years_experience >= 10) {
        score += 30;
        reasons.push('Extensive experience with senior professionals');
      }
    } else {
      if (coach.years_experience >= 5) {
        score += 30;
        reasons.push('Proven track record');
      }
    }

    // Specialty alignment (40%)
    const matchingSpecialties = coach.specialties.filter((specialty: string) =>
      answers.goals.some((goal: string) =>
        specialty.toLowerCase().includes(goal.toLowerCase())
      )
    );

    if (matchingSpecialties.length > 0) {
      score += matchingSpecialties.length * 20;
      reasons.push(`Specializes in ${matchingSpecialties[0]}`);
    }

    // Challenge alignment (20%)
    const matchingChallenges = coach.specialties.filter((specialty: string) =>
      answers.challenges.some((challenge: string) =>
        specialty.toLowerCase().includes(challenge.toLowerCase())
      )
    );

    if (matchingChallenges.length > 0) {
      score += matchingChallenges.length * 10;
      reasons.push(`Helps with ${matchingChallenges[0]}`);
    }

    score += 10; // Baseline

    return {
      coach_id: coach.id,
      coach_name: coach.profile.full_name,
      match_score: Math.min(score, 100),
      reasons,
    };
  });

  return scoredCoaches
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, 5);
}
Email Automation System
typescript// /lib/emails/templates.ts
import { Resend } from 'resend';
import {
  BookingConfirmationEmail,
  Reminder24HourEmail,
  Reminder1HourEmail,
  PostSessionEmail,
} from '@/emails';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingConfirmation(data: {
  clientEmail: string;
  clientName: string;
  coachName: string;
  sessionDate: string;
  sessionTime: string;
  zoomLink: string;
}) {
  await resend.emails.send({
    from: 'SANDWINA <hello@sandwina.org>',
    to: data.clientEmail,
    subject: `Session Confirmed with ${data.coachName}`,
    react: BookingConfirmationEmail(data),
  });

  await logEmail({
    recipientEmail: data.clientEmail,
    emailType: 'booking_confirmation',
    subject: `Session Confirmed with ${data.coachName}`,
  });
}

export async function send24HourReminder(data: {
  clientEmail: string;
  clientName: string;
  coachName: string;
  sessionDate: string;
  sessionTime: string;
  zoomLink: string;
}) {
  await resend.emails.send({
    from: 'SANDWINA <hello@sandwina.org>',
    to: data.clientEmail,
    subject: `Reminder: Session tomorrow with ${data.coachName}`,
    react: Reminder24HourEmail(data),
  });

  await logEmail({
    recipientEmail: data.clientEmail,
    emailType: 'reminder_24h',
    subject: `Reminder: Session tomorrow with ${data.coachName}`,
  });
}

export async function send1HourReminder(data: {
  clientEmail: string;
  clientName: string;
  coachName: string;
  sessionTime: string;
  zoomLink: string;
}) {
  await resend.emails.send({
    from: 'SANDWINA <hello@sandwina.org>',
    to: data.clientEmail,
    subject: `Starting soon: Your session with ${data.coachName}`,
    react: Reminder1HourEmail(data),
  });

  await logEmail({
    recipientEmail: data.clientEmail,
    emailType: 'reminder_1h',
    subject: `Starting soon: Your session with ${data.coachName}`,
  });
}

async function logEmail(data: {
  recipientEmail: string;
  emailType: string;
  subject: string;
}) {
  await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/emails/log`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}
React Email Template
tsx// /emails/BookingConfirmation.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface BookingConfirmationEmailProps {
  clientName: string;
  coachName: string;
  sessionDate: string;
  sessionTime: string;
  zoomLink: string;
}

export function BookingConfirmationEmail({
  clientName,
  coachName,
  sessionDate,
  sessionTime,
  zoomLink,
}: BookingConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your session with {coachName} is confirmed!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Session Confirmed! 🎉</Heading>

          <Text style={text}>Hi {clientName},</Text>

          <Text style={text}>
            Great news! Your coaching session with {coachName} is all set.
          </Text>

          <Section style={detailsBox}>
            <Text style={detailLabel}>Date & Time</Text>
            <Text style={detailValue}>{sessionDate} at {sessionTime}</Text>

            <Text style={detailLabel}>Duration</Text>
            <Text style={detailValue}>45 minutes</Text>

            <Text style={detailLabel}>Coach</Text>
            <Text style={detailValue}>{coachName}</Text>
          </Section>

          <Section style={zoomSection}>
            <Text style={sectionTitle}>Join Your Session</Text>
            <Button style={zoomButton} href={zoomLink}>
              Join Zoom Meeting
            </Button>
            <Text style={smallText}>
              Click the button above or use this link: {zoomLink}
            </Text>
            <Text style={smallText}>
              💡 Pro tip: Test your link 5 minutes before to ensure everything works!
            </Text>
          </Section>

          <Text style={text}>
            We'll send you a reminder 24 hours before your session.
          </Text>

          <Text style={footer}>
            Need to reschedule? Reply to this email or contact us at hello@sandwina.org
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 24px',
  textAlign: 'center' as const,
};

const text = {
  color: '#4a5568',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
};

const detailsBox = {
  backgroundColor: '#f7fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
};

const detailLabel = {
  color: '#718096',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 4px',
  textTransform: 'uppercase' as const,
};

const detailValue = {
  color: '#1a1a1a',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px',
};

const zoomSection = {
  backgroundColor: '#4f46e5',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const sectionTitle = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  marginBottom: '16px',
};

const zoomButton = {
  backgroundColor: '#ffffff',
  color: '#4f46e5',
  borderRadius: '6px',
  padding: '14px 32px',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  display: 'inline-block',
};

const smallText = {
  color: '#ffffff',
  fontSize: '12px',
  marginTop: '8px',
  opacity: 0.9,
};

const footer = {
  color: '#718096',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '32px 0 0',
  textAlign: 'center' as const,
};
Automated Reminders (Cron Job)
typescript// /app/api/cron/send-reminders/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { send24HourReminder, send1HourReminder } from '@/lib/emails/templates';
import { addHours, format } from 'date-fns';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await send24HourReminders();
    await send1HourReminders();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ error: 'Failed to send reminders' }, { status: 500 });
  }
}

async function send24HourReminders() {
  const now = new Date();
  const in23Hours = addHours(now, 23);
  const in25Hours = addHours(now, 25);

  const { data: sessions } = await supabase
    .from('sessions')
    .select(`
      *,
      client:profiles!sessions_client_id_fkey(full_name, email),
      coach:coaches!sessions_coach_id_fkey(
        profile:profiles!coaches_id_fkey(full_name)
      )
    `)
    .eq('status', 'scheduled')
    .eq('reminder_24h_sent', false)
    .gte('scheduled_at', in23Hours.toISOString())
    .lte('scheduled_at', in25Hours.toISOString());

  if (!sessions || sessions.length === 0) return;

  for (const session of sessions) {
    try {
      await send24HourReminder({
        clientEmail: session.client.email,
        clientName: session.client.full_name,
        coachName: session.coach.profile.full_name,
        sessionDate: format(new Date(session.scheduled_at), 'MMMM d, yyyy'),
        sessionTime: format(new Date(session.scheduled_at), 'h:mm a'),
        zoomLink: session.zoom_meeting_link,
      });

      await supabase
        .from('sessions')
        .update({ reminder_24h_sent: true })
        .eq('id', session.id);

      console.log(`✅ 24h reminder sent for session ${session.id}`);
    } catch (error) {
      console.error(`❌ Failed to send 24h reminder for session ${session.id}:`, error);
    }
  }
}

async function send1HourReminders() {
  const now = new Date();
  const in50Mins = addHours(now, 50 / 60);
  const in70Mins = addHours(now, 70 / 60);

  const { data: sessions } = await supabase
    .from('sessions')
    .select(`
      *,
      client:profiles!sessions_client_id_fkey(full_name, email),
      coach:coaches!sessions_coach_id_fkey(
        profile:profiles!coaches_id_fkey(full_name)
      )
    `)
    .eq('status', 'scheduled')
    .eq('reminder_1h_sent', false)
    .gte('scheduled_at', in50Mins.toISOString())
    .lte('scheduled_at', in70Mins.toISOString());

  if (!sessions || sessions.length === 0) return;

  for (const session of sessions) {
    try {
      await send1HourReminder({
        clientEmail: session.client.email,
        clientName: session.client.full_name,
        coachName: session.coach.profile.full_name,
        sessionTime: format(new Date(session.scheduled_at), 'h:mm a'),
        zoomLink: session.zoom_meeting_link,
      });

      await supabase
        .from('sessions')
        .update({ reminder_1h_sent: true })
        .eq('id', session.id);

      console.log(`✅ 1h reminder sent for session ${session.id}`);
    } catch (error) {
      console.error(`❌ Failed to send 1h reminder for session ${session.id}:`, error);
    }
  }
}
Acceptance Criteria

 Typeform quiz embedded on website
 Quiz responses captured via webhook
 Coach matching algorithm calculates scores correctly
 Quiz results page displays top 5 recommendations
 Booking confirmation emails sent immediately with Zoom link
 24-hour reminders sent automatically
 1-hour reminders sent automatically
 All emails are mobile-responsive
 Email logs stored in database


SPRINT 6 (Weeks 11-12): Resource Library, Progress Tracking & Launch
User Stories
US-6.1: As an admin, I can upload resources (PDFs, videos)
US-6.2: As a client, I can browse and search resources
US-6.3: As a client, I can download/view resources
US-6.4: As a client, I can set career goals and track progress
US-6.5: As a coach, I can add progress notes for clients
US-6.6: As a client, I can view progress dashboard
US-6.7: All features tested and production-ready
Resource Library - Admin Upload
tsx// /app/dashboard/admin/resources/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Upload, FileText } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const CATEGORIES = [
  'job_search',
  'negotiation',
  'interview_prep',
  'leadership',
  'resume',
  'networking',
];

export default function ResourcesAdminPage() {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const supabase = createClientComponentClient();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'job_search',
    resource_type: 'pdf',
    tags: '',
    is_premium: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file');
      return;
    }

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `resources/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('resources')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resources')
        .getPublicUrl(filePath);

      // Create resource record
      const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t);

      const { error: dbError } = await supabase.from('resources').insert({
        title: formData.title,
        description: formData.description,
        resource_type: formData.resource_type,
        file_url: publicUrl,
        file_size_bytes: file.size,
        category: formData.category,
        tags: tagsArray,
        is_premium: formData.is_premium,
        uploaded_by: user?.id,
      });

      if (dbError) throw dbError;

      alert('Resource uploaded successfully!');

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'job_search',
        resource_type: 'pdf',
        tags: '',
        is_premium: false,
      });
      setFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload resource');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container max-w-3xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Upload Resource</h1>

      <Card>
        <CardHeader>
          <CardTitle>Resource Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="resource_type">Type *</Label>
                <Select
                  value={formData.resource_type}
                  onValueChange={(value) => setFormData({ ...formData, resource_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="template">Template</SelectItem>
                    <SelectItem value="checklist">Checklist</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.replace(/_/g, ' ').toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g., resume, cover letter, templates"
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label htmlFor="is_premium" className="font-semibold">Premium Resource</Label>
                <p className="text-sm text-muted-foreground">
                  Only accessible to monthly members
                </p>
              </div>
              <Switch
                id="is_premium"
                checked={formData.is_premium}
                onCheckedChange={(checked) => setFormData({ ...formData, is_premium: checked })}
              />
            </div>

            <div>
              <Label htmlFor="file">File *</Label>
              <Input
                id="file"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                accept=".pdf,.doc,.docx,.mp4,.mov"
                required
                className="mt-2"
              />
              {file && (
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>{file.name}</span>
                  <span>({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              )}
            </div>

            <Button type="submit" disabled={uploading} className="w-full">
              {uploading ? 'Uploading...' : 'Upload Resource'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
Resource Library - Client View
tsx// /app/resources/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { ResourceCard } from '@/components/resources/ResourceCard';

export default async function ResourcesPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  // Check premium access
  const { data: membership } = user
    ? await supabase
        .from('packages')
        .select('package_type')
        .eq('client_id', user.id)
        .eq('is_active', true)
        .in('package_type', ['monthly_standard', 'monthly_premium'])
        .single()
    : { data: null };

  const hasPremiumAccess = !!membership;

  let query = supabase
    .from('resources')
    .select('*')
    .order('created_at', { ascending: false });

  if (!hasPremiumAccess) {
    query = query.eq('is_premium', false);
  }

  const { data: resources } = await query;

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Resource Library</h1>
        <p className="text-xl text-muted-foreground">
          Templates, guides, and tools to accelerate your career
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
        {resources?.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            hasPremiumAccess={hasPremiumAccess}
          />
        ))}
      </div>
    </div>
  );
}
Progress Tracking - Client Dashboard
tsx// /app/dashboard/progress/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { GoalsList } from '@/components/progress/GoalsList';
import { ProgressChart } from '@/components/progress/ProgressChart';
import { RecentCheckIns } from '@/components/progress/RecentCheckIns';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default async function ProgressPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  const { data: goals } = await supabase
    .from('client_goals')
    .select(`
      *,
      milestones(*),
      coach:coaches(profile:profiles!coaches_id_fkey(full_name))
    `)
    .eq('client_id', user?.id)
    .order('created_at', { ascending: false });

  const { data: checkIns } = await supabase
    .from('progress_checkins')
    .select(`
      *,
      coach:coaches(profile:profiles!coaches_id_fkey(full_name))
    `)
    .eq('client_id', user?.id)
    .order('checkin_date', { ascending: false })
    .limit(5);

  return (
    <div className="container mx-auto py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Progress Tracking</h1>
          <p className="text-muted-foreground">
            Track your career goals and celebrate your wins
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/progress/new-goal">
            <Plus className="mr-2 h-4 w-4" />
            New Goal
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <GoalsList goals={goals} />
        </div>

        <div className="space-y-6">
          <ProgressChart goals={goals} />
          <RecentCheckIns checkIns={checkIns} />
        </div>
      </div>
    </div>
  );
}
Acceptance Criteria

 Admin can upload resources with metadata
 Resources stored in Supabase Storage
 Client can browse and search resources
 Premium resources gated for members
 Resource downloads tracked
 Client can create career goals
 Goals support milestones and progress tracking
 Coach can add progress notes
 Client can view progress dashboard
 All E2E tests pass
 Platform achieves >90 Lighthouse score
 Zero critical bugs at launch


API ENDPOINTS
Authentication
POST   /api/auth/signup            - Create new user
POST   /api/auth/login             - Sign in user
POST   /api/auth/logout            - Sign out user
POST   /api/auth/reset-password    - Reset password
Coaches
GET    /api/coaches                - List approved coaches
GET    /api/coaches/[id]           - Get coach details
GET    /api/coaches/[id]/availability?date=YYYY-MM-DD - Get available slots
POST   /api/coaches/apply          - Submit application
PUT    /api/coaches/[id]           - Update profile
POST   /api/coaches/[id]/approve   - Approve coach (admin)
Bookings
POST   /api/checkout               - Create Stripe checkout
GET    /api/sessions               - List sessions
GET    /api/sessions/[id]          - Get session details
POST   /api/sessions/[id]/complete - Mark complete
POST   /api/sessions/[id]/cancel   - Cancel session
PUT    /api/sessions/[id]/notes    - Add notes
Progress
GET    /api/progress/goals         - List goals
POST   /api/progress/goals         - Create goal
PUT    /api/progress/goals/[id]    - Update goal
POST   /api/progress/checkins      - Add check-in
POST   /api/progress/reflections   - Add reflection
Resources
GET    /api/resources              - List resources
GET    /api/resources/[id]         - Get resource
POST   /api/resources              - Upload (admin)
POST   /api/resources/[id]/track   - Track access
Payments
POST   /api/stripe/connect/onboard - Stripe Connect link
GET    /api/transactions           - List transactions
Webhooks
POST   /api/webhooks/stripe        - Stripe payments
POST   /api/webhooks/typeform      - Quiz responses
Cron Jobs
GET    /api/cron/send-reminders    - Email reminders
GET    /api/cron/check-zoom-links  - Verify Zoom links
GET    /api/cron/re-engagement     - Re-engagement emails

COMPONENT SPECIFICATIONS
Reusable UI Components (shadcn/ui)
/components/ui/
├── button.tsx              - Button variants
├── card.tsx                - Card container
├── input.tsx               - Form input
├── textarea.tsx            - Multi-line input
├── select.tsx              - Dropdown
├── checkbox.tsx            - Checkbox
├── radio-group.tsx         - Radio buttons
├── switch.tsx              - Toggle switch
├── badge.tsx               - Status badge
├── avatar.tsx              - User avatar
├── calendar.tsx            - Date picker
├── progress.tsx            - Progress bar
├── dialog.tsx              - Modal
└── toast.tsx               - Notifications
Feature Components
/components/
├── auth/
│   ├── SignUpForm.tsx
│   ├── SignInForm.tsx
│   └── ResetPasswordForm.tsx
│
├── coaches/
│   ├── CoachCard.tsx
│   ├── CoachHeader.tsx
│   └── CoachFilters.tsx
│
├── booking/
│   ├── AvailabilityCalendar.tsx
│   ├── BookingPanel.tsx
│   └── PackageSelector.tsx
│
├── progress/
│   ├── GoalsList.tsx
│   ├── ProgressChart.tsx
│   └── MilestoneTracker.tsx
│
├── resources/
│   ├── ResourceCard.tsx
│   └── ResourceFilters.tsx
│
├── quiz/
│   ├── QuizEmbed.tsx
│   └── CoachRecommendationCard.tsx
│
└── dashboard/
    ├── UpcomingSessions.tsx
    ├── ProgressOverview.tsx
    └── EarningsOverview.tsx

THIRD-PARTY INTEGRATIONS
Stripe
Purpose: Payment processing and marketplace payouts
Setup:

Create Stripe account
Enable Stripe Connect (Express accounts)
Configure webhooks for production URL
Test with Stripe CLI locally

Events to handle:

checkout.session.completed
payment_intent.succeeded
payment_intent.payment_failed
transfer.created

Typeform
Purpose: LiftMatcher® quiz
Setup:

Create Typeform account
Build quiz form
Configure webhook to /api/webhooks/typeform
Store form ID in environment

Resend
Purpose: Transactional email delivery
Setup:

Create Resend account
Verify domain (sandwina.org)
Add API key to environment
Build React Email templates

Email types:

Booking confirmations
Session reminders
Post-session follow-ups
Re-engagement campaigns

Supabase
Purpose: Database, auth, storage, real-time
Setup:

Create Supabase project
Run schema migrations
Configure RLS policies
Create storage buckets

Storage buckets:

resources - Public bucket for resources
avatars - Public bucket for profile photos


SECURITY REQUIREMENTS
Authentication

JWT tokens in HTTP-only cookies
Session duration: 7 days
Password requirements: Min 8 chars, 1 uppercase, 1 number
Failed login lockout: 5 attempts = 15 min lock
Google OAuth via Supabase Auth

Authorization

Row Level Security (RLS) at database level
Role-based access control (client, coach, admin)
Coaches only access their clients
Clients only access their data

Data Protection

All data encrypted at rest (Supabase)
All connections use HTTPS/TLS
PCI DSS compliance via Stripe
GDPR compliant
Daily automated backups

API Security

Rate limiting: 100 req/min per IP
CORS configured for sandwina.org
Webhook signature verification
No sensitive data in logs


TESTING REQUIREMENTS
Unit Tests (Vitest)
typescript// /tests/unit/zoom-validation.test.ts
import { describe, it, expect } from 'vitest';
import { isValidZoomLink } from '@/lib/zoom/validation';

describe('Zoom Validation', () => {
  it('validates standard Zoom links', () => {
    expect(isValidZoomLink('https://zoom.us/j/1234567890')).toBe(true);
  });

  it('rejects invalid links', () => {
    expect(isValidZoomLink('https://google.com')).toBe(false);
  });
});
E2E Tests (Playwright)
typescript// /tests/e2e/booking-flow.spec.ts
import { test, expect } from '@playwright/test';

test('complete booking flow', async ({ page }) => {
  await page.goto('/coaches');
  await page.click('[data-testid="coach-card"]:first-child');
  await page.click('[data-testid="calendar-date"]');
  await page.click('[data-testid="time-slot"]:first-child');
  await page.click('[data-testid="package-6pack"]');
  await page.click('[data-testid="checkout-button"]');
  await expect(page).toHaveURL(/checkout\.stripe\.com/);
});

DEPLOYMENT PLAN
Pre-Deployment Checklist
markdown## Environment Setup
- [ ] Vercel Pro account configured
- [ ] Supabase Pro project configured
- [ ] Domain (sandwina.org) configured
- [ ] SSL certificate active
- [ ] All environment variables set

## Third-Party Services
- [ ] Stripe live mode API keys
- [ ] Stripe webhooks configured
- [ ] Resend domain verified
- [ ] Typeform webhook configured

## Database
- [ ] All migrations applied
- [ ] RLS policies tested
- [ ] Indexes created
- [ ] Backup strategy configured

## Testing
- [ ] All unit tests passing
- [ ] All E2E tests passing
- [ ] Manual QA completed
- [ ] Cross-browser testing done
- [ ] Mobile testing done
- [ ] Performance testing passed

## Content
- [ ] Coach profiles ready
- [ ] Resources uploaded
- [ ] Email templates reviewed
- [ ] Legal pages finalized

## Monitoring
- [ ] Sentry configured
- [ ] Vercel Analytics enabled
- [ ] Uptime monitoring configured
Deployment Steps
Launch Day (Friday, 6pm CT):

5:00 PM - Final checks

Run all tests
Verify staging = production config


5:30 PM - Switch Stripe to live

Update API keys in Vercel
Update webhook endpoints


5:45 PM - Deploy to production

Merge to main
Vercel auto-deploys


6:00 PM - DNS cutover

Update DNS A record
Wait for propagation


6:15 PM - Verification

Test sandwina.org loads
Test signup/login
Test booking flow
Test payment
Test emails


6:30 PM - Monitoring

Watch Sentry for errors
Monitor Vercel logs


7:00 PM - Announce launch

Email SANDWINA team




CONCLUSION
This PRD provides a complete blueprint for building the SANDWINA Enhanced Core MVP platform in 12 weeks using Claude Code.
Key Innovations
1. Zero Zoom Costs

Coaches use free Zoom accounts
Default link set during onboarding
Automatic application to bookings
Automated checks ensure no missing links

2. Scalable Architecture

Works for 10-1,000 coaches
Near-zero marginal costs
Network effects compound growth
Automated operations

3. Exceptional UX

Consumer-grade quality
Minimal friction
Professional experience
Mobile-first design

4. Complete Automation

Bookings → automatic
Payments → automatic
Emails → automatic
Payouts → automatic
Reminders → automatic

Development Timeline

Weeks 1-2: Foundation & Auth
Weeks 3-4: Dashboards & Profiles + Zoom Setup
Weeks 5-6: Booking System (with Zoom integration)
Weeks 7-8: Payments & Stripe Connect
Weeks 9-10: Quiz & Email Automation
Weeks 11-12: Resources, Progress Tracking & Launch

Success Criteria
Technical:

Platform uptime: >99.9%
Page load: <2 seconds
Lighthouse score: >90
Zero critical bugs

Business:

10+ coaches week 1
50+ bookings month 1


15% booking conversion


Revenue from day 1

User Experience:

Coach onboarding: >90% completion
Client onboarding: >80% completion
Zoom link issues: <1% of sessions
Support tickets: <24hr resolution

Budget

Development: $28,525
Infrastructure: $780/month
Total MVP: $29,305


Ready to build. Ready to launch. Ready to lift women. 💪

End of Product Requirements Document
Version 1.0 - October 6, 2025
For Claude Code Development"
$$
