"use client";

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { motion, Variants, Easing } from 'framer-motion';
import { ScrollStack } from '@reactbits/navigation';

const PlansSection: React.FC = () => {
  const { t } = useTranslation('home');

  const plans = t('plans.options', { returnObjects: true }) as { name: string; price: string; features: string[] }[];

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
        <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4 text-boteco-brown">
          {t('plans.title')}
        </motion.h2>
        <motion.p variants={itemVariants} className="text-lg text-boteco-brown/80 mb-12">
          {t('plans.description')}
        </motion.p>
        <ScrollStack
          className="mx-auto max-w-4xl"
          ariaLabel={t('plans.title')}
          items={plans.map((plan, index) => ({
            id: `plan-${index}`,
            label: plan.name,
            description: plan.price,
            meta: plan.features,
          }))}
          listClassName="gap-8"
          itemClassName="bg-surface-gradient"
          itemActiveClassName="shadow-surface-strong ring-2 ring-boteco-mustard/40"
          renderItem={({ item }) => (
            <div className="flex flex-col gap-5 text-left">
              <div>
                <h3 className="text-3xl font-bold text-boteco-wine">{item.label}</h3>
                <p className="text-2xl font-semibold text-boteco-brown/90">{item.description}</p>
              </div>
              <ul className="space-y-2 text-boteco-brown/80">
                {Array.isArray(item.meta)
                  ? item.meta.map((feature: string, featureIndex: number) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-boteco-mustard" aria-hidden />
                        <span>{feature}</span>
                      </li>
                    ))
                  : null}
              </ul>
              <Button className="mt-2 w-full bg-boteco-mustard text-boteco-mustard-foreground transition-transform duration-150 hover:bg-boteco-mustard/90 focus-visible:ring-boteco-mustard/70">
                {t('plans.choosePlan', { defaultValue: 'Escolher Plano' })}
              </Button>
            </div>
          )}
        />
      </div>
    </motion.section>
  );
};

export default PlansSection;