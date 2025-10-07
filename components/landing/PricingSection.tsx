import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PACKAGES = [
  {
    id: "single",
    name: "Discovery",
    sessions: 1,
    price: 150,
    pricePerSession: 150,
    description: "Perfect for trying coaching for the first time",
    features: [
      "45-minute 1-on-1 session",
      "Video call via Zoom",
      "Personalized action plan",
      "Resource library access",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    id: "3pack",
    name: "Focused 3-Pack",
    sessions: 3,
    price: 420,
    pricePerSession: 140,
    savings: "7% off",
    description: "Tackle a specific challenge with focused support",
    features: [
      "Three 45-minute sessions",
      "Progress tracking dashboard",
      "Email support between sessions",
      "Goal-setting framework",
      "Resource library access",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    id: "6pack",
    name: "Growth 6-Pack",
    sessions: 6,
    price: 750,
    pricePerSession: 125,
    savings: "17% off",
    description: "Most popular choice for meaningful career transformation",
    features: [
      "Six 45-minute sessions",
      "Comprehensive progress tracking",
      "Priority email support",
      "Custom career roadmap",
      "Resume/LinkedIn review",
      "Resource library access",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    id: "12pack",
    name: "Career Plan",
    sessions: 12,
    price: 1320,
    pricePerSession: 110,
    savings: "27% off",
    description: "Deep transformation over 3-6 months",
    features: [
      "Twelve 45-minute sessions",
      "VIP priority support",
      "Quarterly progress reviews",
      "Complete career blueprint",
      "Resume & LinkedIn optimization",
      "Interview prep & salary negotiation",
      "Resource library access",
    ],
    cta: "Get Started",
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-brand-dark mb-4">
            Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the package that works for you. All packages include full access to our coach network.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {PACKAGES.map((pkg) => (
            <Card
              key={pkg.id}
              className={`relative border-2 transition-all duration-300 hover:shadow-xl ${
                pkg.popular
                  ? "border-brand-red shadow-lg scale-105"
                  : "border-gray-200 hover:border-brand-red/30"
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-brand-red text-white px-4 py-1 text-sm font-bold">
                    MOST POPULAR
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-brand-dark mb-2">
                  {pkg.name}
                </CardTitle>

                <div className="mb-2">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-brand-red">
                      ${pkg.price}
                    </span>
                    <span className="text-gray-500 text-sm">
                      for {pkg.sessions} {pkg.sessions === 1 ? "session" : "sessions"}
                    </span>
                  </div>

                  <div className="mt-1">
                    <span className="text-sm text-gray-600">
                      ${pkg.pricePerSession}/session
                    </span>
                    {pkg.savings && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {pkg.savings}
                      </Badge>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-600">{pkg.description}</p>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <svg
                        className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className="w-full"
                  variant={pkg.popular ? "default" : "outline"}
                  size="lg"
                >
                  <Link href="/quiz">{pkg.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6">
            Not sure which package is right for you?
          </p>
          <Button asChild size="lg" variant="outline">
            <Link href="/quiz">Take Our Quiz</Link>
          </Button>
        </div>

        {/* Value Reminder */}
        <div className="mt-16 max-w-3xl mx-auto bg-brand-pink border-2 border-brand-red/20 rounded-lg p-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="text-left">
              <div className="text-sm text-gray-600 mb-1">Traditional Coaching</div>
              <div className="text-3xl font-bold text-gray-400 line-through">
                $500/session
              </div>
            </div>
            <svg
              className="w-8 h-8 text-brand-red"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
            <div className="text-left">
              <div className="text-sm text-brand-maroon font-semibold mb-1">SANDWINA</div>
              <div className="text-3xl font-bold text-brand-red">
                $150/session
              </div>
            </div>
          </div>
          <p className="text-gray-700 font-semibold">
            Save 70% compared to traditional coaching
          </p>
        </div>
      </div>
    </section>
  );
}
