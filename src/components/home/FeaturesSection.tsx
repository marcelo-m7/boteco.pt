"use client";

import { useTranslation } from 'react-i18next';
import { ReactbitsFeatureGrid } from '@/components/reactbits/FeatureGrid';

const FeaturesSection: React.FC = () => {
  const { t } = useTranslation('home');

  const features = t('features', { returnObjects: true }) as { title: string; description: string }[];

  return (
    <ReactbitsFeatureGrid
      title={t('featuresTitle', { defaultValue: 'Nossas Funcionalidades' })}
      features={features}
      depth="overlay"
      columns={3}
    />
  );
};

export default FeaturesSection;
