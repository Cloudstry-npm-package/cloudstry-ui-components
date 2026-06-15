import { forwardRef, useCallback, useEffect, useRef, isValidElement, cloneElement } from "react";
import "./chips.css";

/**
 * Merges external forwarded ref with an internal ref needed for DOM property sync.
 */
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

/**
 * Cloudstry FilterChip — presentational layer.
 *
 * A toggle chip. Selected state follows the same controlled/uncontrolled
 * pattern as Checkbox. `selected` is synced via DOM property (not attribute)
 * to avoid React 18 boolean-attribute coercion.
 *
 * Controlled:
 *   <FilterChip label="Sports" selected={sel} onChange={(val) => setSel(val)} />
 *
 * Uncontrolled:
 *   <FilterChip label="Sports" defaultSelected />
 *
 * onChange receives the NEW selected value (boolean), value-first.
 *
 * When removable=true the chip also fires onRemove when the trailing remove
 * button is clicked.
 */
const FilterChipBase = forwardRef(function FilterChipBase(
    {
        label,
        selected,           // controlled mode when defined (boolean)
        defaultSelected,    // uncontrolled initial value
        elevated = false,
        removable = false,
        disabled = false,
        icon,               // ReactElement — leading icon
        size = "md",        // "sm" | "md"
        onChange,           // (selected: boolean) => void
        onRemove,           // () => void — only relevant when removable=true
        className = "",
        style,
        ...rest
    },
    ref
) {
    const [innerRef, callbackRef] = useMergedRef(ref);
    const isControlled = selected !== undefined;

    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;
    const onRemoveRef = useRef(onRemove);
    onRemoveRef.current = onRemove;

    // Detect user-initiated click (isTrusted=true) via the host element.
    // MWC's handleClick toggles `el.selected` and re-dispatches a synthetic
    // click (isTrusted=false) from the host. By the time the original trusted
    // click bubbles through the shadow root to the host, el.selected is already
    // toggled — so we read the correct new value in the queued microtask.
    useEffect(() => {
        const el = innerRef.current;
        if (!el) return;
        const handler = (event) => {
            if (!event.isTrusted) return;
            queueMicrotask(() => onChangeRef.current?.(el.selected));
        };
        el.addEventListener("click", handler);
        return () => el.removeEventListener("click", handler);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Remove event — fires when removable=true and the trailing remove button is clicked.
    useEffect(() => {
        const el = innerRef.current;
        if (!el) return;
        const handler = () => onRemoveRef.current?.();
        el.addEventListener("remove", handler);
        return () => el.removeEventListener("remove", handler);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Controlled: sync `selected` DOM property.
    // React 18 passes boolean false as the string "false" attribute; Lit reads
    // it as truthy. We bypass this by setting the property directly.
    useEffect(() => {
        const el = innerRef.current;
        if (!el || !isControlled) return;
        el.selected = !!selected;
    }, [selected, isControlled]); // eslint-disable-line react-hooks/exhaustive-deps

    // Uncontrolled: seed initial value once on mount.
    useEffect(() => {
        const el = innerRef.current;
        if (!el || isControlled || defaultSelected === undefined) return;
        el.selected = !!defaultSelected;
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const classes = ["cst-chip", "cst-chip--filter", `cst-chip--${size}`, className].filter(Boolean).join(" ");

    const attrs = {};
    if (elevated) attrs.elevated = true;
    if (disabled) attrs.disabled = true;
    if (removable) attrs.removable = true;

    const iconNode = isValidElement(icon) ? cloneElement(icon, { slot: "icon" }) : null;

    return (
        <md-filter-chip
            ref={callbackRef}
            label={label}
            className={classes}
            style={style}
            {...attrs}
            {...rest}
        >
            {iconNode}
        </md-filter-chip>
    );
});

export default FilterChipBase;
