"use client";

import { useTranslation } from 'react-i18next';
import { ReactbitsPricingTable } from '@/components/reactbits/PricingTable';

const PlansSection: React.FC = () => {
  const { t } = useTranslation('home');

  const plans = t('plans.options', { returnObjects: true }) as {
    name: string;
    price: string;
    features: string[];
  }[];

  return (
    <ReactbitsPricingTable
      title={t('plans.title')}
      description={t('plans.description')}
      options={plans}
      depth="overlay"
    />
  );
};

export default PlansSection;
