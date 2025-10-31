"use client";

import * as React from "react";
import { useTranslation } from "react-i18next";
import { CalendarClock, Sparkle, Workflow } from "lucide-react";

import { BentoGrid } from "@/components/reactbits";

const stepIcons = [
  <Sparkle key="start" className="h-8 w-8" aria-hidden />,
  <Workflow key="configure" className="h-8 w-8" aria-hidden />,
  <CalendarClock key="launch" className="h-8 w-8" aria-hidden />,
];

const HowItWorksSection: React.FC = () => {
  const { t } = useTranslation("home");

  const steps = t("howItWorks.steps", { returnObjects: true }) as Array<{
    title: string;
    description: string;
  }>;

  const items = React.useMemo(
    () =>
      steps.map((step, index) => ({
        id: `step-${step.title}-${index}`,
        title: step.title,
        description: step.description,
        icon: stepIcons[index % stepIcons.length],
        badge: t("sections.howItWorks.step", { step: index + 1 }),
        accent: (index % 2 === 0 ? "mustard" : "wine") as const,
        depth: (index % 2 === 0 ? 300 : 200) as const,
        className: index === steps.length - 1 ? "md:col-span-2 lg:col-span-1" : undefined,
      })),
    [steps, t],
  );

  return (
    <section className="w-full bg-gradient-to-b from-boteco-beige-100 via-boteco-beige-50 to-boteco-beige-100 py-20 dark:from-boteco-brown-900 dark:via-boteco-brown-900/95 dark:to-boteco-brown-800">
      <div className="container mx-auto flex max-w-5xl flex-col gap-10 px-4 text-center">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-boteco-brown-900 sm:text-4xl dark:text-boteco-beige-50">
            {t("howItWorks.title")}
          </h2>
          <p className="mx-auto max-w-3xl text-base text-boteco-brown-700 sm:text-lg dark:text-boteco-beige-200/80">
            {t("sections.howItWorks.subtitle")}
          </p>
        </div>
        <BentoGrid items={items} columns={{ base: 1, md: 3 }} />
      </div>
    </section>
  );
};

export default HowItWorksSection;
