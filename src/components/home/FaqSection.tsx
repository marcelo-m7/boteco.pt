"use client";

import { useTranslation } from 'react-i18next';
import { ReactbitsFaq } from '@/components/reactbits/Faq';

const FaqSection: React.FC = () => {
  const { t } = useTranslation('home');
  const faqItems = t('faq.items', { returnObjects: true }) as { question: string; answer: string }[];

  return (
    <ReactbitsFaq
      title={t('faq.title')}
      items={faqItems}
      depth="overlay"
    />
  );
};

export default FaqSection;
