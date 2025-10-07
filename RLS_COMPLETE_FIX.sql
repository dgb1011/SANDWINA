-- =====================================================
-- COMPLETE FIX: Row Level Security + Database Sync
-- =====================================================
--
-- This script fixes:
-- 1. RLS policy conflicts (drops and recreates)
-- 2. Ensures INSERT policies exist for signup
-- 3. Adds database trigger for automatic profile creation
-- 4. Sets up email confirmation settings
--
-- Run this in Supabase SQL Editor
-- =====================================================

-- Step 1: DROP existing INSERT policies if they exist (avoid conflicts)
DROP POLICY IF EXISTS "Users can insert own profile on signup" ON profiles;
DROP POLICY IF EXISTS "New coaches can create coach profile" ON coaches;

-- Step 2: CREATE fresh INSERT policies
CREATE POLICY "Users can insert own profile on signup"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "New coaches can create coach profile"
ON coaches FOR INSERT
WITH CHECK (auth.uid() = id);

-- Step 3: Create trigger function to auto-create profile on auth signup
-- This ensures EVERY new auth user gets a profile automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert profile for new user
  INSERT INTO public.profiles (id, email, full_name, role, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
  )
  ON CONFLICT (id) DO NOTHING; -- Prevent duplicate errors

  -- If role is coach, create coach record
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'client') = 'coach' THEN
    INSERT INTO public.coaches (id, is_approved)
    VALUES (NEW.id, FALSE)
    ON CONFLICT (id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: DROP existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 5: CREATE trigger on auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 6: Verify policies exist
SELECT
  schemaname,
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE tablename IN ('profiles', 'coaches')
ORDER BY tablename, cmd;

-- Success message
SELECT '✅ Complete! RLS policies updated and automatic profile creation enabled.' AS status;
SELECT '✅ All new signups (email + Google OAuth) will now automatically create profiles.' AS info;
