"use client";

import * as React from "react";
import { useTranslation } from "react-i18next";

import { DepthSurface } from "@/components/design";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FaqSection: React.FC = () => {
  const { t } = useTranslation("home");

  const items = t("faq.items", { returnObjects: true }) as Array<{
    question: string;
    answer: string;
  }>;

  return (
    <section className="w-full bg-boteco-beige-100 py-20 dark:bg-boteco-brown-900">
      <div className="container mx-auto flex max-w-4xl flex-col gap-10 px-4">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-boteco-brown-900 sm:text-4xl dark:text-boteco-beige-50">
            {t("faq.title")}
          </h2>
          <p className="mx-auto max-w-3xl text-base text-boteco-brown-700 sm:text-lg dark:text-boteco-beige-200/80">
            {t("sections.faq.subtitle")}
          </p>
        </div>
        <DepthSurface depth={200} className="rounded-3xl bg-boteco-beige-50 p-6 dark:bg-boteco-brown-800">
          <Accordion type="single" collapsible className="space-y-3">
            {items.map((item, index) => (
              <AccordionItem key={`${item.question}-${index}`} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-base font-semibold text-boteco-brown-800 dark:text-boteco-beige-50">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-boteco-brown-700 dark:text-boteco-beige-200/80">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </DepthSurface>
      </div>
    </section>
  );
};

export default FaqSection;
