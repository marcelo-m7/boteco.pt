"use client";

import { useTranslation } from 'react-i18next';
import { ReactbitsStepper } from '@/components/reactbits/Stepper';

const HowItWorksSection: React.FC = () => {
  const { t } = useTranslation('home');
  const steps = t('howItWorks.steps', { returnObjects: true }) as { title: string; description: string }[];

  return (
    <ReactbitsStepper
      title={t('howItWorks.title')}
      steps={steps}
      depth="surface"
    />
  );
};

export default HowItWorksSection;
