# SANDWINA Supabase Database Setup Guide

**Complete step-by-step instructions for setting up your Supabase database**

---

## ✅ **Prerequisites**

- [ ] Supabase account created ([supabase.com](https://supabase.com))
- [ ] SANDWINA project repository cloned
- [ ] `.env.local` file ready

---

## 🚀 **Step 1: Create Supabase Project**

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in:
   - **Name**: `sandwina-marketplace`
   - **Database Password**: (generate strong password - save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free (or Pro for production)
4. Click **"Create new project"**
5. Wait 2-3 minutes for setup

---

## 🔑 **Step 2: Get API Keys**

1. In your Supabase project, go to **Settings** → **API**
2. Copy these values:

```
Project URL: https://xxxxx.supabase.co
anon/public key: eyJhbG...
service_role key: eyJhbG... (keep secret!)
```

3. Add to your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG... (backend only!)
```

---

## 📊 **Step 3: Run Database Schema**

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy the complete SQL schema from `PRD.md` (lines 200-500)
4. Or use the schema below
5. Click **"Run"**

### **Complete Database Schema** (Copy this entire block)

```sql
-- =====================================================
-- SANDWINA MARKETPLACE DATABASE SCHEMA
-- Version: 1.0
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLES
-- =====================================================

-- Profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('client', 'coach', 'admin')) DEFAULT 'client',
  quiz_archetype TEXT,
  quiz_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coaches
CREATE TABLE coaches (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  bio TEXT,
  tagline TEXT,
  specialties TEXT[] DEFAULT ARRAY[]::TEXT[],
  years_experience INT,
  hourly_rate DECIMAL(10,2) DEFAULT 150.00,
  is_approved BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  default_zoom_link TEXT,
  linkedin_url TEXT,
  website_url TEXT,
  stripe_connect_account_id TEXT UNIQUE,
  stripe_onboarding_complete BOOLEAN DEFAULT FALSE,
  certification_type TEXT,
  certification_org TEXT,
  industries TEXT[] DEFAULT ARRAY[]::TEXT[],
  languages TEXT[] DEFAULT ARRAY['English']::TEXT[],
  timezone TEXT DEFAULT 'America/Chicago',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Availability Slots
CREATE TABLE availability_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id UUID NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_recurring BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blocked Time
CREATE TABLE blocked_time (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id UUID NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Packages
CREATE TABLE packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coach_id UUID NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  package_type TEXT NOT NULL CHECK (package_type IN ('single', '3pack', '6pack', '12pack', 'monthly_standard', 'monthly_premium')),
  total_sessions INT NOT NULL,
  sessions_used INT DEFAULT 0,
  amount_paid DECIMAL(10,2) NOT NULL,
  stripe_payment_intent_id TEXT,
  purchase_date TIMESTAMPTZ DEFAULT NOW(),
  expiration_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coach_id UUID NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  package_id UUID REFERENCES packages(id) ON DELETE SET NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INT DEFAULT 45,
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')) DEFAULT 'scheduled',
  zoom_meeting_link TEXT,
  zoom_meeting_id TEXT,
  coach_notes TEXT,
  client_notes TEXT,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  reminder_24h_sent BOOLEAN DEFAULT FALSE,
  reminder_1h_sent BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coach_id UUID NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  package_id UUID REFERENCES packages(id) ON DELETE SET NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('package', 'single_session', 'membership', 'refund')),
  amount_total DECIMAL(10,2) NOT NULL,
  stripe_fee DECIMAL(10,2) DEFAULT 0,
  platform_fee DECIMAL(10,2) DEFAULT 0,
  coach_payout DECIMAL(10,2) DEFAULT 0,
  stripe_payment_intent_id TEXT,
  stripe_transfer_id TEXT,
  payout_status TEXT CHECK (payout_status IN ('pending', 'paid', 'failed')) DEFAULT 'pending',
  payout_date TIMESTAMPTZ,
  status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client Goals
CREATE TABLE client_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coach_id UUID REFERENCES coaches(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('salary', 'promotion', 'career_change', 'skill_development', 'work_life_balance', 'leadership')),
  target_date DATE,
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed', 'abandoned')) DEFAULT 'not_started',
  progress_percentage INT DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Goal Milestones
CREATE TABLE goal_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  goal_id UUID NOT NULL REFERENCES client_goals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_date DATE,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progress Check-ins
CREATE TABLE progress_checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coach_id UUID REFERENCES coaches(id) ON DELETE SET NULL,
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  checkin_date DATE NOT NULL,
  mood_rating INT CHECK (mood_rating BETWEEN 1 AND 5),
  wins TEXT,
  challenges TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz Results
CREATE TABLE quiz_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  typeform_response_id TEXT UNIQUE,
  responses JSONB,
  career_stage TEXT,
  primary_goals TEXT[],
  work_challenges TEXT[],
  coaching_style_preference TEXT,
  recommended_coaches JSONB,
  archetype TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resources
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT CHECK (resource_type IN ('pdf', 'video', 'template', 'checklist', 'article')),
  file_url TEXT,
  file_size_bytes BIGINT,
  category TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  access_level TEXT CHECK (access_level IN ('all', 'clients_only', 'members_only')) DEFAULT 'clients_only',
  is_premium BOOLEAN DEFAULT FALSE,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  download_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resource Access Log
CREATE TABLE resource_access_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  access_type TEXT CHECK (access_type IN ('view', 'download')),
  accessed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email Logs
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_email TEXT NOT NULL,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email_type TEXT NOT NULL,
  subject TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT CHECK (status IN ('sent', 'failed', 'bounced')) DEFAULT 'sent',
  provider_message_id TEXT
);

-- Email Templates (admin-editable)
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  variables JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Log (audit trail)
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_coaches_approved ON coaches(is_approved);
CREATE INDEX idx_availability_coach_day ON availability_slots(coach_id, day_of_week);
CREATE INDEX idx_sessions_client ON sessions(client_id);
CREATE INDEX idx_sessions_coach ON sessions(coach_id);
CREATE INDEX idx_sessions_scheduled_at ON sessions(scheduled_at);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_transactions_client ON transactions(client_id);
CREATE INDEX idx_transactions_coach ON transactions(coach_id);
CREATE INDEX idx_client_goals_client ON client_goals(client_id);
CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_email_logs_recipient ON email_logs(recipient_email);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_time ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_access_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile on signup" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Coaches
CREATE POLICY "Public can view approved coaches" ON coaches FOR SELECT USING (is_approved = TRUE);
CREATE POLICY "Coaches can update own profile" ON coaches FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "New coaches can create coach profile" ON coaches FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can manage coaches" ON coaches FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Sessions
CREATE POLICY "Clients can view own sessions" ON sessions FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "Coaches can view their sessions" ON sessions FOR SELECT USING (auth.uid() = coach_id);
CREATE POLICY "Coaches can update their session notes" ON sessions FOR UPDATE USING (auth.uid() = coach_id);

-- Resources
CREATE POLICY "Users can view accessible resources" ON resources FOR SELECT USING (
  access_level = 'all' OR
  (access_level = 'clients_only' AND auth.uid() IS NOT NULL) OR
  (access_level = 'members_only' AND EXISTS (
    SELECT 1 FROM packages WHERE client_id = auth.uid() AND is_active = TRUE
  ))
);

-- Transactions
CREATE POLICY "Clients can view own transactions" ON transactions FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "Coaches can view their transactions" ON transactions FOR SELECT USING (auth.uid() = coach_id);

-- =====================================================
-- TRIGGERS
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coaches_updated_at BEFORE UPDATE ON coaches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Increment sessions_used when completed
CREATE OR REPLACE FUNCTION increment_package_usage()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' AND NEW.package_id IS NOT NULL THEN
    UPDATE packages SET sessions_used = sessions_used + 1 WHERE id = NEW.package_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_package_on_session_complete
  AFTER UPDATE ON sessions
  FOR EACH ROW EXECUTE FUNCTION increment_package_usage();

-- =====================================================
-- SEED DATA (Optional)
-- =====================================================

-- Email Templates
INSERT INTO email_templates (template_key, name, subject, body_html, variables) VALUES
('booking_confirmation', 'Booking Confirmation', 'Session Confirmed with {{coach_name}}', '<h1>Your session is confirmed!</h1>', '["coach_name", "client_name", "session_date", "zoom_link"]'::jsonb),
('reminder_24h', '24-Hour Reminder', 'Reminder: Session tomorrow with {{coach_name}}', '<h1>Your session is tomorrow!</h1>', '["coach_name", "session_date", "zoom_link"]'::jsonb),
('reminder_1h', '1-Hour Reminder', 'Starting soon: Your session with {{coach_name}}', '<h1>Your session starts in 1 hour!</h1>', '["coach_name", "session_time", "zoom_link"]'::jsonb);

-- Success message
SELECT 'Database schema created successfully!' AS status;
```

---

## 🪣 **Step 4: Create Storage Buckets**

1. Go to **Storage** in Supabase Dashboard
2. Click **"New Bucket"**

### **Bucket 1: Resources**
- **Name**: `resources`
- **Public**: ✅ Yes
- **File size limit**: 50MB
- **Allowed MIME types**: `application/pdf,video/*,image/*`

### **Bucket 2: Avatars**
- **Name**: `avatars`
- **Public**: ✅ Yes
- **File size limit**: 2MB
- **Allowed MIME types**: `image/jpeg,image/png,image/webp`

---

## 🔐 **Step 5: Configure Authentication**

1. Go to **Authentication** → **Providers**
2. Enable **Email** (already enabled)
3. Enable **Google OAuth**:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://xxxxx.supabase.co/auth/v1/callback`
   - Copy Client ID & Secret
   - Paste into Supabase Google provider settings
   - Click **Save**

4. Configure Email Templates (optional):
   - Go to **Authentication** → **Email Templates**
   - Customize confirmation, reset password emails

---

## ✅ **Step 6: Verify Setup**

Run these queries in SQL Editor to verify:

```sql
-- Check tables
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Should return 20+ tables

-- Check RLS policies
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public';

-- Should return 10+ policies
```

---

## 🧪 **Step 7: Test Connection**

In your Next.js app:

```bash
npm run dev
```

Go to: `http://localhost:3000/signup/client`

Try creating an account. If successful, check Supabase:
- **Authentication** → **Users** (should show new user)
- **Table Editor** → **profiles** (should show profile record)

---

## 🚨 **Troubleshooting**

### **Error: relation "profiles" does not exist**
- Run the SQL schema again
- Make sure you're in the correct project

### **Error: RLS policy violation**
- Check RLS policies are created
- Verify user is authenticated

### **Email confirmation not sending**
- Check Authentication → Settings → Email Auth → Confirm email = OFF (for development)
- For production, set up SMTP in Authentication → Settings

---

## 📊 **Next Steps**

After database setup:

1. ✅ Update `.env.local` with Supabase keys
2. ✅ Restart dev server
3. ✅ Test signup/login flows
4. ✅ Move to Sprint 2 (Dashboards)

---

## 🔒 **Security Checklist**

- [ ] Service role key is ONLY in `.env.local` (not committed)
- [ ] RLS policies enabled on all tables
- [ ] Storage buckets have proper access rules
- [ ] OAuth redirect URLs configured correctly
- [ ] Email confirmation enabled in production

---

**Database setup complete! Ready for Sprint 2.** 🎉
