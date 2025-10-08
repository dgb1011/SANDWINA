import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Database } from '@/types/supabase';

const ADMIN_SIGNUP_KEY = process.env.NEXT_PUBLIC_ADMIN_SIGNUP_KEY || 'sandwina-admin-2025';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  console.log('🔍 OAuth Callback - Initial request:', {
    hasCode: !!code,
    fullUrl: requestUrl.toString(),
  });

  if (code) {
    const supabase = createRouteHandlerClient<Database>({ cookies });

    // Exchange code for session
    const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

    if (sessionError) {
      console.error('❌ Session error:', sessionError);
      return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
    }

    if (session?.user) {
      console.log('✅ Session created for user:', session.user.email);

      // Redirect to a client-side page that will handle role assignment from localStorage
      // This is necessary because localStorage is only available on the client
      return NextResponse.redirect(new URL('/auth/complete-signup', request.url));
    }
  }

  // Fallback redirect
  console.log('⚠️ Fallback redirect to dashboard');
  return NextResponse.redirect(new URL('/dashboard', request.url));
}
