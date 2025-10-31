"use client";

import * as React from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

import { DepthStack } from "@/components/design";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type HeroParallaxCard = {
  id: string;
  title: string;
  description: string;
  accent?: "wine" | "mustard" | "beige";
  depth?: 100 | 200 | 300;
};

export type HeroParallaxProps = {
  title: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string; external?: boolean };
  cards: HeroParallaxCard[];
  badge?: string;
  className?: string;
};

const accentClassNames: Record<NonNullable<HeroParallaxCard["accent"]>, string> = {
  wine: "from-boteco-wine-500/10 via-boteco-wine-500/5 to-transparent border-boteco-wine-400/40",
  mustard: "from-boteco-mustard-500/10 via-boteco-mustard-500/5 to-transparent border-boteco-mustard-400/50",
  beige: "from-boteco-beige-500/15 via-boteco-beige-500/10 to-transparent border-boteco-brown-400/40",
};

const splitIntoColumns = (cards: HeroParallaxCard[], columns: number) => {
  const initialColumns = Array.from({ length: columns }, () => [] as HeroParallaxCard[]);

  return cards.reduce<HeroParallaxCard[][]>((acc, card, index) => {
    const columnIndex = index % columns;
    acc[columnIndex].push(card);
    return acc;
  }, initialColumns);
};

export const HeroParallax: React.FC<HeroParallaxProps> = ({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  cards,
  badge,
  className,
}) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const firstColumnOffset = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const secondColumnOffset = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const thirdColumnOffset = useTransform(scrollYProgress, [0, 1], [0, -40]);

  const transforms = React.useMemo(
    () => [firstColumnOffset, secondColumnOffset, thirdColumnOffset],
    [firstColumnOffset, secondColumnOffset, thirdColumnOffset],
  );

  const cardColumns = React.useMemo(() => splitIntoColumns(cards, 3), [cards]);

  return (
    <section
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden bg-gradient-to-b from-boteco-beige-50 via-boteco-beige-100 to-boteco-beige-200",
        "dark:from-boteco-brown-900 dark:via-boteco-brown-900/90 dark:to-boteco-brown-800",
        "py-24 sm:py-32 lg:py-40",
        className,
      )}
    >
      <div className="container mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-16 lg:gap-20">
        <div className="flex flex-col gap-6 text-left">
          <div className="space-y-4">
            {badge ? (
              <p className="inline-flex items-center rounded-full bg-boteco-wine-500/10 px-3 py-1 text-sm font-medium text-boteco-wine-700 dark:bg-boteco-wine-400/10 dark:text-boteco-mustard-200">
                {badge}
              </p>
            ) : null}
            <h1 className="text-4xl font-bold tracking-tight text-boteco-brown-900 sm:text-5xl lg:text-6xl dark:text-boteco-beige-100">
              {title}
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-boteco-brown-700 sm:text-xl dark:text-boteco-beige-300">
              {subtitle}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-boteco-wine-500 text-boteco-wine-foreground hover:bg-boteco-wine-500/90">
              <Link to={primaryCta.href}>
                <span className="flex items-center gap-2">
                  {primaryCta.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-boteco-mustard-500/30 bg-boteco-beige-100 text-boteco-brown-800 hover:bg-boteco-beige-200 dark:border-boteco-mustard-400/40 dark:bg-boteco-brown-800 dark:text-boteco-beige-100"
            >
              {secondaryCta.external ? (
                <a href={secondaryCta.href} target="_blank" rel="noreferrer">
                  <span className="flex items-center gap-2">
                    {secondaryCta.label}
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </span>
                </a>
              ) : (
                <Link to={secondaryCta.href}>
                  <span className="flex items-center gap-2">
                    {secondaryCta.label}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </Link>
              )}
            </Button>
          </div>
        </div>
        <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cardColumns.map((column, columnIndex) => (
            <motion.div
              key={`parallax-column-${columnIndex}`}
              style={{ y: prefersReducedMotion ? 0 : transforms[columnIndex] }}
              className={cn("flex flex-col gap-6", columnIndex === 1 && "hidden sm:flex")}
              aria-hidden
            >
              {column.map((card) => (
                <DepthStack
                  key={card.id}
                  depth={card.depth ?? 200}
                  layers={3}
                  layerOffset={5}
                  interactive
                  className={cn(
                    "rounded-2xl bg-gradient-to-br p-6 text-left shadow-lg transition-transform duration-500 ease-out",
                    card.accent ? accentClassNames[card.accent] : accentClassNames.beige,
                  )}
                >
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-boteco-brown-900 dark:text-boteco-beige-50">
                      {card.title}
                    </h3>
                    <p className="text-sm text-boteco-brown-700 dark:text-boteco-beige-200/80">{card.description}</p>
                  </div>
                </DepthStack>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

HeroParallax.displayName = "HeroParallax";

export default HeroParallax;
