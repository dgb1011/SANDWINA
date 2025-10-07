import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left: Vintage SANDWINA Imagery */}
          <div className="order-2 lg:order-1 relative">
            <div className="hero-gradient absolute inset-0 opacity-10 blur-3xl rounded-full"></div>
            <div className="relative bg-brand-red p-8 rounded-2xl shadow-2xl">
              <div className="aspect-[3/4] bg-gradient-to-b from-[#F4E4C1] to-[#C9A961] rounded-lg overflow-hidden shadow-lg">
                {/* Vintage poster aesthetic - placeholder for actual image */}
                <div className="h-full flex items-center justify-center text-brand-maroon">
                  <div className="text-center p-8">
                    <div className="font-heading text-6xl font-bold mb-4 tracking-tight" style={{ fontFamily: 'serif' }}>
                      Katie
                    </div>
                    <div className="font-heading text-7xl font-black mb-6 text-brand-red" style={{ fontFamily: 'serif' }}>
                      SANDWINA
                    </div>
                    <div className="text-xl font-semibold uppercase tracking-widest">
                      The World's<br />Strongest Lady
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Headline & CTAs */}
          <div className="order-1 lg:order-2 text-center lg:text-left">
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="text-gradient">Empowering women</span>
              <br />
              <span className="text-brand-dark">to get more out of work</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-2xl mx-auto lg:mx-0">
              SANDWINA is a collective of diverse, world-class coaches united in our mission to lift women.
            </p>

            <p className="text-lg md:text-xl text-gray-500 mb-8 max-w-2xl mx-auto lg:mx-0">
              Making coaching <strong className="text-brand-maroon">affordable</strong>, <strong className="text-brand-maroon">approachable</strong>, and <strong className="text-brand-maroon">actionable</strong>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="xl" className="group">
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

              <Button asChild size="xl" variant="outline">
                <Link href="/coaches">Browse Coaches</Link>
              </Button>
            </div>

            <div className="mt-12 flex items-center gap-8 justify-center lg:justify-start">
              <div>
                <div className="text-3xl font-bold text-brand-red">$150</div>
                <div className="text-sm text-gray-500">per session</div>
              </div>
              <div className="h-12 w-px bg-gray-300"></div>
              <div>
                <div className="text-3xl font-bold text-brand-red">50+</div>
                <div className="text-sm text-gray-500">certified coaches</div>
              </div>
              <div className="h-12 w-px bg-gray-300"></div>
              <div>
                <div className="text-3xl font-bold text-brand-red">1,000+</div>
                <div className="text-sm text-gray-500">sessions delivered</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative element */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-brand-pink to-transparent"></div>
    </section>
  );
}
