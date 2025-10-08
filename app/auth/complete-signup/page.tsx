"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const ADMIN_SIGNUP_KEY = process.env.NEXT_PUBLIC_ADMIN_SIGNUP_KEY || 'sandwina-admin-2025';

export default function CompleteSignupPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'processing' | 'error'>('processing');

  useEffect(() => {
    async function completeSignup() {
      try {
        console.log('🔄 Starting signup completion...');

        // Get role from localStorage (set before OAuth redirect)
        const role = localStorage.getItem('oauth_signup_role') as 'client' | 'coach' | 'admin' | null;
        const adminKey = localStorage.getItem('oauth_signup_admin_key');

        console.log('📦 Retrieved from localStorage:', { role, adminKey });

        // Clear localStorage
        localStorage.removeItem('oauth_signup_role');
        localStorage.removeItem('oauth_signup_admin_key');

        const supabase = createClient();

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error('❌ No user found:', userError);
          setStatus('error');
          router.push('/login?error=no_user');
          return;
        }

        console.log('👤 Current user:', user.email);

        // Check if profile exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id, role')
          .eq('id', user.id)
          .single();

        console.log('📊 Existing profile:', existingProfile);

        // If profile already has a non-default role, user is signing in (not signing up)
        if (existingProfile && existingProfile.role && !role) {
          console.log('✅ Existing user - redirecting to dashboard');
          const dashboardUrl = existingProfile.role === 'admin'
            ? '/dashboard/admin'
            : existingProfile.role === 'coach'
            ? '/dashboard/coach'
            : '/dashboard';
          router.push(dashboardUrl);
          return;
        }

        // NEW USER or role was specified
        const finalRole = role || 'client';

        console.log('🆕 New user signup with role:', finalRole);

        // Validate admin signup
        if (finalRole === 'admin') {
          if (!adminKey || adminKey !== ADMIN_SIGNUP_KEY) {
            console.log('❌ Invalid admin key');
            await supabase.auth.signOut();
            router.push('/signup/admin?error=invalid_admin_key');
            return;
          }
        }

        // Wait for trigger to complete creating the profile
        console.log('⏳ Waiting for trigger to complete...');
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Update profile with correct role
        console.log('📝 Updating profile role to:', finalRole);
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: finalRole })
          .eq('id', user.id);

        if (updateError) {
          console.error('❌ Error updating profile role:', updateError);
          setStatus('error');
          return;
        }

        console.log('✅ Profile role updated successfully');

        // If coach, create coach record
        if (finalRole === 'coach') {
          console.log('👔 Creating coach record...');

          // Check if coach record already exists
          const { data: existingCoach } = await supabase
            .from('coaches')
            .select('id')
            .eq('id', user.id)
            .single();

          if (!existingCoach) {
            const { error: coachError } = await supabase
              .from('coaches')
              .insert({ id: user.id, is_approved: false });

            if (coachError) {
              console.error('❌ Error creating coach record:', coachError);
            } else {
              console.log('✅ Coach record created successfully');
            }
          } else {
            console.log('ℹ️ Coach record already exists');
          }

          router.push('/dashboard/coach/onboarding');
          return;
        }

        const dashboardUrl = finalRole === 'admin' ? '/dashboard/admin' : '/dashboard';
        console.log('🎯 Redirecting to:', dashboardUrl);
        router.push(dashboardUrl);

      } catch (error) {
        console.error('❌ Error completing signup:', error);
        setStatus('error');
      }
    }

    completeSignup();
  }, [router]);

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">There was an error completing your signup.</p>
          <a href="/signup" className="text-brand-red hover:underline">
            Try again
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Completing your signup...</h1>
        <p className="text-gray-600">Please wait while we set up your account.</p>
      </div>
    </div>
  );
}
