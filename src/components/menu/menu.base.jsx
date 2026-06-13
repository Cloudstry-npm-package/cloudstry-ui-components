import { forwardRef, useCallback, useEffect, useRef } from "react";
import "./menu.css";

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

const MenuBase = forwardRef(function MenuBase(
    {
        anchorRef,
        open = false,
        quick = false,
        positioning = "popover",
        defaultFocus,
        xOffset,
        yOffset,
        onOpen,
        onClose,
        children,
        className = "",
        menuClassName = "",
        style,
        ...rest
    },
    ref
) {
    const [innerRef, callbackRef] = useMergedRef(ref);

    const onOpenRef = useRef(onOpen);
    onOpenRef.current = onOpen;
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    // Anchor element sync — set once on mount; anchorRef.current is populated by
    // this point because the trigger renders before the menu in the same commit.
    useEffect(() => {
        const el = innerRef.current;
        if (!el || !anchorRef?.current) return;
        el.anchorElement = anchorRef.current;
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Open/close — imperative because md-menu.open is a getter/setter that
    // manages animation state internally. Attribute passthrough alone does not work.
    useEffect(() => {
        const el = innerRef.current;
        if (!el) return;
        if (open) {
            el.show();
        } else {
            el.close();
        }
    }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

    // Event wiring — attached once on mount; callbacks stay current via refs.
    useEffect(() => {
        const el = innerRef.current;
        if (!el) return;
        const handleOpened = () => onOpenRef.current?.();
        const handleClosed = () => onCloseRef.current?.();
        el.addEventListener("opened", handleOpened);
        el.addEventListener("closed", handleClosed);
        return () => {
            el.removeEventListener("opened", handleOpened);
            el.removeEventListener("closed", handleClosed);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const mdAttrs = { positioning };
    if (quick) mdAttrs.quick = true;
    if (defaultFocus != null) mdAttrs["default-focus"] = defaultFocus;
    if (xOffset != null) mdAttrs["x-offset"] = xOffset;
    if (yOffset != null) mdAttrs["y-offset"] = yOffset;

    const classes = ["cst-menu", menuClassName, className].filter(Boolean).join(" ");

    return (
        <md-menu
            ref={callbackRef}
            className={classes}
            style={style}
            {...mdAttrs}
            {...rest}
        >
            {children}
        </md-menu>
    );
});

export default MenuBase;
