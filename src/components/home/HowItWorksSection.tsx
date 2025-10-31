"use client";

import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, Variants, Easing } from 'framer-motion';
import { ScrollStack } from '@reactbits/navigation';

const HowItWorksSection: React.FC = () => {
  const { t } = useTranslation('home');

  const howItWorksSteps = t('howItWorks.steps', { returnObjects: true }) as { title: string; description: string }[];

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
          {t('howItWorks.title')}
        </motion.h2>
        <ScrollStack
          ariaLabel={t('howItWorks.title')}
          items={howItWorksSteps.map((step, index) => ({
            id: `how-it-works-${index}`,
            label: step.title,
            description: step.description,
          }))}
          listClassName="gap-8"
          itemClassName="bg-surface-gradient"
          itemActiveClassName="shadow-surface-strong ring-2 ring-boteco-mustard/40"
          renderItem={({ item, index }) => (
            <div className="flex flex-col items-center gap-4 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-boteco-mustard text-lg font-bold text-boteco-mustard-foreground shadow-surface">
                {index + 1}
              </span>
              <h3 className="text-xl font-semibold text-boteco-brown">{item.label}</h3>
              <p className="text-boteco-brown/80">{item.description}</p>
            </div>
          )}
        />
      </div>
    </motion.section>
  );
};

export default HowItWorksSection;