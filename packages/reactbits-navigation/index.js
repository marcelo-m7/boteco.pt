import * as React from "react";
import { motion } from "framer-motion";

const cx = (...classes) => classes.filter(Boolean).join(" ");

const isRenderableItem = (item) => item && typeof item === "object";

export const getScrollStackItemId = (item, index) => {
  if (!isRenderableItem(item)) {
    return `item-${index}`;
  }

  return item.id || item.href || `item-${index}`;
};

export const resolveScrollStackActiveState = (
  items = [],
  candidateId,
  defaultActiveId,
) => {
  if (!Array.isArray(items) || items.length === 0) {
    return { resolvedId: undefined, index: -1 };
  }

  const fallbackId = getScrollStackItemId(items[0], 0);
  const preferredId =
    typeof candidateId === "string"
      ? candidateId
      : typeof defaultActiveId === "string"
        ? defaultActiveId
        : fallbackId;

  const matchIndex = items.findIndex(
    (item, idx) => getScrollStackItemId(item, idx) === preferredId,
  );

  if (matchIndex === -1) {
    return { resolvedId: fallbackId, index: 0 };
  }

  return { resolvedId: preferredId, index: matchIndex };
};

export const getNextScrollStackIndex = (items = [], currentIndex, delta) => {
  if (!Array.isArray(items) || items.length === 0) {
    return -1;
  }

  if (typeof currentIndex !== "number" || Number.isNaN(currentIndex)) {
    return 0;
  }

  const nextIndex = currentIndex + delta;

  if (nextIndex < 0) {
    return 0;
  }

  if (nextIndex >= items.length) {
    return items.length - 1;
  }

  return nextIndex;
};

const BaseNav = React.forwardRef(
  (
    {
      as: Component = "nav",
      items,
      className,
      listClassName,
      orientation = "horizontal",
      onSelect,
      activeId,
      renderItem,
      wrap = false,
      itemVariant = "card",
      ...props
    },
    ref
  ) => {
    const direction = orientation === "vertical" ? "flex-col" : "flex-row";
    const shouldWrap = wrap ? "flex-wrap" : "flex-nowrap";

    return React.createElement(
      Component,
      {
        ref,
        className: cx("relative", className),
        ...props,
      },
      React.createElement(
        "ul",
        {
          className: cx("flex gap-3", direction, shouldWrap, listClassName),
          role: "list",
        },
        items.map((item) => {
          if (!item || typeof item !== "object") {
            return null;
          }

          const {
            id,
            label,
            description,
            icon,
            badge,
            disabled,
            component,
            componentProps = {},
            href,
            isActive,
          } = item;

          const isCurrent =
            typeof activeId !== "undefined" ? id === activeId : Boolean(isActive);

          const ItemComponent = component || "a";

          const handleClick = (event) => {
            if (disabled) {
              event.preventDefault();
              return;
            }

            if (typeof componentProps.onClick === "function") {
              componentProps.onClick(event);
            }

            if (typeof onSelect === "function") {
              onSelect(item, event);
            }
          };

          const sharedClasses =
            itemVariant === "bubble"
              ? "rounded-full border border-boteco-wine/20 bg-boteco-beige text-boteco-brown shadow-sm hover:shadow-md"
              : "rounded-2xl border border-boteco-wine/10 bg-boteco-beige/80 text-boteco-brown shadow-sm hover:shadow-lg";

          const activeClasses =
            itemVariant === "bubble"
              ? "bg-boteco-wine text-boteco-wine-foreground"
              : "bg-boteco-wine text-boteco-wine-foreground";

          const focusClasses =
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-boteco-mustard focus-visible:ring-offset-2 focus-visible:ring-offset-background";

          const disabledClasses = "opacity-60 cursor-not-allowed";

          const finalClassName = cx(
            "group relative flex items-center justify-between transition-all duration-200",
            itemVariant === "bubble"
              ? "px-4 py-2 text-sm font-semibold"
              : "p-4 text-left",
            sharedClasses,
            isCurrent && activeClasses,
            disabled && disabledClasses,
            focusClasses,
            componentProps.className,
          );

          const ariaLabel = description ? `${label}. ${description}` : label;

          const heading = React.createElement(
            "div",
            {
              className: cx(
                "flex items-center gap-3",
                itemVariant === "bubble" && "justify-center w-full",
              ),
              "data-slot": "item-heading",
            },
            icon
              ? React.createElement(
                  "span",
                  { className: "text-lg", "aria-hidden": true },
                  icon,
                )
              : null,
            React.createElement(
              "span",
              {
                className: cx(
                  "font-semibold tracking-wide",
                  itemVariant === "bubble" ? "text-sm" : "text-base",
                ),
              },
              label,
            ),
          );

          const descriptionNode =
            itemVariant !== "bubble" && description
              ? React.createElement(
                  "p",
                  {
                    className: "mt-2 text-sm text-boteco-brown/80",
                    "data-slot": "item-description",
                  },
                  description,
                )
              : null;

          const badgeNode = badge
            ? React.createElement(
                "span",
                {
                  className:
                    "ml-auto inline-flex items-center rounded-full bg-boteco-mustard px-2 py-0.5 text-xs font-medium text-boteco-mustard-foreground",
                  "data-slot": "item-badge",
                },
                badge,
              )
            : null;

          const content =
            typeof renderItem === "function"
              ? renderItem({ item, isCurrent })
              : React.createElement(
                  React.Fragment,
                  null,
                  heading,
                  descriptionNode,
                  badgeNode,
                );

          const finalProps = {
            ...componentProps,
            className: finalClassName,
            href: ItemComponent === "a" ? href : componentProps.href,
            role: "link",
            tabIndex: disabled ? -1 : 0,
            "aria-label": ariaLabel,
            "aria-current": isCurrent ? "page" : undefined,
            "aria-disabled": disabled || undefined,
            onClick: handleClick,
          };

          return React.createElement(
            "li",
            { key: id ?? href ?? label, className: "flex" },
            React.createElement(ItemComponent, finalProps, content),
          );
        }),
      ),
    );
  },
);

