import { Navigation } from "@/components/landing/Navigation";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ValueProps } from "@/components/landing/ValueProps";
import { FeaturedCoaches } from "@/components/landing/FeaturedCoaches";
import { Testimonials } from "@/components/landing/Testimonials";
import { PricingSection } from "@/components/landing/PricingSection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <HowItWorks />
      <ValueProps />
      <FeaturedCoaches />
      <Testimonials />
      <PricingSection />
      <FinalCTA />
      <Footer />
    </main>
  );
}
