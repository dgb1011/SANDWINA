import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export const metadata = {
  title: "About SANDWINA - Our Mission & Values",
  description: "Learn about SANDWINA's mission to close the gender gap faster by making career coaching more accessible for women.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Mission Hero */}
      <section className="bg-brand-maroon text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-sm font-semibold uppercase tracking-widest mb-6">
            OUR MISSION
          </h1>
          <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8 max-w-5xl mx-auto">
            Our mission is to close the gender gap faster by making career coaching more accessible.
          </h2>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
            To help women get more money, more opportunities, more influence, more fulfillment.
          </p>
        </div>
      </section>

      {/* Photo Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="aspect-[4/5] bg-brand-pink rounded-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                {/* Placeholder for professional woman photo */}
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">👩‍💼</div>
                  <p className="text-sm">Professional Woman</p>
                </div>
              </div>
            </div>
            <div className="aspect-[4/5] bg-brand-pink rounded-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">👩‍💻</div>
                  <p className="text-sm">Coaching Session</p>
                </div>
              </div>
            </div>
            <div className="aspect-[4/5] bg-brand-pink rounded-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">👩‍🏫</div>
                  <p className="text-sm">Success Story</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gradient-to-b from-white to-brand-pink">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-brand-maroon mb-4">
              OUR VALUES
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <ValueAccordion
              number="1"
              title="Walk the Talk"
              content="Our mission is bold, and it is important. That means it's going to require hard work and sacrifices. It's not a Millennial Pink infused moment to be captured for posterity. We must do the gritty hard work and find joy in the climb."
            />
            <ValueAccordion
              number="2"
              title="Unlock Transformation over Transaction"
              content="We commit to making lives better, paychecks bigger and jobs more fulfilling by emphasizing meaningful change, not incremental, transactional tweaks."
            />
            <ValueAccordion
              number="3"
              title="Lift and Be Lifted"
              content="We are better together. When we support one another, we change the trajectory for all women. We will give and receive lifts for the benefit of all women."
            />
            <ValueAccordion
              number="4"
              title="Honor Self-Care"
              content="Boundaries are essential to our success and allow us to live our purpose. We lift others highest when we care for ourselves first."
            />
            <ValueAccordion
              number="5"
              title="Enable Equitable Access"
              content="We cannot be quiet passengers on the path to parity. To make an impact, we ALL must use our voices and advocate for the benefits of equity in ways big and small. Every day. Our services are not reserved for the 1%, we are here to lift all who identify as women."
            />
          </div>
        </div>
      </section>

      {/* Katie Sandwina Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
            {/* Left: Historic Photo */}
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <div className="aspect-[3/4] flex items-center justify-center p-12">
                {/* Placeholder for historic Katie Sandwina photo */}
                <div className="text-center">
                  <div className="text-8xl mb-4">🏋️‍♀️</div>
                  <p className="text-brand-maroon font-heading text-2xl font-bold">
                    Katie Sandwina
                  </p>
                  <p className="text-gray-600">The World's Strongest Woman</p>
                  <p className="text-sm text-gray-500 mt-2">(1884-1952)</p>
                </div>
              </div>
            </div>

            {/* Right: Biography */}
            <div className="space-y-6">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-brand-maroon mb-4">
                OUR INSPIRATION: KATIE SANDWINA
              </h2>

              <div className="prose prose-lg">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Katie Brumbach was born in the back of a circus wagon in the late 1880's to two Bavarian performers. After years of dazzling audiences with her jaw-dropping strength, one day in New York in 1902, Brumbach came across the World's Strongest Man, Eugene Sandow, and the two had an epic weightlifting showdown.
                </p>

                <p className="text-gray-700 leading-relaxed mb-4">
                  Brumbach definitively won when she lifted 300 pounds over her head with one hand, while Sandow barely got the weights to his chest with two hands.
                </p>

                <p className="text-gray-700 leading-relaxed mb-4">
                  Her victory proclamation? Changing her name to Katie Sandwina in honor of the man she defeated, Eugene Sandow. The Great Sandwina was born.
                </p>

                <p className="text-gray-700 leading-relaxed mb-4">
                  We are inspired by her strength and her advocacy for women. In 1912, she became the vice president of the 800-member Suffragette Ladies of the Barnum & Bailey Circus and was sometimes referred to as Sandwina the Suffragette.
                </p>

                <p className="text-brand-maroon font-semibold text-lg">
                  Katie Sandwina lifted others, fought for women's rights and lived a life deeply committed to equity. She is our inspiration to lift you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-16 bg-brand-pink">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <TestimonialCarousel />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function ValueAccordion({ number, title, content }: { number: string; title: string; content: string }) {
  return (
    <Card className="border-2 border-gray-200 hover:border-brand-red/30 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-red text-white flex items-center justify-center font-bold">
            {number}
          </div>
          <div className="flex-1">
            <h3 className="font-heading text-xl font-bold text-brand-maroon mb-3">
              {number}. {title}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {content}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TestimonialCarousel() {
  const testimonials = [
    {
      name: "SARAH",
      quote: "I had a life-changing (no exaggeration) session with a SANDWINA 'Lifter' - a professional coach named Azalia - and I want the same for you! If you are seeking external counsel to further your career, start a business, or tackle complex issues in your current role – I want to help you try them out!",
      rating: 5,
    },
    {
      name: "TATE",
      quote: "Sharing my gratitude for SANDWINA and Julie!! My wish for everyone is to have the community and the guidance that gets you the life and career you want. It takes a village to get a girl a job.",
      rating: 5,
    },
    {
      name: "ROMA",
      quote: "Being coached by Azalia was one of the best things that I never knew I needed. She showed me how to name and understand my strengths and she taught me how to be intentional in calling on different specific strengths in order to achieve my goals. She has helped me grow and I'm thankful for having her as my coach.",
      rating: 5,
    },
  ];

  return (
    <div className="space-y-8">
      {testimonials.map((testimonial, index) => (
        <Card key={index} className="border-2 border-gray-200">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-brand-red text-white flex items-center justify-center font-bold text-xl">
                {testimonial.name[0]}
              </div>
              <div>
                <h4 className="font-bold text-brand-maroon text-xl">{testimonial.name}</h4>
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            <blockquote className="text-gray-700 italic leading-relaxed">
              "{testimonial.quote}"
            </blockquote>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
