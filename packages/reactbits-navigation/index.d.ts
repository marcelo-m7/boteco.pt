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

export interface ScrollStackItem extends ReactBitsNavItem {
  value?: React.ReactNode;
  media?: React.ReactNode;
  meta?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface ScrollStackRenderItemContext {
  item: ScrollStackItem;
  isActive: boolean;
  index: number;
  distance: number;
}

export interface ScrollStackProps
  extends Omit<BaseNavProps, "orientation" | "wrap" | "items" | "renderItem"> {
  items: ScrollStackItem[];
  defaultActiveId?: string;
  itemClassName?: string;
  itemActiveClassName?: string;
  focusOnHover?: boolean;
  ariaLabel?: string;
  renderItem?: (context: ScrollStackRenderItemContext) => React.ReactNode;
}

export const ScrollStack: React.ForwardRefExoticComponent<
  ScrollStackProps & React.RefAttributes<HTMLDivElement>
>;

export const getScrollStackItemId: (item: ScrollStackItem | undefined, index: number) => string;

export const resolveScrollStackActiveState: (
  items: ScrollStackItem[],
  candidateId?: string,
  defaultActiveId?: string,
) => { resolvedId: string | undefined; index: number };

export const getNextScrollStackIndex: (
  items: ScrollStackItem[],
  currentIndex: number,
  delta: number,
) => number;

