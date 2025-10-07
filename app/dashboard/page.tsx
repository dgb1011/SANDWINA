"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser, signOut } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await getCurrentUser();
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
          <div className="w-16 h-16 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <h1 className="font-heading text-2xl font-bold text-brand-red">SANDWINA</h1>
          </Link>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Header */}
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl font-bold text-brand-red mb-4">
              Welcome back{user?.profile?.full_name ? `, ${user.profile.full_name}` : ''}!
            </h1>
            <p className="text-gray-600 text-lg">
              Your personalized dashboard is coming soon in Sprint 2
            </p>
          </div>

          {/* User Info Card */}
          <Card className="mb-8 border-2 border-brand-red">
            <CardHeader>
              <CardTitle>Your Account</CardTitle>
              <CardDescription>Account information and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Name:</span>
                <span className="text-gray-900">{user?.profile?.full_name || 'Not set'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Email:</span>
                <span className="text-gray-900">{user?.email}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 font-medium">Role:</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-brand-pink text-brand-red border border-brand-red">
                  {user?.profile?.role?.toUpperCase() || 'CLIENT'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Coming Soon Card */}
          <Card className="border-2 border-gray-300 bg-gray-50">
            <CardHeader>
              <CardTitle className="text-center">Dashboard Coming Soon</CardTitle>
              <CardDescription className="text-center">
                Sprint 2: User Dashboards & Profiles (Weeks 3-4)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-brand-pink rounded-full flex items-center justify-center mx-auto">
                  <svg
                    className="w-10 h-10 text-brand-red"
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
                <h3 className="font-heading text-xl font-semibold text-gray-900">
                  Full Dashboard Features Coming Soon
                </h3>
                <ul className="text-left max-w-md mx-auto space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-brand-red mr-2">•</span>
                    View and manage your sessions
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-red mr-2">•</span>
                    Track your progress and goals
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-red mr-2">•</span>
                    Access exclusive resources
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-red mr-2">•</span>
                    Manage your profile and preferences
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-red mr-2">•</span>
                    Review your transaction history
                  </li>
                </ul>
                <p className="text-sm text-gray-500 italic">
                  Currently in Sprint 1: Foundation & Authentication ✓
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <Link href="/">
              <Card className="hover:border-brand-red transition-colors cursor-pointer h-full">
                <CardContent className="pt-6 text-center">
                  <svg
                    className="w-8 h-8 text-brand-red mx-auto mb-2"
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
              <Card className="hover:border-brand-red transition-colors cursor-pointer h-full">
                <CardContent className="pt-6 text-center">
                  <svg
                    className="w-8 h-8 text-brand-red mx-auto mb-2"
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
                  <p className="font-semibold text-gray-900">Browse Coaches</p>
                  <p className="text-sm text-gray-500">Find your perfect coach</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/about">
              <Card className="hover:border-brand-red transition-colors cursor-pointer h-full">
                <CardContent className="pt-6 text-center">
                  <svg
                    className="w-8 h-8 text-brand-red mx-auto mb-2"
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
