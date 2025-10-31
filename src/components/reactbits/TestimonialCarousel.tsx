import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { AnimatedSection, AnimatedItem } from './animated';
import { depthCardClasses, type DepthLevel } from './depth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type CarouselApi = NonNullable<ReturnType<typeof useEmblaCarousel>[1]>;

export interface TestimonialItem {
  text: string;
  author: string;
}

export interface ReactbitsTestimonialCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  testimonials: TestimonialItem[];
  depth?: DepthLevel;
}

export const ReactbitsTestimonialCarousel = ({
  title,
  testimonials,
  depth = 'overlay',
  className,
  ...props
}: ReactbitsTestimonialCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback((api: CarouselApi) => {
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi?.off('select', onSelect);
      emblaApi?.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <AnimatedSection
      className={cn('py-16 bg-depth-surface', className)}
      aria-labelledby={title ? 'testimonial-heading' : undefined}
      {...props}
    >
      <div className="container mx-auto px-4">
        {title ? (
          <AnimatedItem>
            <h2 id="testimonial-heading" className="text-3xl md:text-4xl font-semibold text-center text-boteco-neutral mb-10">
              {title}
            </h2>
          </AnimatedItem>
        ) : null}
        <div className="relative" aria-live="polite">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.author} className="min-w-0 flex-[0_0_100%] px-2">
                  <AnimatedItem transition={{ delay: index * 0.05 }}>
                    <blockquote
                      className={cn(
                        'h-full rounded-xl p-6 text-center md:text-left flex flex-col justify-between gap-6',
                        depthCardClasses[depth],
                      )}
                    >
                      <p className="text-lg italic text-boteco-neutral/80">“{testimonial.text}”</p>
                      <footer className="text-right font-semibold text-boteco-primary">— {testimonial.author}</footer>
                    </blockquote>
                  </AnimatedItem>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex justify-center gap-4" role="group" aria-label="testimonial navigation">
            <Button
              type="button"
              variant="ghost"
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canScrollPrev}
              depth="overlay"
              className="rounded-full p-2"
            >
              <ArrowLeft aria-hidden className="h-5 w-5" />
              <span className="sr-only">Anterior</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canScrollNext}
              depth="overlay"
              className="rounded-full p-2"
            >
              <ArrowRight aria-hidden className="h-5 w-5" />
              <span className="sr-only">Próximo</span>
            </Button>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};
