# 🔧 SANDWINA Authentication Fix Guide

**Complete solution for RLS errors and Google OAuth sync issues**

---

## 🎯 **What This Fixes**

1. ✅ **RLS Policy Error**: "new row violates row-level security policy for table 'profiles'"
2. ✅ **Google OAuth Not Syncing**: Users created in Auth but not in database tables
3. ✅ **Email Confirmation**: Proper email confirmation workflow
4. ✅ **Automatic Profile Creation**: All signups (email + Google) create profiles automatically

---

## 📋 **Step 1: Run the Complete Fix SQL**

### **In Supabase Dashboard:**

1. Go to **SQL Editor** → **New Query**
2. Copy and paste the entire contents of `RLS_COMPLETE_FIX.sql`
3. Click **"Run"**

This script will:
- Fix RLS policy conflicts (drops and recreates policies)
- Add database trigger for automatic profile creation
- Set up proper INSERT permissions
- Enable automatic coach record creation for coach signups

---

## 📧 **Step 2: Configure Email Settings**

### **Disable Email Confirmation** (for testing):

1. In Supabase Dashboard, go to **Authentication** → **Settings**
2. Scroll to **Email Auth**
3. **Disable** "Enable email confirmations"
4. Click **Save**

This allows immediate testing without email verification.

### **For Production** (enable later):

1. **Enable** "Enable email confirmations"
2. Configure custom **SMTP settings** (optional):
   - Settings → Auth → SMTP Settings
   - Add your SendGrid/Mailgun/etc credentials
3. Customize **Email Templates**:
   - Settings → Auth → Email Templates
   - Edit "Confirm signup" template with SANDWINA branding

---

## 🔑 **Step 3: Verify Google OAuth Setup**

1. Go to **Authentication** → **Providers**
2. Find **Google** provider
3. Ensure these are configured:
   - **Enabled**: ✅ Yes
   - **Client ID**: (from Google Cloud Console)
   - **Client Secret**: (from Google Cloud Console)
4. **Redirect URLs** should include:
   ```
   https://YOUR-PROJECT.supabase.co/auth/v1/callback
   http://localhost:3000/auth/callback (for local testing)
   ```

---

## ⚙️ **Step 4: Update Environment Variables**

Ensure your `.env.local` has:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_SIGNUP_KEY=sandwina-admin-2025
```

---

## 🧪 **Step 5: Test the Flow**

### **Test Email/Password Signup:**

1. Go to `http://localhost:3000/signup`
2. Click **"Sign Up as Client"**
3. Fill in form and submit
4. Check Supabase:
   - **Authentication** → **Users** (should show new user)
   - **Table Editor** → **profiles** (should have profile record)
5. Log in and verify dashboard access

### **Test Google OAuth Signup:**

1. Go to `http://localhost:3000/signup`
2. Click **"Sign Up as Client"**
3. Click **"Continue with Google"**
4. Authorize with Google
5. Check Supabase:
   - **Authentication** → **Users** (should show new user with Google provider)
   - **Table Editor** → **profiles** (should have profile record with avatar_url)
6. Verify dashboard access

### **Test Coach Signup:**

1. Go to `http://localhost:3000/signup`
2. Click **"Apply as Coach"**
3. Complete signup (email or Google)
4. Check Supabase:
   - **Table Editor** → **profiles** (role should be 'coach')
   - **Table Editor** → **coaches** (should have coach record with is_approved=false)
5. Should redirect to `/dashboard/coach/onboarding`

---

## 🔍 **How It Works Now**

### **The Database Trigger (Automatic Profile Creation):**

```sql
-- Trigger function runs AFTER every auth.users INSERT
CREATE FUNCTION handle_new_user() RETURNS TRIGGER AS $$
BEGIN
  -- Automatically creates profile from user_metadata
  INSERT INTO profiles (id, email, full_name, role, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    user_metadata->>'full_name' OR user_metadata->>'name',
    user_metadata->>'role' OR 'client',
    user_metadata->>'avatar_url' OR user_metadata->>'picture'
  );

  -- If role='coach', auto-create coach record
  IF user_metadata->>'role' = 'coach' THEN
    INSERT INTO coaches (id, is_approved) VALUES (NEW.id, FALSE);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### **Signup Flow:**

1. **User submits form** → App calls `supabase.auth.signUp()` with metadata
2. **Supabase Auth creates user** in `auth.users` table
3. **Trigger fires automatically** → Creates profile in `profiles` table
4. **If coach** → Trigger also creates record in `coaches` table
5. **User redirected** → Appropriate dashboard based on role

### **Google OAuth Flow:**

1. **User clicks "Continue with Google"** → App calls `signUpWithGoogle(role)`
2. **Google OAuth completes** → Callback receives code
3. **Callback exchanges code** → Gets session with user_metadata
4. **If new user** → Trigger creates profile automatically
5. **Redirect to dashboard** → Role-based routing

---

## ✅ **Verification Checklist**

After running the fix, verify:

- [ ] `RLS_COMPLETE_FIX.sql` executed successfully in Supabase
- [ ] Email confirmation disabled (for testing)
- [ ] Google OAuth provider enabled and configured
- [ ] `.env.local` has all required variables
- [ ] Email/password signup creates profile in database
- [ ] Google OAuth signup creates profile in database
- [ ] Coach signups create both profile AND coach records
- [ ] Users can log in and access dashboards
- [ ] No RLS errors in browser console

---

## 🐛 **Troubleshooting**

### **Still getting RLS errors:**

1. Verify trigger exists:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```

2. Check policies:
   ```sql
   SELECT * FROM pg_policies WHERE tablename IN ('profiles', 'coaches');
   ```

3. Try dropping and recreating trigger:
   ```sql
   DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
   -- Then re-run RLS_COMPLETE_FIX.sql
   ```

### **Google OAuth not creating profiles:**

1. Check if user_metadata is being saved:
   - Supabase → Authentication → Users
   - Click user → Check "Raw User Meta Data"
   - Should see: `{"role": "client", "full_name": "..."}`

2. Verify trigger function has SECURITY DEFINER:
   ```sql
   ALTER FUNCTION handle_new_user() SECURITY DEFINER;
   ```

### **Email confirmation stuck:**

1. Disable email confirmation temporarily:
   - Settings → Auth → Email Auth
   - Disable "Enable email confirmations"

2. For confirmed emails, check:
   - Supabase → Authentication → Users
   - Look for "Confirmed At" timestamp

---

## 📝 **Code Changes Made**

### **Updated Files:**

1. **`lib/auth.ts`**
   - Removed manual profile INSERT
   - Now relies on database trigger
   - Prevents RLS errors

2. **`app/auth/callback/route.ts`**
   - Removed manual profile INSERT for OAuth
   - Added small delay for trigger completion
   - Simplified flow

3. **`RLS_COMPLETE_FIX.sql`** (NEW)
   - Complete database fix
   - Creates trigger + policies

---

## 🚀 **Next Steps**

Once authentication is working:

1. **Test all signup flows** (client, coach, admin)
2. **Test Google OAuth** for all roles
3. **Enable email confirmation** for production
4. **Customize email templates** with SANDWINA branding
5. **Proceed to Sprint 2** (Dashboards & Profiles)

---

## 📞 **Support**

If issues persist:
1. Check Supabase logs: Dashboard → Logs → Postgres Logs
2. Check browser console for errors
3. Verify all SQL commands executed successfully
4. Test with a fresh Supabase project if needed

**✅ Authentication should now work perfectly for both email/password and Google OAuth signups!**
