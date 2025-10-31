"use client";

import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle } from 'lucide-react';
import { motion, Variants, Easing } from 'framer-motion';
import { ScrollStack } from '@reactbits/navigation';

const FeaturesSection: React.FC = () => {
  const { t } = useTranslation('home');

  const features = t('features', { returnObjects: true }) as { title: string; description: string }[];

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeInOut" as Easing } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeInOut" as Easing } },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionVariants}
      className="w-full py-16 bg-surface-gradient bg-cover bg-center"
    >
      <div className="container mx-auto px-4 text-center">
        <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-12 text-boteco-brown">
          {t('featuresTitle', { defaultValue: 'Nossas Funcionalidades' })}
        </motion.h2>
        <ScrollStack
          ariaLabel={t('featuresTitle', { defaultValue: 'Nossas Funcionalidades' })}
          items={features.map((feature, index) => ({
            id: `feature-${index}`,
            label: feature.title,
            description: feature.description,
          }))}
          listClassName="gap-8"
          itemClassName="bg-surface-gradient"
          itemActiveClassName="shadow-surface-strong ring-2 ring-boteco-mustard/40"
          renderItem={({ item }) => (
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-boteco-wine/10 text-boteco-mustard">
                  <CheckCircle className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="text-xl font-semibold text-boteco-wine">{item.label}</h3>
              </div>
              <p className="text-boteco-brown/80">{item.description}</p>
            </div>
          )}
        />
      </div>
    </motion.section>
  );
};

export default FeaturesSection;