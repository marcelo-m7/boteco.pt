import { AnimatedSection, AnimatedItem } from './animated';
import { depthCardClasses, type DepthLevel } from './depth';
import { cn } from '@/lib/utils';

export interface StepItem {
  title: string;
  description: string;
}

export interface ReactbitsStepperProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  steps: StepItem[];
  depth?: DepthLevel;
}

export const ReactbitsStepper = ({
  title,
  steps,
  depth = 'surface',
  className,
  ...props
}: ReactbitsStepperProps) => {
  return (
    <AnimatedSection
      className={cn('py-16', 'bg-depth-surface', className)}
      aria-labelledby={title ? 'stepper-heading' : undefined}
      {...props}
    >
      <div className="container mx-auto px-4">
        {title ? (
          <AnimatedItem>
            <h2 id="stepper-heading" className="text-3xl md:text-4xl font-semibold text-center text-boteco-neutral mb-12">
              {title}
            </h2>
          </AnimatedItem>
        ) : null}
        <ol className="space-y-6" aria-label={title}>
          {steps.map((step, index) => (
            <AnimatedItem key={step.title} transition={{ delay: index * 0.05 }}>
              <li>
                <article
                  className={cn(
                    'flex flex-col gap-2 rounded-xl p-6 sm:flex-row sm:items-start sm:gap-6',
                    depthCardClasses[depth],
                  )}
                >
                  <span
                    aria-hidden
                    className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-full bg-boteco-primary text-boteco-primary-foreground text-xl font-semibold"
                  >
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold text-boteco-neutral">{step.title}</h3>
                    <p className="text-boteco-neutral/80 leading-relaxed">{step.description}</p>
                  </div>
                </article>
              </li>
            </AnimatedItem>
          ))}
        </ol>
      </div>
    </AnimatedSection>
  );
};
