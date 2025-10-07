import { createClient } from './supabase/client';

export type UserRole = 'client' | 'coach' | 'admin';

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
}

export async function signUp({ email, password, fullName, role }: SignUpData) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) throw error;

  // Profile and coach records are created automatically by database trigger
  // The trigger reads user_metadata (full_name, role) and creates appropriate records
  // No manual INSERT needed - this prevents RLS errors and ensures consistency

  return { data, error: null };
}

export async function signIn(email: string, password: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

export async function signInWithGoogle() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  return { data, error };
}

export async function signUpWithGoogle(role: UserRole, adminKey?: string) {
  const supabase = createClient();

  // Create state object with role and admin key (if applicable)
  const state = {
    role,
    adminKey: adminKey || null,
    timestamp: Date.now(),
  };

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      // Store role in state to retrieve after OAuth
      skipBrowserRedirect: false,
      // @ts-ignore - Supabase supports state but types are incomplete
      data: state,
    },
  });

  return { data, error };
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function resetPassword(email: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/confirm`,
  });

  return { data, error };
}

export async function updatePassword(newPassword: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  return { data, error };
}

export async function getCurrentUser() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  // Get profile with role
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return { ...user, profile };
}

export async function getUserRole(userId: string): Promise<UserRole | null> {
  const supabase = createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  return profile?.role || null;
}
