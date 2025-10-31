"use client";

import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { ReactbitsHero } from '@/components/reactbits/Hero';

const HeroSection: React.FC = () => {
  const { t } = useTranslation('home');
  const { locale } = useParams<{ locale: string }>();
  const currentLocale = locale || 'pt';

  const getLocalizedPath = (path: string) => `/${currentLocale}${path}`;

  return (
    <ReactbitsHero
      title={t('hero.title')}
      subtitle={t('hero.subtitle')}
      cta={{ label: t('hero.cta'), href: getLocalizedPath('/contato') }}
      backgroundVariant="gradient"
      depth="surface"
    />
  );
};

export default HeroSection;
