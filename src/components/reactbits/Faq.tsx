import { AnimatedSection, AnimatedItem } from './animated';
import { type DepthLevel } from './depth';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ReactbitsFaqProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  items: FaqItem[];
  depth?: DepthLevel;
}

export const ReactbitsFaq = ({
  title,
  items,
  depth = 'overlay',
  className,
  ...props
}: ReactbitsFaqProps) => {
  return (
    <AnimatedSection
      className={cn('py-16 bg-depth-surface', className)}
      aria-labelledby={title ? 'faq-heading' : undefined}
      {...props}
    >
      <div className="container mx-auto px-4">
        {title ? (
          <AnimatedItem>
            <h2 id="faq-heading" className="text-3xl md:text-4xl font-semibold text-center text-boteco-neutral mb-12">
              {title}
            </h2>
          </AnimatedItem>
        ) : null}
        <Accordion type="single" collapsible className="mx-auto max-w-3xl space-y-2">
          {items.map((item, index) => (
            <AccordionItem key={item.question} value={`item-${index}`} depth={depth}>
              <AccordionTrigger className="text-left text-lg font-semibold text-boteco-neutral">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-boteco-neutral/80 leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </AnimatedSection>
  );
};
