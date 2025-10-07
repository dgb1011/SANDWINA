import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Database } from '@/types/supabase';

const ADMIN_SIGNUP_KEY = process.env.NEXT_PUBLIC_ADMIN_SIGNUP_KEY || 'sandwina-admin-2025';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

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
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      // NEW USER - Profile created automatically by database trigger
      // The trigger reads user_metadata and creates profile + coach records
      const metadata = session.user.user_metadata;
      const role = metadata?.role || 'client';
      const adminKey = metadata?.adminKey;

      // Validate admin signup
      if (role === 'admin') {
        if (!adminKey || adminKey !== ADMIN_SIGNUP_KEY) {
          await supabase.auth.signOut();
          return NextResponse.redirect(
            new URL('/signup/admin?error=invalid_admin_key', request.url)
          );
        }
      }

      // Small delay to ensure trigger completes
      await new Promise(resolve => setTimeout(resolve, 100));

      // Redirect based on role
      if (role === 'coach') {
        return NextResponse.redirect(new URL('/dashboard/coach/onboarding', request.url));
      }

      const dashboardUrl = role === 'admin' ? '/dashboard/admin' : '/dashboard';
      return NextResponse.redirect(new URL(dashboardUrl, request.url));
    }
  }

  // Fallback redirect
  return NextResponse.redirect(new URL('/dashboard', request.url));
}
