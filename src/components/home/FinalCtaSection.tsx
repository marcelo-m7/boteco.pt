"use client";

import * as React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { SpotlightCard } from "@/components/reactbits";

const FinalCtaSection: React.FC = () => {
  const { t } = useTranslation("home");
  const { locale } = useParams<{ locale: string }>();
  const currentLocale = locale || "pt";

  return (
    <section className="w-full bg-gradient-to-b from-boteco-beige-200 via-boteco-beige-100 to-boteco-beige-50 py-24 dark:from-boteco-brown-800 dark:via-boteco-brown-900 dark:to-boteco-brown-900/90">
      <div className="container mx-auto max-w-4xl px-4">
        <SpotlightCard
          title={t("finalCta.title")}
          description={t("finalCta.subtitle")}
          accent="wine"
          cta={{ label: t("finalCta.button"), href: `/${currentLocale}/contato` }}
        />
      </div>
    </section>
  );
};

export default FinalCtaSection;
