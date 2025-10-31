import type { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const easing: [number, number, number, number] = [0.4, 0, 0.2, 1];

const sectionVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easing },
  },
};

export type AnimatedSectionProps = HTMLAttributes<HTMLElement>;

export const AnimatedSection = ({ className, children, ...props }: AnimatedSectionProps) => {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={sectionVariants}
      className={cn('w-full', className)}
      {...(props as Record<string, unknown>)}
    >
      {children}
    </motion.section>
  );
};

export const AnimatedItem = motion.div;
