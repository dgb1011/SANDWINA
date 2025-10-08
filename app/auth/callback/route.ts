import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Database } from '@/types/supabase';

const ADMIN_SIGNUP_KEY = process.env.NEXT_PUBLIC_ADMIN_SIGNUP_KEY || 'sandwina-admin-2025';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  // Get role and adminKey from query params (passed from OAuth signup)
  const roleParam = requestUrl.searchParams.get('role') as 'client' | 'coach' | 'admin' | null;
  const adminKeyParam = requestUrl.searchParams.get('adminKey');

  if (code) {
    const supabase = createRouteHandlerClient<Database>({ cookies });

    // Exchange code for session
    const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

    if (sessionError) {
      console.error('Session error:', sessionError);
      return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
    }

    if (session?.user) {
      // Check if profile exists (to determine if this is a new signup)
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('id', session.user.id)
        .single();

      // If profile exists, user is signing in (not signing up)
      if (existingProfile) {
        // Redirect to appropriate dashboard based on their existing role
        const dashboardUrl = existingProfile.role === 'admin'
          ? '/dashboard/admin'
          : existingProfile.role === 'coach'
          ? '/dashboard/coach'
          : '/dashboard';
        return NextResponse.redirect(new URL(dashboardUrl, request.url));
      }

      // NEW USER - Profile was created by trigger with default 'client' role
      // We need to update it with the actual intended role from query params
      const role = roleParam || 'client';
      const adminKey = adminKeyParam;

      // Validate admin signup
      if (role === 'admin') {
        if (!adminKey || adminKey !== ADMIN_SIGNUP_KEY) {
          await supabase.auth.signOut();
          return NextResponse.redirect(
            new URL('/signup/admin?error=invalid_admin_key', request.url)
          );
        }
      }

      // Wait for trigger to complete creating the profile
      await new Promise(resolve => setTimeout(resolve, 200));

      // Update profile with correct role (trigger created it with default 'client')
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', session.user.id);

      if (updateError) {
        console.error('Error updating profile role:', updateError);
      }

      // If coach, create coach record
      if (role === 'coach') {
        const { error: coachError } = await supabase
          .from('coaches')
          .insert({ id: session.user.id, is_approved: false });

        if (coachError) {
          console.error('Error creating coach record:', coachError);
        }

        return NextResponse.redirect(new URL('/dashboard/coach/onboarding', request.url));
      }

      const dashboardUrl = role === 'admin' ? '/dashboard/admin' : '/dashboard';
      return NextResponse.redirect(new URL(dashboardUrl, request.url));
    }
  }

  // Fallback redirect
  return NextResponse.redirect(new URL('/dashboard', request.url));
}
