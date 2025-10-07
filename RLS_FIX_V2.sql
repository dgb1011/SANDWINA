-- =====================================================
-- SANDWINA Authentication Fix - Version 2
-- =====================================================
-- Run this entire script in Supabase SQL Editor
-- This version is tested and compatible with Supabase
-- =====================================================

-- Step 1: Drop existing policies to avoid conflicts
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can insert own profile on signup" ON profiles;
  DROP POLICY IF EXISTS "New coaches can create coach profile" ON coaches;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Step 2: Create INSERT policies for profiles table
CREATE POLICY "Users can insert own profile on signup"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Step 3: Create INSERT policies for coaches table
CREATE POLICY "New coaches can create coach profile"
ON coaches FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Step 4: Create trigger function for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert profile for new user
  INSERT INTO public.profiles (id, email, full_name, role, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      SPLIT_PART(NEW.email, '@', 1)
    ),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client'),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture'
    )
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    avatar_url = EXCLUDED.avatar_url;

  -- If role is coach, create coach record
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'client') = 'coach' THEN
    INSERT INTO public.coaches (id, is_approved)
    VALUES (NEW.id, FALSE)
    ON CONFLICT (id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Step 5: Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 6: Create trigger on auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 7: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- Step 8: Verify setup
SELECT
  'Trigger created successfully' as status,
  tgname as trigger_name,
  proname as function_name
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE t.tgname = 'on_auth_user_created';

-- Step 9: Verify policies
SELECT
  tablename,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename IN ('profiles', 'coaches')
  AND policyname LIKE '%insert%'
ORDER BY tablename;

-- Success message
SELECT '✅ Authentication fix complete!' as status;
SELECT '✅ Try creating a new user now - profiles will be created automatically' as next_step;
