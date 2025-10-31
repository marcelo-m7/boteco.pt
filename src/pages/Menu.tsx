"use client";

import * as React from 'react';
import { useTranslation } from 'react-i18next';

import Seo from '@/components/Seo';
import { DepthSurface } from '@/components/design';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  badges?: string[];
}

interface MenuCategory {
  id: string;
  name: string;
  description: string;
  items: MenuItem[];
}

interface TabbedMenuProps {
  categories: MenuCategory[];
  badges: Record<string, string>;
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  ariaLabel: string;
}

const TabbedMenu: React.FC<TabbedMenuProps> = ({
  categories,
  badges,
  activeCategory,
  onCategoryChange,
  ariaLabel,
}) => (
  <Tabs
    value={activeCategory}
    onValueChange={onCategoryChange}
    className="w-full"
  >
    <TabsList
      aria-label={ariaLabel}
      className="w-full justify-start gap-2 overflow-x-auto bg-transparent p-0"
    >
      {categories.map((category) => (
        <TabsTrigger
          key={category.id}
          value={category.id}
          className="rounded-full border border-boteco-beige/60 bg-background px-4 py-2 text-sm font-medium text-boteco-wine transition-colors hover:border-boteco-mustard hover:text-boteco-mustard dark:border-boteco-brown-700 dark:bg-boteco-brown-900/80 dark:text-boteco-beige-200 dark:hover:border-boteco-mustard-300 dark:hover:text-boteco-mustard-300"
        >
          {category.name}
        </TabsTrigger>
      ))}
    </TabsList>
    {categories.map((category) => (
      <TabsContent key={category.id} value={category.id} className="mt-6 space-y-6">
        <MenuCategorySection
          category={category}
          badges={badges}
          headingId={`tab-${category.id}`}
          hideHeading
        />
      </TabsContent>
    ))}
  </Tabs>
);

interface StickyCategoryListProps {
  categories: MenuCategory[];
  activeCategory: string;
  onSelect: (categoryId: string) => void;
  ariaLabel: string;
}

