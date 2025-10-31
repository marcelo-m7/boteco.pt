"use client";

import * as React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Check } from "lucide-react";

import { SpotlightCard } from "@/components/reactbits";

const PlansSection: React.FC = () => {
  const { t } = useTranslation("home");
  const { locale } = useParams<{ locale: string }>();
  const currentLocale = locale || "pt";

  const plans = t("plans.options", { returnObjects: true }) as Array<{
    name: string;
    price: string;
    features: string[];
  }>;

  const planCards = React.useMemo(
    () =>
      plans.map((plan, index) => ({
        id: `plan-${plan.name}-${index}`,
        name: plan.name,
        price: plan.price,
        features: plan.features,
        accent: (index % 2 === 0 ? "mustard" : "wine") as const,
      })),
    [plans],
  );

  return (
    <section className="w-full bg-boteco-beige-100 py-20 dark:bg-boteco-brown-900">
      <div className="container mx-auto flex max-w-5xl flex-col gap-12 px-4">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-boteco-brown-900 sm:text-4xl dark:text-boteco-beige-50">
            {t("plans.title")}
          </h2>
          <p className="mx-auto max-w-3xl text-base text-boteco-brown-700 sm:text-lg dark:text-boteco-beige-200/80">
            {t("plans.description")}
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {planCards.map((plan) => (
            <SpotlightCard
              key={plan.id}
              title={plan.name}
              description={plan.price}
              accent={plan.accent}
              cta={{ label: t("plans.cta"), href: `/${currentLocale}/contato` }}
            >
              <ul className="space-y-3 text-left text-sm text-boteco-brown-700 dark:text-boteco-beige-200/80">
                {plan.features.map((feature) => (
                  <li key={`${plan.id}-${feature}`} className="flex items-start gap-3">
                    <span className="mt-0.5 rounded-full bg-boteco-wine-500/10 p-1 text-boteco-wine-600 dark:bg-boteco-wine-500/20 dark:text-boteco-mustard-200">
                      <Check className="h-4 w-4" aria-hidden />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlansSection;
