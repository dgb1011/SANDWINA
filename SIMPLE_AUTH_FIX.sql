-- =====================================================
-- SIMPLE AUTH FIX - Copy this entire file and paste into Supabase SQL Editor
-- =====================================================

-- 1. Create trigger function (this runs automatically when users sign up)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'client'),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture')
  );

  if coalesce(new.raw_user_meta_data->>'role', 'client') = 'coach' then
    insert into public.coaches (id, is_approved)
    values (new.id, false);
  end if;

  return new;
end;
$$;

-- 2. Drop old trigger if exists
drop trigger if exists on_auth_user_created on auth.users;

-- 3. Create new trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
