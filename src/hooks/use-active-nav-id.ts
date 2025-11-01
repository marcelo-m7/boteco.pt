import React from 'react';

interface NavItem {
  id: string;
  componentProps?: {
    to?: string | { pathname: string };
    href?: string;
    [key: string]: unknown;
  };
  href?: string;
}

/**
 * Custom hook to determine the active navigation item ID based on current pathname
 * @param navItems Array of navigation items with id, href, and componentProps
 * @param pathname Current pathname from location
 * @returns The ID of the active nav item or undefined
 */
export function useActiveNavId(navItems: NavItem[], pathname: string): string | undefined {
  return React.useMemo(() => {
    const found = navItems.find((item) => {
      const target =
        typeof item.componentProps?.to === 'string'
          ? item.componentProps.to
          : typeof item.componentProps?.to === 'object' && 'pathname' in item.componentProps.to
            ? (item.componentProps.to as { pathname: string }).pathname
            : item.componentProps?.href ?? item.href;

      return target === pathname;
    });

    return found?.id;
  }, [navItems, pathname]);
}
