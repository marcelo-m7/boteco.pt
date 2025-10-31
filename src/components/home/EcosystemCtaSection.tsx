import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import AnimatedSection, { AnimatedItem } from '@/components/reactbits/AnimatedSection';
import { Button } from '@/components/ui/button';

interface CtaAction {
  label: string;
  href: string;
  variant?: 'default' | 'outline' | 'secondary';
}

interface EcosystemContent {
  title: string;
  description: string;
  actions: CtaAction[];
}

const EcosystemCtaSection: React.FC = () => {
  const { t } = useTranslation('home');
  const { locale } = useParams<{ locale: string }>();
  const currentLocale = locale || 'pt';

  const localizePath = React.useCallback(
    (path: string) => {
      if (!path) {
        return `/${currentLocale}`;
      }

      if (path.startsWith('http')) {
        return path;
      }

      const normalized = path.startsWith('/') ? path : `/${path}`;
      return `/${currentLocale}${normalized}`;
    },
    [currentLocale],
  );

  const content = t('ecosystemCta', { returnObjects: true }) as EcosystemContent;

  if (!content?.actions?.length) {
    return null;
  }

  return (
    <AnimatedSection
      depth="surface"
      containerClassName="flex flex-col items-center gap-6 text-center"
      className="w-full"
    >
      <AnimatedItem as="h2" className="text-3xl font-bold text-boteco-neutral md:text-4xl">
        {content.title}
      </AnimatedItem>
      <AnimatedItem as="p" className="max-w-2xl text-lg text-boteco-neutral/80">
        {content.description}
      </AnimatedItem>
      <AnimatedItem className="flex flex-wrap justify-center gap-4">
        {content.actions.map((action) => (
          <Button
            key={action.label}
            asChild
            size="lg"
            variant={action.variant ?? 'default'}
            depth={action.variant === 'outline' ? 'none' : 'overlay'}
            className={
              action.variant === 'outline'
                ? 'border-boteco-primary text-boteco-primary hover:bg-boteco-primary/10'
                : ''
            }
          >
            <Link to={localizePath(action.href)}>{action.label}</Link>
          </Button>
        ))}
      </AnimatedItem>
    </AnimatedSection>
  );
};

export default EcosystemCtaSection;
