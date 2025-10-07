import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-brand-maroon text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-2xl font-bold mb-4">SANDWINA</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              An affordable, approachable, and actionable career coaching platform for women.
            </p>
          </div>

          {/* About Us */}
          <div>
            <h4 className="font-semibold text-lg mb-4">About Us</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/coaches"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Our Coaches
                </Link>
              </li>
            </ul>
          </div>

          {/* Why Us */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Why Us</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/testimonials"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Testimonials
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Legal & Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="mailto:thelifters@sandwina.org"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  thelifters@sandwina.org
                </a>
              </li>
            </ul>

            {/* Social */}
            <div className="mt-4">
              <a
                href="https://www.linkedin.com/company/sandwina"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="LinkedIn"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <Separator className="bg-white/20 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
          <p>© 2025 SANDWINA. All rights reserved.</p>
          <p>
            Made with ❤️ for women everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
