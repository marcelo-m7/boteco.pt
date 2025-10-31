import type { ReactNode } from 'react';
import { AnimatedSection, AnimatedItem } from './animated';
import { depthCardClasses, type DepthLevel } from './depth';
import { cn } from '@/lib/utils';

export interface FeatureItem {
  title: string;
  description: string;
  icon?: ReactNode;
}

export interface ReactbitsFeatureGridProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  features: FeatureItem[];
  depth?: DepthLevel;
  columns?: 1 | 2 | 3;
}

export const ReactbitsFeatureGrid = ({
  title,
  features,
  depth = 'overlay',
  columns = 3,
  className,
  ...props
}: ReactbitsFeatureGridProps) => {
  const gridColumns = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
  }[columns];

  return (
    <AnimatedSection
      className={cn('py-16', 'bg-depth-surface', className)}
      aria-labelledby={title ? 'feature-grid-heading' : undefined}
      {...props}
    >
      <div className="container mx-auto px-4">
        {title ? (
          <AnimatedItem>
            <h2 id="feature-grid-heading" className="text-3xl md:text-4xl font-semibold text-center text-boteco-neutral mb-12">
              {title}
            </h2>
          </AnimatedItem>
        ) : null}
        <div className={cn('grid gap-8', gridColumns)}>
          {features.map((feature, index) => (
            <AnimatedItem key={feature.title} transition={{ delay: index * 0.05 }}>
              <article
                className={cn(
                  'h-full rounded-lg p-6 text-left transition-transform duration-300 hover:-translate-y-1 focus-within:-translate-y-1',
                  depthCardClasses[depth],
                )}
                tabIndex={-1}
              >
                <header className="flex items-center gap-3 mb-4 text-boteco-neutral">
                  {feature.icon ? <span className="text-boteco-secondary" aria-hidden>{feature.icon}</span> : null}
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </header>
                <p className="text-boteco-neutral/80 leading-relaxed">{feature.description}</p>
              </article>
            </AnimatedItem>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};
