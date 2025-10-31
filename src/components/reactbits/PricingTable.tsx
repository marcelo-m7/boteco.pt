import { AnimatedSection, AnimatedItem } from './animated';
import { depthCardClasses, type DepthLevel } from './depth';
import { cn } from '@/lib/utils';

export interface PricingFeature {
  name: string;
}

export interface PricingOption {
  name: string;
  price: string;
  description?: string;
  features: string[];
  highlighted?: boolean;
}

export interface ReactbitsPricingTableProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  options: PricingOption[];
  depth?: DepthLevel;
}

export const ReactbitsPricingTable = ({
  title,
  description,
  options,
  depth = 'overlay',
  className,
  ...props
}: ReactbitsPricingTableProps) => {
  return (
    <AnimatedSection
      className={cn('py-16', 'bg-depth-surface', className)}
      aria-labelledby={title ? 'pricing-heading' : undefined}
      {...props}
    >
      <div className="container mx-auto px-4">
        {(title || description) ? (
          <AnimatedItem className="text-center mb-12 space-y-4">
            {title ? (
              <h2 id="pricing-heading" className="text-3xl md:text-4xl font-semibold text-boteco-neutral">
                {title}
              </h2>
            ) : null}
            {description ? <p className="text-boteco-neutral/80 text-lg">{description}</p> : null}
          </AnimatedItem>
        ) : null}
        <div className="grid gap-6 md:grid-cols-2">
          {options.map((option, index) => (
            <AnimatedItem key={option.name} transition={{ delay: index * 0.08 }}>
              <article
                className={cn(
                  'flex h-full flex-col rounded-xl p-6',
                  depthCardClasses[depth],
                  option.highlighted ? 'ring-2 ring-boteco-secondary' : 'ring-1 ring-transparent',
                )}
                aria-label={option.name}
              >
                <header className="mb-4">
                  <h3 className="text-2xl font-semibold text-boteco-neutral">{option.name}</h3>
                  <p className="text-3xl font-bold text-boteco-primary mt-2">{option.price}</p>
                  {option.description ? (
                    <p className="text-boteco-neutral/80 mt-2">{option.description}</p>
                  ) : null}
                </header>
                <ul className="mt-4 space-y-2 text-boteco-neutral/90" aria-label={`${option.name} features`}>
                  {option.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span aria-hidden className="mt-1 h-2 w-2 rounded-full bg-boteco-secondary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </AnimatedItem>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};
