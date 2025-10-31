"use client";

import * as React from "react";
import { useTranslation } from "react-i18next";
import { BarChart3, LayoutGrid, ShoppingBasket } from "lucide-react";

import { BentoGrid } from "@/components/reactbits";

const featureIcons = [
  <LayoutGrid key="layout" className="h-8 w-8" aria-hidden />,
  <ShoppingBasket key="inventory" className="h-8 w-8" aria-hidden />,
  <BarChart3 key="reports" className="h-8 w-8" aria-hidden />,
];

const FeatureSection: React.FC = () => {
  const { t } = useTranslation("home");

  const features = t("features", { returnObjects: true }) as Array<{
    title: string;
    description: string;
  }>;

  const items = React.useMemo(
    () =>
      features.map((feature, index) => ({
        id: `feature-${feature.title}-${index}`,
        title: feature.title,
        description: feature.description,
        icon: featureIcons[index % featureIcons.length],
        accent: (index % 3 === 0 ? "wine" : index % 3 === 1 ? "mustard" : "neutral") as const,
        depth: (index % 2 === 0 ? 200 : 300) as const,
      })),
    [features],
  );

  return (
    <section className="w-full bg-boteco-beige-50 py-20 dark:bg-boteco-brown-900/80">
      <div className="container mx-auto flex max-w-5xl flex-col gap-10 px-4 text-center">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-boteco-brown-900 sm:text-4xl dark:text-boteco-beige-50">
            {t("sections.features.title")}
          </h2>
          <p className="mx-auto max-w-3xl text-base text-boteco-brown-700 sm:text-lg dark:text-boteco-beige-200/80">
            {t("sections.features.subtitle")}
          </p>
        </div>
        <BentoGrid items={items} columns={{ base: 1, md: 2, lg: 3 }} />
      </div>
    </section>
  );
};

export default FeatureSection;
