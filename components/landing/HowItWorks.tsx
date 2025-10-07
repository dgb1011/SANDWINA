import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Take Our Quiz",
      description:
        "Answer a few questions to help us match you with the very best coach for you. Are you feeling stuck and need help planning your next move? Looking to level up? Recently promoted and eager to define your leadership style? We got you!",
      icon: (
        <svg
          className="w-16 h-16 text-brand-red"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      number: "2",
      title: "Pick Your Lifter",
      description:
        "Our LiftMatcher® quiz enables us to identify the best coaches for you and then you have the opportunity to chat with and pick the one you want. Fit is everything.",
      icon: (
        <svg
          className="w-16 h-16 text-brand-red"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      number: "3",
      title: "Grow and Advance",
      description:
        "Go get that raise. Make that side hustle into the thriving business you know it can be. Crash into that board room. SANDWINA is here to lift you up and enable your success.",
      icon: (
        <svg
          className="w-16 h-16 text-brand-red"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-brand-dark mb-4">
            How does SANDWINA work?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Three simple steps to transform your career
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-12">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connecting line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 border-t-2 border-dashed border-gray-300"></div>
              )}

              <div className="relative text-center">
                {/* Number circle */}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-pink border-4 border-brand-red mb-6">
                  <span className="text-3xl font-bold text-brand-red">
                    {step.number}
                  </span>
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-4">{step.icon}</div>

                {/* Content */}
                <h3 className="font-heading text-2xl font-bold text-brand-dark mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" className="group">
            <Link href="/quiz">
              Take Our Quiz
              <svg
                className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
