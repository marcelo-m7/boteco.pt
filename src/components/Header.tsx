import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { SignedIn, UserButton } from '@clerk/clerk-react';
import { ThemeToggle } from './ThemeToggle';
import MobileNav from './MobileNav'; // Importar MobileNav
import { useIsMobile } from '@/hooks/use-mobile'; // Importar useIsMobile
import { CardNav } from '@reactbits/navigation';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { locale } = useParams<{ locale: string }>();
  const currentLocale = locale || 'pt';
  const isMobile = useIsMobile();
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);
  const location = useLocation();

  const getLocalizedPath = React.useCallback(
    (path: string) => `/${currentLocale}${path}`,
    [currentLocale],
  );

  const sanitize = React.useCallback((value?: string) => {
    if (!value) {
      return undefined;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }, []);

  const navItems = React.useMemo(
    () => [
      {
        id: 'home',
        label: t('home:hero.title', { ns: 'home' }).split(':')[0],
        description: sanitize(t('home:hero.subtitle', {
          ns: 'home',
          defaultValue: t('home:hero.description', {
            ns: 'home',
            defaultValue: t('home:hero.tagline', { ns: 'home', defaultValue: '' }),
          }),
        })),
        component: Link,
        componentProps: {
          to: getLocalizedPath('/'),
        },
      },
      {
        id: 'about',
        label: t('about:title', { ns: 'about' }),
        description: sanitize(t('about:subtitle', { ns: 'about', defaultValue: '' })),
        component: Link,
        componentProps: {
          to: getLocalizedPath('/sobre'),
        },
      },
      {
        id: 'contact',
        label: t('contact:title', { ns: 'contact' }),
        description: sanitize(t('contact:subtitle', { ns: 'contact', defaultValue: '' })),
        component: Link,
        componentProps: {
          to: getLocalizedPath('/contato'),
        },
      },
      {
        id: 'blog',
        label: t('blog:title', { ns: 'blog' }),
        description: sanitize(t('blog:subtitle', { ns: 'blog', defaultValue: '' })),
        component: Link,
        componentProps: {
          to: getLocalizedPath('/blog'),
        },
      },
      {
        id: 'dashboard',
        label: t('painel:title', { ns: 'painel' }),
        description: sanitize(t('painel:subtitle', { ns: 'painel', defaultValue: '' })),
        component: Link,
        componentProps: {
          to: '/painel',
        },
      },
    ],
    [getLocalizedPath, sanitize, t],
  );

  const activeNavId = React.useMemo(() => {
    const currentPath = location.pathname;

    const found = navItems.find((item) => {
      const target =
        typeof item.componentProps?.to === 'string'
          ? item.componentProps.to
          : typeof item.componentProps?.to === 'object' && 'pathname' in item.componentProps.to
            ? (item.componentProps.to as { pathname: string }).pathname
            : item.componentProps?.href ?? item.href;

      return target === currentPath;
    });

    return found?.id;
  }, [location.pathname, navItems]);

  return (
    <header className="bg-boteco-wine text-boteco-wine-foreground p-4 shadow-surface">
      <div className="container mx-auto flex justify-between items-center">
        <Link to={getLocalizedPath('/')} className="text-2xl font-bold">
          Boteco Pro
        </Link>
        
        {isMobile ? (
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <MobileNav isOpen={isMobileNavOpen} onOpenChange={setIsMobileNavOpen} />
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <CardNav
              aria-label={t('navigation.primary', {
                defaultValue: 'Navegação principal',
              })}
              className="max-w-3xl"
              wrap
              items={navItems.map((item) => ({
                ...item,
                componentProps: {
                  ...item.componentProps,
                  className: [item.componentProps?.className, 'w-full'].filter(Boolean).join(' '),
                },
              }))}
              activeId={activeNavId}
            />
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <ThemeToggle />
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;