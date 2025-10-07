"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data - will be replaced with real data from Supabase
const FEATURED_COACHES = [
  {
    id: "1",
    name: "Sarah Johnson",
    specialty: "Executive Leadership",
    bio: "15+ years helping women break through the glass ceiling into C-suite roles.",
    avatar: "",
    rating: 5.0,
    sessions: 150,
    tags: ["Leadership", "Negotiation", "Career Transition"],
  },
  {
    id: "2",
    name: "Maria Rodriguez",
    specialty: "Career Transitions",
    bio: "Specializing in helping women pivot careers and land their dream jobs.",
    avatar: "",
    rating: 4.9,
    sessions: 120,
    tags: ["Resume", "Interview Prep", "Job Search"],
  },
  {
    id: "3",
    name: "Dr. Aisha Patel",
    specialty: "Tech Leadership",
    bio: "Former FAANG engineer turned coach. Breaking barriers in tech for 10+ years.",
    avatar: "",
    rating: 5.0,
    sessions: 200,
    tags: ["Tech Careers", "Promotion", "Salary Negotiation"],
  },
  {
    id: "4",
    name: "Jennifer Chen",
    specialty: "Entrepreneurship",
    bio: "3x founder helping women build businesses they love while maintaining work-life balance.",
    avatar: "",
    rating: 4.8,
    sessions: 95,
    tags: ["Startup", "Business Strategy", "Work-Life Balance"],
  },
];

export function FeaturedCoaches() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % FEATURED_COACHES.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + FEATURED_COACHES.length) % FEATURED_COACHES.length
    );
  };

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-brand-dark mb-4">
            Meet Our Coaches
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            World-class professionals dedicated to your success
          </p>
        </div>

        {/* Desktop: Grid View */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {FEATURED_COACHES.slice(0, 3).map((coach) => (
            <CoachCard key={coach.id} coach={coach} />
          ))}
        </div>

        {/* Mobile: Carousel */}
        <div className="md:hidden relative">
          <CoachCard coach={FEATURED_COACHES[currentIndex]} />

          {/* Carousel Controls */}
          <div className="flex justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              aria-label="Previous coach"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Button>

            <div className="flex items-center gap-2">
              {FEATURED_COACHES.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-brand-red w-8"
                      : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to coach ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              aria-label="Next coach"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
          </div>
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline">
            <Link href="/coaches">View All Coaches</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function CoachCard({ coach }: { coach: typeof FEATURED_COACHES[0] }) {
  return (
    <Card className="border-2 border-gray-100 hover:border-brand-red/30 transition-all duration-300 hover:shadow-xl group">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="h-16 w-16 border-2 border-brand-pink">
            <AvatarImage src={coach.avatar} alt={coach.name} />
            <AvatarFallback className="bg-brand-red text-white text-xl font-bold">
              {coach.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h3 className="font-heading text-xl font-bold text-brand-dark group-hover:text-brand-red transition-colors">
              {coach.name}
            </h3>
            <p className="text-brand-maroon font-semibold">{coach.specialty}</p>

            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(coach.rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {coach.rating} ({coach.sessions} sessions)
              </span>
            </div>
          </div>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{coach.bio}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {coach.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <Button asChild className="w-full group">
          <Link href={`/coaches/${coach.id}`}>
            Book Session
            <svg
              className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
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
      </CardContent>
    </Card>
  );
}
