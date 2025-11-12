import { HeroSection } from '@/components/landing/hero-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { ComparisonSection } from '@/components/landing/comparison-section';
import { UseCasesSection } from '@/components/landing/use-cases-section';
import { ClosingCtaSection } from '@/components/landing/closing-cta-section';
import DemoSection from '@/components/landing/demo-section';


export default function LandingPage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeaturesSection />
      <DemoSection />
      <ComparisonSection />
      <UseCasesSection />
      <ClosingCtaSection />
    </div>
  );
}
