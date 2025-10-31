"use client";

import * as React from "react";

import { DepthSurface, DepthLevel } from "@/components/design";
import { cn } from "@/lib/utils";

export type BentoGridItem = {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  badge?: string;
  accent?: "wine" | "mustard" | "neutral";
  depth?: DepthLevel;
  footer?: React.ReactNode;
  className?: string;
};

export type BentoGridProps = React.HTMLAttributes<HTMLDivElement> & {
  items: BentoGridItem[];
  columns?: { base: number; md?: number; lg?: number };
};

const accentBackground: Record<NonNullable<BentoGridItem["accent"]>, string> = {
  wine: "bg-gradient-to-br from-boteco-wine-500/10 via-boteco-wine-500/5 to-transparent",
  mustard: "bg-gradient-to-br from-boteco-mustard-500/10 via-boteco-mustard-500/5 to-transparent",
  neutral: "bg-gradient-to-br from-boteco-beige-500/10 via-boteco-beige-400/5 to-transparent",
};

const COLUMN_CLASS_MAP: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
};

export const BentoGrid = React.forwardRef<HTMLDivElement, BentoGridProps>(
  ({ items, columns = { base: 1, md: 2, lg: 3 }, className, ...props }, ref) => {
    const gridTemplate = cn(
      "grid gap-6",
      COLUMN_CLASS_MAP[columns.base] ?? "grid-cols-1",
      columns.md ? `md:${COLUMN_CLASS_MAP[columns.md] ?? "grid-cols-2"}` : undefined,
      columns.lg ? `lg:${COLUMN_CLASS_MAP[columns.lg] ?? "grid-cols-3"}` : undefined,
    );

    return (
      <div ref={ref} className={cn(gridTemplate, className)} {...props}>
        {items.map((item) => (
          <DepthSurface
            key={item.id}
            depth={item.depth ?? 200}
            interactive
            className={cn(
              "group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-transparent bg-boteco-beige-100 p-6 text-left transition-transform duration-500 ease-out",
              "dark:bg-boteco-brown-800",
              accentBackground[item.accent ?? "neutral"],
              item.className,
            )}
          >
            <div className="space-y-4">
              {item.badge ? (
                <span className="inline-flex items-center rounded-full bg-boteco-mustard-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-boteco-mustard-700 dark:bg-boteco-mustard-400/10 dark:text-boteco-mustard-200">
                  {item.badge}
                </span>
              ) : null}
              {item.icon ? (
                <div className="text-boteco-wine-500 dark:text-boteco-mustard-200" aria-hidden>
                  {item.icon}
                </div>
              ) : null}
              <h3 className="text-xl font-semibold text-boteco-brown-900 dark:text-boteco-beige-50">{item.title}</h3>
              <p className="text-sm leading-relaxed text-boteco-brown-700 dark:text-boteco-beige-200/80">
                {item.description}
              </p>
            </div>
            {item.footer ? <div className="mt-6 text-sm text-boteco-brown-600 dark:text-boteco-beige-300">{item.footer}</div> : null}
          </DepthSurface>
        ))}
      </div>
    );
  },
);

BentoGrid.displayName = "BentoGrid";

export default BentoGrid;
