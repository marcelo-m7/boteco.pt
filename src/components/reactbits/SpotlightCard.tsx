"use client";

import * as React from "react";

import { DepthSpotlight, DepthLevel } from "@/components/design";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export type SpotlightCardProps = {
  title: string;
  description?: string;
  cta?: { label: string; href: string; external?: boolean };
  depth?: DepthLevel;
  accent?: "wine" | "mustard" | "neutral";
  className?: string;
  children?: React.ReactNode;
};

const accentRing: Record<NonNullable<SpotlightCardProps["accent"]>, string> = {
  wine: "ring-boteco-wine-500/40",
  mustard: "ring-boteco-mustard-500/40",
  neutral: "ring-boteco-brown-400/30",
};

export const SpotlightCard = React.forwardRef<HTMLDivElement, SpotlightCardProps>(
  ({ title, description, cta, depth = 300, accent = "neutral", className, children }, ref) => {
    return (
      <DepthSpotlight
        ref={ref}
        depth={depth}
        className={cn(
          "relative isolate overflow-hidden rounded-3xl border border-transparent bg-boteco-beige-100 p-8 text-left shadow-xl",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "ring-1 ring-inset",
          accentRing[accent],
          "dark:bg-boteco-brown-800",
          className,
        )}
        spotlightOpacity={0.22}
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-2xl font-semibold tracking-tight text-boteco-brown-900 dark:text-boteco-beige-50">{title}</h3>
            {description ? (
              <p className="max-w-2xl text-base leading-relaxed text-boteco-brown-700 dark:text-boteco-beige-200/80">
                {description}
              </p>
            ) : null}
          </div>
          {children}
          {cta ? (
            <div>
              <Button
                asChild
                size="lg"
                className="bg-boteco-mustard-500 text-boteco-mustard-foreground hover:bg-boteco-mustard-500/90"
              >
                {cta.external ? (
                  <a href={cta.href} target="_blank" rel="noreferrer">
                    {cta.label}
                  </a>
                ) : (
                  <Link to={cta.href}>{cta.label}</Link>
                )}
              </Button>
            </div>
          ) : null}
        </div>
      </DepthSpotlight>
    );
  },
);

SpotlightCard.displayName = "SpotlightCard";

export default SpotlightCard;
