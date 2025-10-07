import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { CoachGrid } from "@/components/coaches/CoachGrid";
import { CoachFilters } from "@/components/coaches/CoachFilters";

export const metadata = {
  title: "Browse Our Certified Coaches | SANDWINA",
  description: "Find your perfect career coach from our network of certified, vetted professionals specializing in women's career advancement.",
};

export default function CoachesPage() {
  return (
    <main className="min-h-screen bg-brand-pink">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Left: Filters Sidebar */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <CoachFilters />
          </aside>

          {/* Right: Coach Grid */}
          <div>
            <CoachGrid />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
