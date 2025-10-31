import * as React from "react";

const cx = (...classes) => classes.filter(Boolean).join(" ");

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

