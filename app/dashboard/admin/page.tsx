"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser, signOut } from "@/lib/auth";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser?.profile?.role !== 'admin') {
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Navigation */}
      <nav className="bg-gray-950 border-b border-gray-700 shadow-lg">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <h1 className="font-heading text-2xl font-bold text-yellow-500">SANDWINA ADMIN</h1>
          </Link>
          <Button variant="outline" onClick={handleSignOut} className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-gray-900">
            Sign Out
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-500 rounded-full mb-4">
              <svg
                className="w-10 h-10 text-gray-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
            <h1 className="font-heading text-4xl font-bold text-white mb-4">
              Admin Dashboard
            </h1>
            <p className="text-gray-400 text-lg">
              Welcome, {user?.profile?.full_name}
            </p>
          </div>

          {/* User Info Card */}
          <Card className="mb-8 border-2 border-yellow-500 bg-gray-800 text-white">
            <CardHeader>
              <CardTitle className="text-yellow-500">Admin Account</CardTitle>
              <CardDescription className="text-gray-300">Administrator privileges active</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-400 font-medium">Name:</span>
                <span className="text-white">{user?.profile?.full_name || 'Admin User'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-400 font-medium">Email:</span>
                <span className="text-white">{user?.email}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-400 font-medium">Access Level:</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-500 text-gray-900">
                  ADMIN - FULL ACCESS
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Coming Soon Card */}
          <Card className="border-2 border-gray-600 bg-gray-800">
            <CardHeader>
              <CardTitle className="text-center text-yellow-500">Admin Dashboard Coming Soon</CardTitle>
              <CardDescription className="text-center text-gray-300">
                Sprint 2: User Dashboards & Management (Weeks 3-4)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto">
                  <svg
                    className="w-10 h-10 text-yellow-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-semibold text-white">
                  Full Admin Features Coming Soon
                </h3>
                <ul className="text-left max-w-md mx-auto space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">✓</span>
                    Approve/reject coach applications
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">✓</span>
                    View all users and manage accounts
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">✓</span>
                    Monitor platform transactions
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">✓</span>
                    Upload and manage resources
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">✓</span>
                    Edit email templates
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">✓</span>
                    Access platform analytics
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">✓</span>
                    Manage platform settings
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
              <Card className="bg-gray-800 border-gray-700 hover:border-yellow-500 transition-colors cursor-pointer h-full">
                <CardContent className="pt-6 text-center">
                  <svg
                    className="w-8 h-8 text-yellow-500 mx-auto mb-2"
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
                  <p className="font-semibold text-white">Home</p>
                  <p className="text-sm text-gray-400">Back to landing page</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/coaches">
              <Card className="bg-gray-800 border-gray-700 hover:border-yellow-500 transition-colors cursor-pointer h-full">
                <CardContent className="pt-6 text-center">
                  <svg
                    className="w-8 h-8 text-yellow-500 mx-auto mb-2"
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
                  <p className="font-semibold text-white">View Coaches</p>
                  <p className="text-sm text-gray-400">Browse coach profiles</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard">
              <Card className="bg-gray-800 border-gray-700 hover:border-yellow-500 transition-colors cursor-pointer h-full">
                <CardContent className="pt-6 text-center">
                  <svg
                    className="w-8 h-8 text-yellow-500 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <p className="font-semibold text-white">User Dashboard</p>
                  <p className="text-sm text-gray-400">View as regular user</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
