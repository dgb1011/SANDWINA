"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="font-heading text-2xl font-bold text-brand-red">
              SANDWINA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/about"
              className="text-gray-700 hover:text-brand-red transition-colors font-medium"
            >
              About
            </Link>
            <Link
              href="/coaches"
              className="text-gray-700 hover:text-brand-red transition-colors font-medium"
            >
              Coaches
            </Link>
            <Link
              href="/how-it-works"
              className="text-gray-700 hover:text-brand-red transition-colors font-medium"
            >
              How it Works
            </Link>
            <Link
              href="/testimonials"
              className="text-gray-700 hover:text-brand-red transition-colors font-medium"
            >
              Testimonials
            </Link>
            <Link
              href="/pricing"
              className="text-gray-700 hover:text-brand-red transition-colors font-medium"
            >
              Pricing
            </Link>
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button asChild size="sm" className="bg-brand-pink text-brand-maroon hover:bg-brand-pink/80 border-2 border-brand-red">
              <Link href="/quiz">Take Our Quiz</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg
                className="w-6 h-6 text-brand-red"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-brand-red"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              <Link
                href="/about"
                className="text-gray-700 hover:text-brand-red transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/coaches"
                className="text-gray-700 hover:text-brand-red transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Coaches
              </Link>
              <Link
                href="/how-it-works"
                className="text-gray-700 hover:text-brand-red transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                How it Works
              </Link>
              <Link
                href="/testimonials"
                className="text-gray-700 hover:text-brand-red transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </Link>
              <Link
                href="/pricing"
                className="text-gray-700 hover:text-brand-red transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/signin" onClick={() => setMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button asChild className="w-full bg-brand-pink text-brand-maroon hover:bg-brand-pink/80 border-2 border-brand-red">
                  <Link href="/quiz" onClick={() => setMobileMenuOpen(false)}>
                    Take Our Quiz
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
