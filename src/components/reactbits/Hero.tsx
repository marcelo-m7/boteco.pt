import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AnimatedSection, AnimatedItem } from './animated';
import { depthBackgroundClasses, type DepthLevel } from './depth';

export interface HeroCta {
  label: string;
  href: string;
  ariaLabel?: string;
}

export interface ReactbitsHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  depth?: DepthLevel;
  backgroundVariant?: 'gradient' | 'solid';
  cta?: HeroCta;
}

export const ReactbitsHero = ({
  title,
  subtitle,
  depth = 'surface',
  backgroundVariant = 'gradient',
  cta,
  className,
  ...props
}: ReactbitsHeroProps) => {
  return (
    <AnimatedSection
      className={cn(
        'py-16 sm:py-24 lg:py-28 text-center',
        backgroundVariant === 'gradient'
          ? 'bg-gradient-to-r from-boteco-primary to-boteco-secondary text-boteco-primary-foreground'
          : depthBackgroundClasses[depth],
        className,
      )}
      aria-labelledby="home-hero-heading"
      {...props}
    >
      <div className="container mx-auto px-4">
        <AnimatedItem transition={{ delay: 0.05 }}>
          <h1 id="home-hero-heading" className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            {title}
          </h1>
        </AnimatedItem>
        {subtitle ? (
          <AnimatedItem transition={{ delay: 0.1 }}>
            <p className="text-lg md:text-2xl mb-8 max-w-3xl mx-auto text-balance">
              {subtitle}
            </p>
          </AnimatedItem>
        ) : null}
        {cta ? (
          <AnimatedItem transition={{ delay: 0.15 }}>
            <Button
              asChild
              size="lg"
              depth={backgroundVariant === 'gradient' ? 'surface' : depth}
              className="bg-boteco-tertiary text-boteco-neutral hover:bg-boteco-tertiary/80 hover:text-boteco-neutral"
              aria-label={cta.ariaLabel ?? cta.label}
            >
              <Link to={cta.href}>
                <span className="inline-flex items-center justify-center gap-2">
                  {cta.label}
                  <ArrowRight aria-hidden className="h-5 w-5" />
                </span>
              </Link>
            </Button>
          </AnimatedItem>
        ) : null}
      </div>
    </AnimatedSection>
  );
};
