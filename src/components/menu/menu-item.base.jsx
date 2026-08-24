import { cloneElement, forwardRef, isValidElement, useCallback, useEffect, useRef } from "react";

function useMergedRef(externalRef) {
    const innerRef = useRef(null);
    const callbackRef = useCallback(
        (node) => {
            innerRef.current = node;
            if (typeof externalRef === "function") externalRef(node);
            else if (externalRef) externalRef.current = node;
        },
        [externalRef]
    );
    return [innerRef, callbackRef];
}

const MenuItemBase = forwardRef(function MenuItemBase(
    {
        headline,
        supportingText,
        start,
        end,
        children,
        href,
        target,
        disabled = false,
        keepOpen = false,
        type,
        selected,
        onClick,
        className = "",
        style,
        ...rest
    },
    ref
) {
    const [innerRef, callbackRef] = useMergedRef(ref);

    // keepOpen attribute is `keep-open` (hyphenated) — React cannot set it via
    // camelCase prop spreading on custom elements. Set imperatively via DOM property.
    useEffect(() => {
        const el = innerRef.current;
        if (!el) return;
        el.keepOpen = keepOpen;
    }, [keepOpen]); // eslint-disable-line react-hooks/exhaustive-deps

    // `selected` is a Lit `@property({ type: Boolean })`. Spreading it from React
    // onto a custom element writes the ATTRIBUTE `selected="false"`, and Lit's
    // boolean converter treats any present attribute as true — so an unselected
    // item would render selected. Set it as a DOM property instead (the same
    // pattern Checkbox/Switch/FilterChip use).
    useEffect(() => {
        const el = innerRef.current;
        if (!el || selected === undefined) return;
        el.selected = !!selected;
    }, [selected]); // eslint-disable-line react-hooks/exhaustive-deps

    // type="option" makes MWC report role="option" (see menuItemController.role).
    // Explicit `type` wins; otherwise fall back to the href-derived default.
    const mwcType = type ?? (href ? "link" : "menuitem");

    // MWC renders `aria-selected` from `this.ariaSelected`, NOT from `selected`
    // (selected only drives the visual state class), so an option's selected
    // state has to be published to AT separately.
    const ariaSelected =
        mwcType === "option" && selected !== undefined ? String(!!selected) : undefined;

    const startNode =
        start != null
            ? isValidElement(start)
                ? cloneElement(start, { slot: "start" })
                : <span slot="start">{start}</span>
            : null;

    const endNode =
        end != null
            ? isValidElement(end)
                ? cloneElement(end, { slot: "end" })
                : <span slot="end">{end}</span>
            : null;

    const headlineNode = headline != null
        ? <span slot="headline">{headline}</span>
        : null;

    const supportingTextNode = supportingText != null
        ? <span slot="supporting-text">{supportingText}</span>
        : null;

    const classes = ["cst-menu-item", className].filter(Boolean).join(" ");

    return (
        <md-menu-item
            ref={callbackRef}
            className={classes}
            style={style}
            type={mwcType}
            onClick={onClick}
            {...(ariaSelected ? { "aria-selected": ariaSelected } : {})}
            {...(disabled ? { disabled: true } : {})}
            {...(href ? { href } : {})}
            {...(target ? { target } : {})}
            {...rest}
        >
            {startNode}
            {endNode}
            {headlineNode}
            {supportingTextNode}
            {children}
        </md-menu-item>
    );
});

export default MenuItemBase;
