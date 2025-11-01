"use client";

import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import LanguageSwitcher from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { SignedIn, UserButton } from '@clerk/clerk-react';
import { BubbleMenu, cx } from '@reactbits/navigation';
import { useActiveNavId } from '@/hooks/use-active-nav-id';

interface MobileNavProps {
  onOpenChange: (open: boolean) => void;
  isOpen: boolean;
}

const MobileNav: React.FC<MobileNavProps> = ({ onOpenChange, isOpen }) => {
  const { t } = useTranslation();
  const { locale } = useParams<{ locale: string }>();
  const location = useLocation();
  const currentLocale = locale || 'pt';

  const getLocalizedPath = React.useCallback(
    (path: string) => `/${currentLocale}${path}`,
    [currentLocale],
  );

  const navItems = React.useMemo(
    () => [
      {
        id: 'home',
        label: t('home:hero.title', { ns: 'home' }).split(':')[0],
        component: Link,
        componentProps: {
          to: getLocalizedPath('/'),
        },
      },
      {
        id: 'about',
        label: t('about:title', { ns: 'about' }),
        component: Link,
        componentProps: {
          to: getLocalizedPath('/sobre'),
        },
      },
      {
        id: 'contact',
        label: t('contact:title', { ns: 'contact' }),
        component: Link,
        componentProps: {
          to: getLocalizedPath('/contato'),
        },
      },
      {
        id: 'blog',
        label: t('blog:title', { ns: 'blog' }),
        component: Link,
        componentProps: {
          to: getLocalizedPath('/blog'),
        },
      },
      {
        id: 'dashboard',
        label: t('painel:title', { ns: 'painel' }),
        component: Link,
        componentProps: {
          to: '/painel',
        },
      },
    ],
    [getLocalizedPath, t],
  );

  const activeNavId = useActiveNavId(navItems, location.pathname);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden text-boteco-wine-foreground hover:bg-boteco-wine/80 active:scale-98">
          <Menu className="h-6 w-6" />
          <span className="sr-only">{t('openMenu', { defaultValue: 'Abrir menu' })}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[250px] sm:w-[300px] bg-background flex flex-col">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold text-boteco-wine">Boteco Pro</SheetTitle>
        </SheetHeader>
        <BubbleMenu
          aria-label={t('navigation.mobile', { defaultValue: 'Navegação móvel' })}
          className="flex-grow"
          orientation="vertical"
          items={navItems.map((item) => ({
            ...item,
            componentProps: {
              ...item.componentProps,
              className: cx(item.componentProps?.className, 'w-full justify-start'),
            },
          }))}
          activeId={activeNavId}
          onSelect={() => onOpenChange(false)}
          listClassName="justify-start items-stretch"
        />
        <div className="flex flex-col space-y-4 mt-auto pb-4">
          <LanguageSwitcher />
          <ThemeToggle />
          <SignedIn>
            <div className="flex items-center justify-start">
              <UserButton afterSignOutUrl="/" />
              <span className="ml-2 text-foreground">{t('profile', { defaultValue: 'Perfil' })}</span>
            </div>
          </SignedIn>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;