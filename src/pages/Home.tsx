import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Seo from '@/components/Seo';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import SolutionsSection from '@/components/home/SolutionsSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import PlansSection from '@/components/home/PlansSection';
import PlatformCarouselSection from '@/components/home/PlatformCarouselSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import FaqSection from '@/components/home/FaqSection';
import EcosystemCtaSection from '@/components/home/EcosystemCtaSection';
import FinalCtaSection from '@/components/home/FinalCtaSection';

const Home = () => {
  const { t, i18n } = useTranslation('home');
  const { locale } = useParams<{ locale: string }>();
  const currentLocale = locale || 'pt';

  const pageTitle = t('hero.title');
  const pageDescription = t('hero.subtitle');

  return (
    <>
      <Seo
        title={pageTitle}
        description={pageDescription}
        ogTitle={pageTitle}
        ogDescription={pageDescription}
        locale={i18n.language}
      />
      <div className="flex flex-col items-stretch">
        <HeroSection />
        <FeaturesSection />
        <SolutionsSection />
        <HowItWorksSection />
        <PlansSection />
        <PlatformCarouselSection />
        <TestimonialsSection />
        <FaqSection />
        <EcosystemCtaSection />
        <FinalCtaSection />
      </div>
    </>
  );
};

export default Home;