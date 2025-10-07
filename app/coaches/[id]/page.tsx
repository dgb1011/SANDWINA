import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";

// Mock data - will be replaced with Supabase query
const MOCK_COACHES: Record<string, any> = {
  "janani-kulasingam": {
    id: "janani-kulasingam",
    name: "Janani Kulasingam",
    title: "ICF-certified Success Coach and Consultant",
    bio: "Janani Kulasingam is an ICF-certified Success Coach and Consultant with over 15 years of experience empowering professionals to achieve their goals through strategic planning and personal development.",
    longBio: "With a background in corporate leadership and entrepreneurship, Janani brings a unique perspective to career coaching. She specializes in helping women break through glass ceilings, negotiate salaries, and build fulfilling careers that align with their values and ambitions.",
    avatar: "",
    specialties: ["Executive Leadership", "Career Strategy", "Salary Negotiation"],
    yearsExperience: 15,
    rating: 5.0,
    sessionsCompleted: 150,
    education: [
      "ICF Certified Professional Coach",
      "MBA, Harvard Business School",
      "BA Psychology, Stanford University",
    ],
    approach: "I believe in a holistic, strengths-based approach that empowers you to leverage your unique talents while developing new skills. Together, we'll create a personalized roadmap for your career success.",
    testimonials: [
      {
        client: "Sarah M.",
        role: "Senior Product Manager",
        quote: "Janani helped me negotiate a 30% salary increase and transition into a leadership role. Her strategic approach is transformative.",
      },
    ],
  },
};

export default function CoachProfilePage({ params }: { params: { id: string } }) {
  const coach = MOCK_COACHES[params.id];

  if (!coach) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="grid md:grid-cols-[200px_1fr] gap-8 mb-12">
            {/* Avatar */}
            <div>
              <Avatar className="h-48 w-48 border-4 border-brand-pink">
                <AvatarImage src={coach.avatar} alt={coach.name} />
                <AvatarFallback className="bg-brand-red text-white text-5xl font-bold">
                  {coach.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Details */}
            <div>
              <h1 className="font-heading text-4xl font-bold text-brand-dark mb-2">
                {coach.name}
              </h1>
              <p className="text-xl text-brand-maroon font-semibold mb-4">
                {coach.title}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {coach.specialties.map((specialty: string) => (
                  <Badge key={specialty} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-semibold">{coach.rating}</span>
                  <span className="text-gray-600">({coach.sessionsCompleted} sessions)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
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
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{coach.yearsExperience} years experience</span>
                </div>
              </div>

              <Button asChild size="lg" className="w-full md:w-auto">
                <Link href="/login">Book a Session</Link>
              </Button>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              {/* About */}
              <Card>
                <CardHeader>
                  <CardTitle>About {coach.name.split(" ")[0]}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">{coach.bio}</p>
                  <p className="text-gray-700 leading-relaxed">{coach.longBio}</p>
                </CardContent>
              </Card>

              {/* Approach */}
              <Card>
                <CardHeader>
                  <CardTitle>Coaching Approach</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed italic">
                    "{coach.approach}"
                  </p>
                </CardContent>
              </Card>

              {/* Testimonials */}
              <Card>
                <CardHeader>
                  <CardTitle>Client Testimonials</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {coach.testimonials.map((testimonial: any, index: number) => (
                    <div key={index} className="border-l-4 border-brand-red pl-4">
                      <p className="text-gray-700 italic mb-2">"{testimonial.quote}"</p>
                      <p className="text-sm text-gray-600">
                        — {testimonial.client}, {testimonial.role}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Pricing */}
              <Card className="border-2 border-brand-red">
                <CardHeader>
                  <CardTitle>Session Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-3xl font-bold text-brand-red mb-1">$150</div>
                    <div className="text-sm text-gray-600">per 45-minute session</div>
                  </div>
                  <Button asChild className="w-full" size="lg">
                    <Link href="/login">Book Now</Link>
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    Package discounts available
                  </p>
                </CardContent>
              </Card>

              {/* Education */}
              <Card>
                <CardHeader>
                  <CardTitle>Education & Credentials</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {coach.education.map((edu: string, index: number) => (
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
                        <span className="text-gray-700">{edu}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Specialties */}
              <Card>
                <CardHeader>
                  <CardTitle>Specializations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {coach.specialties.map((specialty: string) => (
                      <Badge key={specialty}>{specialty}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