BaseNav.displayName = "ReactBitsNav";

export const CardNav = React.forwardRef((props, ref) =>
  React.createElement(BaseNav, { ...props, ref, itemVariant: "card" }),
);

CardNav.displayName = "ReactBitsCardNav";

export const BubbleMenu = React.forwardRef((props, ref) =>
  React.createElement(BaseNav, {
    ...props,
    ref,
    itemVariant: "bubble",
    wrap: true,
    orientation: props?.orientation ?? "horizontal",
  }),
);

BubbleMenu.displayName = "ReactBitsBubbleMenu";

export const createNavItem = (overrides = {}) => ({
  id: "",
  label: "",
  description: undefined,
  href: undefined,
  icon: undefined,
  badge: undefined,
  disabled: false,
  component: undefined,
  componentProps: undefined,
  isActive: false,
  ...overrides,
});

export const ScrollStack = React.forwardRef(
  (
    {
      items = [],
      className,
      listClassName,
      itemClassName,
      itemActiveClassName,
      activeId,
      defaultActiveId,
      onSelect,
      renderItem,
      focusOnHover = true,
      ariaLabel,
      style,
      ...props
    },
    forwardedRef,
  ) => {
    const containerRef = React.useRef(null);

    const setRefs = React.useCallback(
      (node) => {
        containerRef.current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef],
    );

    const controlledId = typeof activeId === "string" ? activeId : undefined;

    const initialState = React.useMemo(
      () => resolveScrollStackActiveState(items, controlledId, defaultActiveId),
      [items, controlledId, defaultActiveId],
    );

    const [uncontrolledId, setUncontrolledId] = React.useState(() => {
      if (controlledId) {
        return undefined;
      }

      return initialState.resolvedId;
    });

    const candidateId = controlledId ?? uncontrolledId;

    const { resolvedId: resolvedActiveId, index: activeIndex } = React.useMemo(
      () => resolveScrollStackActiveState(items, candidateId, defaultActiveId),
      [items, candidateId, defaultActiveId],
    );

    React.useEffect(() => {
      if (controlledId) {
        return;
      }

      if (!items.length) {
        setUncontrolledId(undefined);
        return;
      }

      if (!uncontrolledId || uncontrolledId !== resolvedActiveId) {
        setUncontrolledId(resolvedActiveId);
      }
    }, [controlledId, items, uncontrolledId, resolvedActiveId]);

    const moveSelection = React.useCallback(
      (targetIndex, event) => {
        if (!items.length) {
          return;
        }

        const baseIndex = activeIndex === -1 ? 0 : activeIndex;
        const delta = targetIndex - baseIndex;
        const clampedIndex = getNextScrollStackIndex(items, baseIndex, delta);
        const nextItem = items[clampedIndex];

        if (!nextItem) {
          return;
        }

        const nextId = getScrollStackItemId(nextItem, clampedIndex);

        if (!controlledId) {
          setUncontrolledId(nextId);
        }

        if (typeof onSelect === "function") {
          onSelect(nextItem, event);
        }
      },
      [items, activeIndex, controlledId, onSelect],
    );

    const handleKeyDown = React.useCallback(
      (event) => {
        if (!items.length) {
          return;
        }

        if (
          event.key === "ArrowDown" ||
          event.key === "ArrowRight"
        ) {
          event.preventDefault();
          moveSelection(activeIndex + 1, event);
          return;
        }

        if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
          event.preventDefault();
          moveSelection(activeIndex - 1, event);
          return;
        }

        if (event.key === "Home") {
          event.preventDefault();
          moveSelection(0, event);
          return;
        }

        if (event.key === "End") {
          event.preventDefault();
          moveSelection(items.length - 1, event);
          return;
        }

        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          moveSelection(activeIndex, event);
        }
      },
      [items, activeIndex, moveSelection],
    );

    React.useEffect(() => {
      if (!containerRef.current || !resolvedActiveId) {
        return;
      }

      const activeElement = containerRef.current.querySelector(
        `[data-rb-scrollstack-item="${resolvedActiveId}"]`,
      );

      if (activeElement && typeof activeElement.scrollIntoView === "function") {
        activeElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "nearest",
        });
      }
    }, [resolvedActiveId, items.length]);

    const baseContainerStyle = React.useMemo(
      () => ({
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        perspective: "1600px",
        scrollBehavior: "smooth",
      }),
      [],
    );

    const listStyle = React.useMemo(
      () => ({
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        listStyle: "none",
        margin: 0,
        padding: 0,
      }),
      [],
    );

    return React.createElement(
      "div",
      {
        ...props,
        ref: setRefs,
        className: cx("rb-scrollstack", className),
        style: { ...baseContainerStyle, ...style },
        role: "listbox",
        tabIndex: 0,
        "aria-label": ariaLabel,
        "aria-activedescendant": resolvedActiveId
          ? `scrollstack-${resolvedActiveId}`
          : undefined,
        onKeyDown: handleKeyDown,
      },
      React.createElement(
        "ul",
        {
          className: cx("rb-scrollstack__list", listClassName),
          style: listStyle,
          role: "presentation",
        },
        items.map((item, index) => {
          if (!isRenderableItem(item)) {
            return null;
          }

          const itemId = getScrollStackItemId(item, index);
          const isActive = itemId === resolvedActiveId;
          const distance = index - (activeIndex === -1 ? 0 : activeIndex);

          const depth = Math.max(0, 6 - Math.abs(distance) * 2);
          const restingOffset = distance * -6;

          const sharedClassName = cx(
            "group relative w-full overflow-hidden rounded-3xl border border-boteco-wine/15 bg-surface-gradient px-6 py-7 text-left text-boteco-brown shadow-surface transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-boteco-mustard focus-visible:ring-offset-4 focus-visible:ring-offset-background",
            itemClassName,
            item.className,
            isActive && itemActiveClassName,
          );

          const sharedStyle = {
            transformStyle: "preserve-3d",
            boxShadow: isActive
              ? "0 40px 80px -42px rgba(72, 36, 16, 0.58), 0 24px 52px -36px rgba(207, 164, 104, 0.4)"
              : "0 26px 60px -44px rgba(72, 36, 16, 0.42)",
            borderColor: "rgba(120, 72, 32, 0.18)",
            backgroundImage: "var(--surface-gradient)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            ...item.style,
          };

          return React.createElement(
            "li",
            {
              key: itemId,
              className: "list-none",
              style: { position: "relative", zIndex: 100 - Math.abs(distance) },
            },
            React.createElement(
              motion.div,
              {
                id: `scrollstack-${itemId}`,
                role: "option",
                "aria-selected": isActive,
                tabIndex: -1,
                "data-rb-scrollstack-item": itemId,
                className: sharedClassName,
                style: sharedStyle,
                onClick: (event) => {
                  moveSelection(index, event);
                  if (typeof document !== "undefined") {
                    if (
                      containerRef.current &&
                      containerRef.current !== document.activeElement
                    ) {
                      containerRef.current.focus({ preventScroll: true });
                    }
                  }
                },
                onFocus: () => {
                  if (typeof activeId !== "string") {
                    setUncontrolledId(itemId);
                  }
                },
                onMouseEnter: () => {
                  if (focusOnHover && typeof activeId !== "string") {
                    setUncontrolledId(itemId);
                  }
                },
                animate: {
                  y: isActive ? -14 : restingOffset,
                  scale: isActive
                    ? 1.03
                    : 1 - Math.min(Math.abs(distance) * 0.04, 0.16),
                  rotateX: distance * -1.6,
                  boxShadow: isActive
                    ? "0 40px 80px -42px rgba(72, 36, 16, 0.58), 0 24px 52px -36px rgba(207, 164, 104, 0.4)"
                    : "0 26px 60px -44px rgba(72, 36, 16, 0.42)",
                },
                initial: { opacity: 0, y: 32, scale: 0.95 },
                whileHover: { y: -18, rotateX: -3 },
                whileTap: { scale: 0.98 },
                transition: {
                  type: "spring",
                  stiffness: 240,
                  damping: 30,
                  mass: 1 + Math.abs(distance) * 0.05,
                },
              },
              React.createElement(
                "div",
                {
                  className: "relative z-10 flex flex-col gap-4",
                },
                typeof renderItem === "function"
                  ? renderItem({ item, isActive, index, distance })
                  : React.createElement(
                      React.Fragment,
                      null,
                      item.label
                        ? React.createElement(
                            "h3",
                            {
                              className:
                                "text-xl font-semibold text-boteco-wine",
                            },
                            item.label,
                          )
                        : null,
                      item.value
                        ? React.createElement(
                            "p",
                            {
                              className:
                                "text-3xl font-bold text-boteco-wine",
                            },
                            item.value,
                          )
                        : null,
                      item.description
                        ? React.createElement(
                            "p",
                            {
                              className: "text-sm text-boteco-brown/80",
                            },
                            item.description,
                          )
                        : null,
                    ),
              ),
              React.createElement("div", {
                "aria-hidden": true,
                className:
                  "pointer-events-none absolute inset-0 translate-y-2 scale-105 bg-gradient-to-br from-boteco-wine/10 via-transparent to-boteco-mustard/25 opacity-0 transition-opacity duration-500 group-hover:opacity-100",
              }),
              React.createElement("div", {
                "aria-hidden": true,
                className:
                  "pointer-events-none absolute -left-16 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-boteco-wine/5 blur-3xl",
                style: { opacity: Math.max(0.05, depth * 0.03) },
              }),
            ),
          );
        }),
      ),
    );
  },
);

ScrollStack.displayName = "ReactBitsScrollStack";

