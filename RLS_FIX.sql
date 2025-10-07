-- =====================================================
-- FIX: Row Level Security Policies for User Signups
-- =====================================================
--
-- Problem: New user signups were failing with:
-- "new row violates row-level security policy for table 'profiles'"
--
-- Root Cause: Missing INSERT policies for profiles and coaches tables
--
-- Solution: Add INSERT policies to allow users to create their own records
--
-- How to use:
-- 1. Go to Supabase Dashboard → SQL Editor
-- 2. Copy and paste this entire file
-- 3. Click "Run" to execute
-- 4. Test signup again - it should work!
--
-- =====================================================

-- Allow authenticated users to INSERT their own profile during signup
CREATE POLICY "Users can insert own profile on signup"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Allow new coaches to INSERT their coach record during signup
CREATE POLICY "New coaches can create coach profile"
ON coaches FOR INSERT
WITH CHECK (auth.uid() = id);

-- Success message
SELECT 'RLS policies updated successfully! User signups should now work.' AS status;
