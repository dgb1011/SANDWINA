"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TESTIMONIALS = [
  {
    id: "1",
    name: "DEE",
    avatar: "",
    quote:
      "My SANDWINA Coach, Julie, helped me find my voice in the workplace. I'm now more confident in my skill set and know what I bring to the table. I also have a better sense of myself. I know exactly when I'm self-sabotaging and when I'm being restless. I've learned to be still, breathe, and trust what I want without extra guilt.",
    result: "Senior Product Manager at Tech Company",
    rating: 5,
  },
  {
    id: "2",
    name: "SARAH",
    avatar: "",
    quote:
      "I had a life-changing (no exaggeration) session with a SANDWINA 'Lifter' - a professional coach named Azalia. Whether you want the same for you, want to hire external counsel to further your career, start a business, or tackle complex challenges in your current role – I want to help you try them out!",
    result: "Launched successful consulting business",
    rating: 5,
  },
  {
    id: "3",
    name: "MICHELLE",
    avatar: "",
    quote:
      "Working with my SANDWINA coach gave me the tools and confidence to negotiate my salary. I ended up with a 35% raise and a promotion to Director level. The investment in coaching paid for itself 100x over.",
    result: "Director of Engineering",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-gradient-to-b from-brand-pink to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-brand-dark mb-4">
            Success Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real transformations from real women
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {TESTIMONIALS.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="border-2 border-gray-100 hover:border-brand-red/30 transition-all duration-300 hover:shadow-xl"
            >
              <CardContent className="p-8">
                {/* Stars */}
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-gray-700 italic leading-relaxed mb-6">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <Avatar className="h-12 w-12 border-2 border-brand-pink">
                    <AvatarImage
                      src={testimonial.avatar}
                      alt={testimonial.name}
                    />
                    <AvatarFallback className="bg-brand-red text-white font-bold">
                      {testimonial.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-bold text-brand-dark">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.result}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-8 p-6 bg-white rounded-lg shadow-md">
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-red mb-1">500+</div>
              <div className="text-sm text-gray-600">Happy Clients</div>
            </div>
            <div className="h-12 w-px bg-gray-300"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-red mb-1">4.9</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="h-12 w-px bg-gray-300"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-red mb-1">95%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
