import HeroSection from "@/components/modules/homepage/HeroSection";
import StatsSection from "@/components/modules/homepage/StatsSection";
import HowItWorksSection from "@/components/modules/homepage/HowItWorksSection";
import FeaturedTutorsSection from "@/components/modules/homepage/FeaturedTutorsSection";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <StatsSection />
      <HowItWorksSection />
      <FeaturedTutorsSection />
    </div>
  );
}
