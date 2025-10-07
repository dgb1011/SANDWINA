"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignUpSelectionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-pink to-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="font-heading text-4xl font-bold text-brand-red">
              SANDWINA
            </h1>
          </Link>
          <p className="text-gray-600 mt-2">Join SANDWINA - Choose your role to get started</p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Client Card */}
          <Link href="/signup/client">
            <Card className="border-2 border-gray-200 hover:border-brand-red hover:shadow-lg transition-all cursor-pointer h-full group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-brand-pink rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-red transition-colors">
                  <svg
                    className="w-8 h-8 text-brand-red group-hover:text-white transition-colors"
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
                </div>
                <CardTitle className="text-2xl">Sign Up as Client</CardTitle>
                <CardDescription className="text-base">
                  Find your perfect career coach
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-sm text-gray-600 space-y-1 text-left max-w-[200px] mx-auto">
                  <li className="flex items-start">
                    <span className="text-brand-red mr-2">✓</span>
                    <span>Book coaching sessions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-red mr-2">✓</span>
                    <span>Track your progress</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-red mr-2">✓</span>
                    <span>Access resources</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-red mr-2">✓</span>
                    <span>Affordable pricing</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          {/* Coach Card */}
          <Link href="/signup/coach">
            <Card className="border-2 border-brand-maroon hover:border-brand-red hover:shadow-lg transition-all cursor-pointer h-full group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-brand-pink rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-red transition-colors">
                  <svg
                    className="w-8 h-8 text-brand-maroon group-hover:text-white transition-colors"
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
                <CardTitle className="text-2xl">Apply as Coach</CardTitle>
                <CardDescription className="text-base">
                  Join our elite coaching network
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-sm text-gray-600 space-y-1 text-left max-w-[200px] mx-auto">
                  <li className="flex items-start">
                    <span className="text-brand-red mr-2">✓</span>
                    <span>Earn 75% per session</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-red mr-2">✓</span>
                    <span>Use FREE Zoom</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-red mr-2">✓</span>
                    <span>Flexible schedule</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-red mr-2">✓</span>
                    <span>Vetted community</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          {/* Admin Card */}
          <Link href="/signup/admin">
            <Card className="border-2 border-gray-800 hover:border-brand-red hover:shadow-lg transition-all cursor-pointer h-full group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-red transition-colors">
                  <svg
                    className="w-8 h-8 text-white transition-colors"
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
                <CardTitle className="text-2xl">Admin Access</CardTitle>
                <CardDescription className="text-base">
                  Platform administration
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-sm text-gray-600 space-y-1 text-left max-w-[200px] mx-auto">
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2">⚠</span>
                    <span>Requires admin key</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-600 mr-2">✓</span>
                    <span>Full platform access</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-600 mr-2">✓</span>
                    <span>Manage users</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-600 mr-2">✓</span>
                    <span>Review coaches</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Sign In Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-brand-red font-semibold hover:text-brand-maroon"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <Link href="/" className="hover:text-brand-red">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
