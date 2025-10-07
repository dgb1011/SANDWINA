"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signUp, signUpWithGoogle } from "@/lib/auth";

export default function AdminSignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminKey: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Verify admin key
    const ADMIN_SIGNUP_KEY = process.env.NEXT_PUBLIC_ADMIN_SIGNUP_KEY || "sandwina-admin-2025";
    if (formData.adminKey !== ADMIN_SIGNUP_KEY) {
      setError("Invalid admin signup key");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    try {
      await signUp({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: "admin",
      });

      router.push("/dashboard/admin");
    } catch (err: any) {
      setError(err.message || "Failed to create admin account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setError(null);

    // Verify admin key before initiating OAuth
    const ADMIN_SIGNUP_KEY = process.env.NEXT_PUBLIC_ADMIN_SIGNUP_KEY || "sandwina-admin-2025";
    if (!formData.adminKey) {
      setError("Please enter admin key first");
      setIsLoading(false);
      return;
    }

    if (formData.adminKey !== ADMIN_SIGNUP_KEY) {
      setError("Invalid admin signup key");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signUpWithGoogle("admin", formData.adminKey);
      if (error) throw error;
      // User will be redirected to Google OAuth
    } catch (err: any) {
      setError(err.message || "Failed to sign up with Google");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="font-heading text-4xl font-bold text-white">SANDWINA</h1>
          </Link>
          <p className="text-gray-400 mt-2">Admin Access Only</p>
        </div>

        <Card className="border-2 border-yellow-500 bg-gray-800 text-white">
          <CardHeader>
            <CardTitle className="text-white">Create Admin Account</CardTitle>
            <CardDescription className="text-gray-300">
              ⚠️ Restricted access - requires admin signup key
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded text-xs text-yellow-200">
                <p className="font-semibold mb-1">Admin Privileges Include:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>Approve/reject coach applications</li>
                  <li>View all users and transactions</li>
                  <li>Upload resources to library</li>
                  <li>Manage email templates</li>
                  <li>Access analytics dashboard</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminKey" className="text-white">Admin Signup Key *</Label>
                <Input
                  id="adminKey"
                  type="password"
                  placeholder="Enter admin key"
                  value={formData.adminKey}
                  onChange={(e) => setFormData({ ...formData, adminKey: e.target.value })}
                  required
                  disabled={isLoading}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <p className="text-xs text-gray-400">
                  Contact platform owner for admin key
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-white">Full Name *</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Admin Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  disabled={isLoading}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@sandwina.org"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isLoading}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={isLoading}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  disabled={isLoading}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-yellow-500 text-gray-900 hover:bg-yellow-400"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Creating admin account..." : "Create Admin Account"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-800 px-2 text-gray-400">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              size="lg"
              onClick={handleGoogleSignUp}
              disabled={isLoading || !formData.adminKey}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>
            {!formData.adminKey && (
              <p className="text-xs text-gray-400 text-center mt-2">
                Enter admin key above to enable Google signup
              </p>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-400">
          <Link href="/login" className="hover:text-white">
            ← Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
