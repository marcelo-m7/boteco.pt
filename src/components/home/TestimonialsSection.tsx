"use client";

import { useTranslation } from 'react-i18next';
import { ReactbitsTestimonialCarousel } from '@/components/reactbits/TestimonialCarousel';

const TestimonialsSection: React.FC = () => {
  const { t } = useTranslation('home');
  const testimonials = t('testimonials.quotes', { returnObjects: true }) as { text: string; author: string }[];

  return (
    <ReactbitsTestimonialCarousel
      title={t('testimonials.title')}
      testimonials={testimonials}
      depth="overlay"
    />
  );
};

export default TestimonialsSection;
