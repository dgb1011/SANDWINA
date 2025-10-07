import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="py-24 hero-gradient">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Ready to lift yourself up?
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Join hundreds of women who've transformed their careers with SANDWINA
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              asChild
              size="xl"
              className="bg-white text-brand-red hover:bg-gray-100 font-bold"
            >
              <Link href="/quiz">
                Take Our Quiz
                <svg
                  className="ml-2 h-5 w-5"
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

            <Button
              asChild
              size="xl"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-brand-red"
            >
              <Link href="/coaches">Browse Coaches</Link>
            </Button>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-4xl font-bold mb-2">$150</div>
              <div className="text-white/80">Affordable pricing</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-white/80">Expert coaches</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24h</div>
              <div className="text-white/80">Quick booking</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
