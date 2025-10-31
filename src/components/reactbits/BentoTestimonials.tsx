"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

import { DepthStack } from "@/components/design";
import { cn } from "@/lib/utils";

export type BentoTestimonial = {
  id: string;
  quote: string;
  author: string;
  accent?: "wine" | "mustard" | "neutral";
};

export type BentoTestimonialsProps = React.HTMLAttributes<HTMLDivElement> & {
  testimonials: BentoTestimonial[];
};

const accentBackground: Record<NonNullable<BentoTestimonial["accent"]>, string> = {
  wine: "bg-gradient-to-br from-boteco-wine-500/10 via-boteco-wine-500/5 to-transparent",
  mustard: "bg-gradient-to-br from-boteco-mustard-500/10 via-boteco-mustard-500/5 to-transparent",
  neutral: "bg-gradient-to-br from-boteco-beige-500/10 via-boteco-beige-400/5 to-transparent",
};

const animationVariants = {
  initial: { y: 0 },
  hover: { y: -6 },
};

export const BentoTestimonials: React.FC<BentoTestimonialsProps> = ({ testimonials, className, ...props }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
      {...props}
    >
      {testimonials.map((testimonial, index) => (
        <motion.div
          key={testimonial.id}
          initial="initial"
          whileHover={prefersReducedMotion ? undefined : "hover"}
          whileTap={prefersReducedMotion ? undefined : "hover"}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          variants={animationVariants}
        >
          <DepthStack
            depth={index % 2 === 0 ? 200 : 300}
            layers={3}
            layerOffset={6}
            interactive
            className={cn(
              "h-full rounded-3xl border border-transparent p-6 text-left shadow-lg",
              accentBackground[testimonial.accent ?? "neutral"],
              "bg-boteco-beige-100 dark:bg-boteco-brown-800",
            )}
          >
            <figure className="flex h-full flex-col justify-between gap-6">
              <blockquote className="text-base leading-relaxed text-boteco-brown-800 dark:text-boteco-beige-50">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="text-sm font-semibold uppercase tracking-wide text-boteco-wine-600 dark:text-boteco-mustard-200">
                {testimonial.author}
              </figcaption>
            </figure>
          </DepthStack>
        </motion.div>
      ))}
    </div>
  );
};

export default BentoTestimonials;
