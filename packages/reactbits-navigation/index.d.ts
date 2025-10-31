import * as React from "react";

export interface ReactBitsNavItem {
  id?: string;
  label: string;
  description?: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
  component?: React.ElementType<unknown>;
  componentProps?: Record<string, unknown>;
  isActive?: boolean;
}

export interface BaseNavProps extends Omit<React.HTMLAttributes<HTMLElement>, "onSelect"> {
  items: ReactBitsNavItem[];
  orientation?: "horizontal" | "vertical";
  activeId?: string;
  onSelect?: (item: ReactBitsNavItem, event: React.MouseEvent<HTMLElement>) => void;
  renderItem?: (context: { item: ReactBitsNavItem; isCurrent: boolean }) => React.ReactNode;
  listClassName?: string;
  wrap?: boolean;
}

export type CardNavProps = BaseNavProps;

export const CardNav: React.ForwardRefExoticComponent<
  CardNavProps & React.RefAttributes<HTMLElement>
>;

export interface BubbleMenuProps extends BaseNavProps {
  wrap?: boolean;
}

export const BubbleMenu: React.ForwardRefExoticComponent<
  BubbleMenuProps & React.RefAttributes<HTMLElement>
>;

export const createNavItem: (overrides?: Partial<ReactBitsNavItem>) => ReactBitsNavItem;