const StickyCategoryList: React.FC<StickyCategoryListProps> = ({
  categories,
  activeCategory,
  onSelect,
  ariaLabel,
}) => {
  const handleClick = React.useCallback(
    (categoryId: string) => () => {
      onSelect(categoryId);
      if (typeof window !== 'undefined') {
        const section = document.getElementById(`menu-${categoryId}`);
        section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [onSelect],
  );

  return (
    <nav aria-label={ariaLabel} className="hidden lg:block">
      <ul className="sticky top-28 space-y-2">
        {categories.map((category) => {
          const isActive = category.id === activeCategory;

          return (
            <li key={category.id}>
              <button
                type="button"
                onClick={handleClick(category.id)}
                className={cn(
                  'w-full rounded-full border px-4 py-2 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-boteco-mustard focus-visible:ring-offset-2 dark:focus-visible:ring-offset-boteco-brown-900',
                  isActive
                    ? 'border-boteco-mustard bg-boteco-mustard/10 text-boteco-mustard dark:border-boteco-mustard-300 dark:text-boteco-mustard-300'
                    : 'border-transparent bg-background/70 text-boteco-brown hover:border-boteco-mustard/60 hover:text-boteco-mustard dark:bg-boteco-brown-900/80 dark:text-boteco-beige-200 dark:hover:border-boteco-mustard-300 dark:hover:text-boteco-mustard-300',
                )}
                aria-current={isActive ? 'true' : undefined}
              >
                {category.name}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

interface MenuCategorySectionProps {
  category: MenuCategory;
  badges: Record<string, string>;
  headingId: string;
  hideHeading?: boolean;
}

const MenuCategorySection: React.FC<MenuCategorySectionProps> = ({
  category,
  badges,
  headingId,
  hideHeading,
}) => (
  <section id={`menu-${category.id}`} aria-labelledby={headingId} className="space-y-5">
    <div className={cn('space-y-1', hideHeading && 'sr-only')}>
      <h2
        id={headingId}
        className="text-2xl font-semibold text-boteco-wine dark:text-boteco-mustard-200"
      >
        {category.name}
      </h2>
      <p className="text-sm text-boteco-brown/80 dark:text-boteco-beige-300/80">
        {category.description}
      </p>
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      {category.items.map((item) => (
        <DepthSurface
          key={item.id}
          depth={200}
          interactive
          className="h-full rounded-2xl border border-boteco-beige/60 bg-background/80 p-6 transition-transform dark:border-boteco-brown-700 dark:bg-boteco-brown-900/80"
        >
          <article className="flex h-full flex-col justify-between" aria-labelledby={`menu-item-${item.id}`}>
            <div className="space-y-3">
              <header className="flex items-start justify-between gap-4">
                <div>
                  <h3
                    id={`menu-item-${item.id}`}
                    className="text-lg font-semibold text-boteco-wine dark:text-boteco-mustard-200"
                  >
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm text-boteco-brown/80 dark:text-boteco-beige-300/80">
                    {item.description}
                  </p>
                </div>
                <span className="whitespace-nowrap text-base font-semibold text-boteco-mustard dark:text-boteco-mustard-300">
                  {item.price}
                </span>
              </header>
              {item.badges && item.badges.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.badges.map((badge) => (
                    <Badge
                      key={`${item.id}-${badge}`}
                      variant="secondary"
                      className="bg-boteco-wine/10 text-boteco-wine dark:bg-boteco-mustard-300/15 dark:text-boteco-mustard-200"
                    >
                      {badges[badge] ?? badge}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </article>
        </DepthSurface>
      ))}
    </div>
  </section>
);

const Menu: React.FC = () => {
  const { t, i18n } = useTranslation('menu');

  const categories = React.useMemo(() => {
    const data = t('categories', { returnObjects: true }) as unknown;
    return Array.isArray(data) ? (data as MenuCategory[]) : [];
  }, [i18n.language]);

  const badges = React.useMemo(() => {
    const data = t('badges', { returnObjects: true }) as unknown;
    return data && typeof data === 'object' && !Array.isArray(data)
      ? (data as Record<string, string>)
      : {};
  }, [i18n.language]);
  const heroTitle = t('hero.title');
  const heroSubtitle = t('hero.subtitle');
  const navigationLabel = t('navigationLabel');
  const tabsLabel = t('tabsLabel');
  const notice = t('notice');

  const [activeCategory, setActiveCategory] = React.useState<string>(
    categories[0]?.id ?? '',
  );

  React.useEffect(() => {
    if (categories.length > 0) {
      setActiveCategory((currentCategory) => {
        if (currentCategory && categories.find((category) => category.id === currentCategory)) {
          return currentCategory;
        }
        return categories[0]?.id ?? '';
      });
    }
  }, [categories]);

  const pageTitle = `${heroTitle} | ${t('title')}`;
  const pageDescription = heroSubtitle;

  return (
    <>
      <Seo
        title={pageTitle}
        description={pageDescription}
        ogTitle={pageTitle}
        ogDescription={pageDescription}
        locale={i18n.language}
      />
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <header className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-boteco-mustard dark:text-boteco-mustard-200">
            {t('title')}
          </p>
          <h1 className="mt-3 text-4xl font-bold text-boteco-wine dark:text-boteco-mustard-100">
            {heroTitle}
          </h1>
          <p className="mt-4 text-lg text-boteco-brown/90 dark:text-boteco-beige-200/90">
            {heroSubtitle}
          </p>
        </header>

        <div className="lg:hidden">
          <TabbedMenu
            categories={categories}
            badges={badges}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            ariaLabel={tabsLabel}
          />
        </div>

        <div className="hidden gap-10 lg:grid lg:grid-cols-[220px,1fr]">
          <StickyCategoryList
            categories={categories}
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
            ariaLabel={navigationLabel}
          />
          <div className="space-y-12">
            {categories.map((category) => (
              <MenuCategorySection
                key={category.id}
                category={category}
                badges={badges}
                headingId={`section-${category.id}`}
              />
            ))}
          </div>
        </div>

        <p className="mt-12 rounded-2xl border border-boteco-beige/60 bg-boteco-mustard/10 p-6 text-sm text-boteco-brown dark:border-boteco-brown-700 dark:bg-boteco-brown-900/80 dark:text-boteco-beige-200">
          {notice}
        </p>
      </div>
    </>
  );
};

export default Menu;
