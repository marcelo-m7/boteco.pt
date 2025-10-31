"use client";

import * as React from "react";
import { useTranslation } from "react-i18next";

import { BentoTestimonials } from "@/components/reactbits";

const accentSequence = ["wine", "mustard", "neutral"] as const;

const TestimonialsSection: React.FC = () => {
  const { t } = useTranslation("home");

  const quotes = t("testimonials.quotes", { returnObjects: true }) as Array<{
    text: string;
    author: string;
  }>;

  const testimonials = React.useMemo(
    () =>
      quotes.map((quote, index) => ({
        id: `testimonial-${quote.author}-${index}`,
        quote: quote.text,
        author: quote.author,
        accent: accentSequence[index % accentSequence.length],
      })),
    [quotes],
  );

  return (
    <section className="w-full bg-boteco-beige-50 py-20 dark:bg-boteco-brown-900/80">
      <div className="container mx-auto flex max-w-5xl flex-col gap-10 px-4">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-boteco-brown-900 sm:text-4xl dark:text-boteco-beige-50">
            {t("testimonials.title")}
          </h2>
          <p className="mx-auto max-w-3xl text-base text-boteco-brown-700 sm:text-lg dark:text-boteco-beige-200/80">
            {t("sections.testimonials.subtitle")}
          </p>
        </div>
        <BentoTestimonials testimonials={testimonials} />
      </div>
    </section>
  );
};

export default TestimonialsSection;
