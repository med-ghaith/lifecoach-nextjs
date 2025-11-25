import HeroSection from "@/components/home/hero-section";
import AboutSection from "@/components/home/about-section";
import PricingSection from "@/components/home/pricing-section";
import SpecializationsSection from "@/components/home/specializations-section";
import TestimonialsSection from "@/components/home/TestimonialsSection";

export default function HomePage() {
  return (
    <div className="pt-16">
      <HeroSection />
      <AboutSection />
      <SpecializationsSection />
      <TestimonialsSection />
      <PricingSection />
    </div>
  );
}
