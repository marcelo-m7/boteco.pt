"use client";

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Lightbulb, Users, ShieldCheck } from 'lucide-react';
import Seo from '@/components/Seo';
import { motion, Variants, Easing } from 'framer-motion'; // Importar motion e Variants
import { ScrollStack } from '@reactbits/navigation';

const About: React.FC = () => {
  const { t, i18n } = useTranslation('about');

  const values = t('values', { returnObjects: true }) as string[];

  const pageTitle = t('title');
  const pageDescription = t('mission');

  // Variantes para as seções
  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeInOut" as Easing } },
  };

  // Variantes para os itens dentro das seções (cards, parágrafos)
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeInOut" as Easing } },
  };

  return (
    <>
      <Seo
        title={pageTitle}
        description={pageDescription}
        ogTitle={pageTitle}
        ogDescription={pageDescription}
        locale={i18n.language}
      />
      <div className="container mx-auto px-4 py-12">
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          className="text-4xl font-bold text-center mb-12 text-boteco-wine"
        >
          {t('title')}
        </motion.h1>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
          className="mb-12 text-center max-w-3xl mx-auto"
        >
          <motion.p variants={itemVariants} className="text-xl text-boteco-brown/90 mb-4">
            {t('mission')}
          </motion.p>
          <motion.p variants={itemVariants} className="text-lg text-boteco-brown/80">
            {t('vision')}
          </motion.p>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
          className="mb-12"
        >
          <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center mb-8 text-boteco-brown">
            {t('valuesTitle', { defaultValue: 'Nossos Valores' })}
          </motion.h2>
          <ScrollStack
            className="mx-auto max-w-4xl"
            listClassName="gap-8"
            itemClassName="bg-surface-gradient"
            itemActiveClassName="shadow-surface-strong ring-2 ring-boteco-mustard/40"
            ariaLabel={t('valuesTitle', { defaultValue: 'Nossos Valores' })}
            items={[
              {
                id: 'value-0',
                label: values[0],
                description: t('valueDescription1', {
                  defaultValue:
                    'Celebramos a individualidade e a riqueza das diferentes perspectivas.',
                }),
                icon: <Lightbulb className="h-12 w-12" aria-hidden />,
              },
              {
                id: 'value-1',
                label: values[1],
                description: t('valueDescription2', {
                  defaultValue:
                    'Buscamos constantemente novas formas de superar desafios e inovar.',
                }),
                icon: <ShieldCheck className="h-12 w-12" aria-hidden />,
              },
              {
                id: 'value-2',
                label: values[2],
                description: t('valueDescription3', {
                  defaultValue:
                    'Trabalhamos juntos, com honestidade, para alcançar nossos objetivos.',
                }),
                icon: <Users className="h-12 w-12" aria-hidden />,
              },
            ]}
            renderItem={({ item }) => (
              <div className="flex flex-col items-center gap-4 text-center">
                {React.isValidElement(item.icon) ? (
                  <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-boteco-wine/10 text-boteco-mustard">
                    {React.cloneElement(item.icon, { className: 'h-10 w-10' })}
                  </span>
                ) : null}
                <h3 className="text-xl font-semibold text-boteco-wine">{item.label}</h3>
                <p className="text-boteco-brown/80">{item.description}</p>
              </div>
            )}
          />
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
          className="max-w-4xl mx-auto text-boteco-brown"
        >
          <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center mb-8 text-boteco-brown">
            {t('storyTitle', { defaultValue: 'Nossa História' })}
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg leading-relaxed mb-6">
            {t('story')}
          </motion.p>
        </motion.section>
      </div>
    </>
  );
};

export default About;