import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import HowItWorksSection from '../components/home/HowItWorksSection';

function HomePage() {
  return (
    <div className="space-y-12">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
    </div>
  );
}

export default HomePage; 