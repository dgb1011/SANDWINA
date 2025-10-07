"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data - will be replaced with Supabase query in Sprint 2
const MOCK_COACHES = [
  {
    id: "janani-kulasingam",
    name: "Janani Kulasingam",
    title: "ICF-certified Success Coach",
    bio: "Janani Kulasingam, ICF-certified Success Coach and Consultant, empowers professionals to achieve their goals through strategic planning and personal development.",
    avatar: "",
    specialties: ["Executive Leadership", "Career Strategy"],
    rating: 5.0,
    sessionsCompleted: 150,
  },
  {
    id: "bridget-lohrius",
    name: "Bridget Lohrius",
    title: "Founder & Executive Coach",
    bio: "Bridget Lohrius (She/Her) is the Founder of a leadership development practice focused on empowering women in executive roles.",
    avatar: "",
    specialties: ["Executive Coaching", "Leadership Development"],
    rating: 4.9,
    sessionsCompleted: 200,
  },
  {
    id: "azalia-speight",
    name: "Azalia Speight",
    title: "Certified Professional Strengths Coach",
    bio: "Azalia is a Certified Professional Strengths Coach helping women identify and leverage their unique talents for career success.",
    avatar: "",
    specialties: ["Strengths Coaching", "Personal Development"],
    rating: 5.0,
    sessionsCompleted: 180,
  },
  {
    id: "julie-bronsteatter",
    name: "Julie Bronsteatter",
    title: "Certified Professional Coach",
    bio: "Julie is a certified professional coach with expertise in helping women navigate career transitions and workplace challenges.",
    avatar: "",
    specialties: ["Career Transitions", "Workplace Strategy"],
    rating: 4.8,
    sessionsCompleted: 120,
  },
  {
    id: "theresa-hammond",
    name: "Theresa Hammond",
    title: "Career & Life Coach",
    bio: "Theresa Hammond is a coach with over 15 years of experience helping women achieve work-life balance and career fulfillment.",
    avatar: "",
    specialties: ["Work-Life Balance", "Career Fulfillment"],
    rating: 4.9,
    sessionsCompleted: 165,
  },
  {
    id: "jeshanna-forrister",
    name: "Jeshanna Forrister",
    title: "Professional Development Coach",
    bio: "Jeshanna is a dedicated professional with a passion for empowering women to reach their full potential in their careers.",
    avatar: "",
    specialties: ["Professional Development", "Career Growth"],
    rating: 4.7,
    sessionsCompleted: 95,
  },
];

export function CoachGrid() {
  return (
    <div>
      <div className="mb-6">
        <p className="text-gray-600">
          Showing <span className="font-semibold">{MOCK_COACHES.length}</span> certified coaches
        </p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {MOCK_COACHES.map((coach) => (
          <CoachCard key={coach.id} coach={coach} />
        ))}
      </div>
    </div>
  );
}

function CoachCard({ coach }: { coach: typeof MOCK_COACHES[0] }) {
  return (
    <Link href={`/coaches/${coach.id}`}>
      <Card className="border-2 border-gray-200 hover:border-brand-red/50 transition-all duration-300 hover:shadow-xl cursor-pointer h-full">
        <CardContent className="p-6 flex flex-col items-center text-center">
          {/* Avatar */}
          <Avatar className="h-32 w-32 mb-4 border-4 border-brand-pink">
            <AvatarImage src={coach.avatar} alt={coach.name} />
            <AvatarFallback className="bg-brand-red text-white text-3xl font-bold">
              {coach.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          {/* Name & Title */}
          <h3 className="font-heading text-xl font-bold text-brand-dark mb-1">
            {coach.name}
          </h3>
          <p className="text-sm text-brand-maroon font-semibold mb-3">
            {coach.title}
          </p>

          {/* Bio */}
          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
            {coach.bio}
          </p>

          {/* Rating & Sessions */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="flex items-center">
              <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="ml-1 font-semibold">{coach.rating}</span>
            </div>
            <span>•</span>
            <span>{coach.sessionsCompleted} sessions</span>
          </div>

          {/* View Profile CTA */}
          <div className="mt-4 pt-4 border-t border-gray-200 w-full">
            <span className="text-brand-red font-semibold hover:text-brand-maroon transition-colors">
              View Profile →
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
