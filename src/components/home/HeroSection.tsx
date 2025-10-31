"use client";

import * as React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { HeroParallax, HeroParallaxCard } from "@/components/reactbits";

const accentSequence: HeroParallaxCard["accent"][] = ["wine", "mustard", "beige"];

const HeroSection: React.FC = () => {
  const { t } = useTranslation("home");
  const { locale } = useParams<{ locale: string }>();
  const currentLocale = locale || "pt";

  const features = t("features", { returnObjects: true }) as Array<{
    title: string;
    description: string;
  }>;

  const steps = t("howItWorks.steps", { returnObjects: true }) as Array<{
    title: string;
    description: string;
  }>;

  const parallaxCards = React.useMemo<HeroParallaxCard[]>(() => {
    const combined = [...features, ...steps];
    return combined.map((item, index) => ({
      id: `${index}-${item.title}`,
      title: item.title,
      description: item.description,
      accent: accentSequence[index % accentSequence.length],
      depth: (index % 3 === 0 ? 300 : index % 3 === 1 ? 200 : 100) as HeroParallaxCard["depth"],
    }));
  }, [features, steps]);

  return (
    <HeroParallax
      title={t("hero.title")}
      subtitle={t("hero.subtitle")}
      primaryCta={{
        label: t("hero.cta"),
        href: `/${currentLocale}/contato`,
      }}
      secondaryCta={{
        label: t("hero.demoButton"),
        href: "https://app.boteco.pt",
        external: true,
      }}
      cards={parallaxCards}
      badge={t("hero.badge", { defaultValue: "Boteco Pro" })}
    />
  );
};

export default HeroSection;
