import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Hero } from '@/components/reactbits';

const HeroSection = () => {
  const { t } = useTranslation('home');
  const { locale } = useParams<{ locale: string }>();
  const currentLocale = locale || 'pt';

  const getLocalizedPath = (path: string) => `/${currentLocale}${path}`;

  return (
    <Hero
      title={t('hero.title')}
      subtitle={t('hero.subtitle')}
      action={{ label: t('hero.cta'), href: getLocalizedPath('/contato') }}
      depth="overlay"
    />
  );
};

export default HeroSection;