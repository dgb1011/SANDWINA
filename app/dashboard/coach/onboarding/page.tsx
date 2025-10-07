"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser, signOut } from "@/lib/auth";

export default function CoachOnboardingPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser?.profile?.role !== 'coach' && currentUser?.profile?.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
      setUser(currentUser);
    } catch (error) {
      console.error("Error loading user:", error);
      router.push("/signin");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-pink to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-maroon border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-pink to-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-brand-maroon shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <h1 className="font-heading text-2xl font-bold text-brand-maroon">SANDWINA COACH</h1>
          </Link>
          <Button variant="outline" onClick={handleSignOut} className="border-brand-maroon text-brand-maroon hover:bg-brand-maroon hover:text-white">
            Sign Out
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-maroon rounded-full mb-4">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="font-heading text-4xl font-bold text-brand-maroon mb-4">
              Coach Onboarding
            </h1>
            <p className="text-gray-600 text-lg">
              Welcome, {user?.profile?.full_name}! Let's get you set up.
            </p>
          </div>

          {/* Status Card */}
          <Card className="mb-8 border-2 border-brand-maroon">
            <CardHeader>
              <CardTitle className="text-brand-maroon">Application Status</CardTitle>
              <CardDescription>Your coach application information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Pending Review</p>
                    <p className="text-sm text-gray-600">Your application is being reviewed by our team</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Name:</span>
                  <span className="text-gray-900">{user?.profile?.full_name || 'Not set'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Email:</span>
                  <span className="text-gray-900">{user?.email}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Account Type:</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-brand-pink text-brand-maroon border border-brand-maroon">
                    COACH (PENDING APPROVAL)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coming Soon Card */}
          <Card className="border-2 border-gray-300 bg-gray-50 mb-8">
            <CardHeader>
              <CardTitle className="text-center">Onboarding Process Coming Soon</CardTitle>
              <CardDescription className="text-center">
                Sprint 2: Coach Onboarding & Profile Setup (Weeks 3-4)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-brand-pink rounded-full flex items-center justify-center mx-auto">
                  <svg
                    className="w-10 h-10 text-brand-maroon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-semibold text-gray-900">
                  Full Onboarding Experience Coming Soon
                </h3>
                <div className="max-w-2xl mx-auto">
                  <p className="text-gray-600 mb-4">
                    Complete these steps to become an active coach:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 text-left">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-brand-maroon mb-2">Step 1: Profile</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li className="flex items-start">
                          <span className="text-brand-red mr-2">•</span>
                          Upload professional photo
                        </li>
                        <li className="flex items-start">
                          <span className="text-brand-red mr-2">•</span>
                          Add bio and experience
                        </li>
                        <li className="flex items-start">
                          <span className="text-brand-red mr-2">•</span>
                          List certifications
                        </li>
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-brand-maroon mb-2">Step 2: Zoom Setup</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li className="flex items-start">
                          <span className="text-brand-red mr-2">•</span>
                          Add your FREE Zoom link
                        </li>
                        <li className="flex items-start">
                          <span className="text-brand-red mr-2">•</span>
                          Set your availability
                        </li>
                        <li className="flex items-start">
                          <span className="text-brand-red mr-2">•</span>
                          Configure booking settings
                        </li>
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-brand-maroon mb-2">Step 3: Admin Review</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li className="flex items-start">
                          <span className="text-brand-red mr-2">•</span>
                          1-2 business day review
                        </li>
                        <li className="flex items-start">
                          <span className="text-brand-red mr-2">•</span>
                          Credential verification
                        </li>
                        <li className="flex items-start">
                          <span className="text-brand-red mr-2">•</span>
                          Profile approval
                        </li>
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-brand-maroon mb-2">Step 4: Payments</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li className="flex items-start">
                          <span className="text-brand-red mr-2">•</span>
                          Connect Stripe account
                        </li>
                        <li className="flex items-start">
                          <span className="text-brand-red mr-2">•</span>
                          Set up payout schedule
                        </li>
                        <li className="flex items-start">
                          <span className="text-brand-red mr-2">•</span>
                          Start accepting clients!
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 italic pt-4">
                  Currently in Sprint 1: Foundation & Authentication ✓
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Info Box */}
          <div className="bg-brand-pink border-l-4 border-brand-maroon p-6 rounded">
            <h3 className="font-semibold text-brand-maroon mb-2">What to Expect</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-brand-red mr-2 font-bold">→</span>
                <span>You'll earn <strong>75%</strong> of session fees (25% platform fee)</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-red mr-2 font-bold">→</span>
                <span>Use your <strong>FREE</strong> Zoom account - no additional cost</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-red mr-2 font-bold">→</span>
                <span>Payments processed automatically via Stripe Connect</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-red mr-2 font-bold">→</span>
                <span>Full control over your schedule and availability</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <Link href="/">
              <Card className="hover:border-brand-maroon transition-colors cursor-pointer h-full">
                <CardContent className="pt-6 text-center">
                  <svg
                    className="w-8 h-8 text-brand-maroon mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <p className="font-semibold text-gray-900">Home</p>
                  <p className="text-sm text-gray-500">Back to landing page</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/coaches">
              <Card className="hover:border-brand-maroon transition-colors cursor-pointer h-full">
                <CardContent className="pt-6 text-center">
                  <svg
                    className="w-8 h-8 text-brand-maroon mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <p className="font-semibold text-gray-900">View Coaches</p>
                  <p className="text-sm text-gray-500">Browse other coaches</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/about">
              <Card className="hover:border-brand-maroon transition-colors cursor-pointer h-full">
                <CardContent className="pt-6 text-center">
                  <svg
                    className="w-8 h-8 text-brand-maroon mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="font-semibold text-gray-900">About Us</p>
                  <p className="text-sm text-gray-500">Learn about SANDWINA</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
