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

    const mwcType = href ? "link" : "menuitem";

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
