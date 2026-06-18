import { forwardRef, useCallback, useEffect, useRef } from "react";
import { resolveIcon } from "../../icons/index.jsx";
import "./iconbutton.css";

const VARIANT_TAGS = {
    standard: "md-icon-button",
    filled: "md-filled-icon-button",
    tonal: "md-filled-tonal-icon-button",
    outlined: "md-outlined-icon-button",
};

const isDev =
    typeof process !== "undefined" &&
    process.env &&
    process.env.NODE_ENV !== "production";

/**
 * Returns a single callback ref that writes to both an internal ref and the
 * external forwarded ref (function ref or object ref). Recreated only when the
 * external ref identity changes.
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
 * Cloudstry IconButton — presentational layer.
 *
 * Renderer-agnostic public API over four Material 3 icon button elements.
 * Maps a stable React API onto the current MWC renderer without exposing
 * `@material/web` tags, slot names, or `--md-*` tokens to consumers.
 *
 * Variant usage:
 *   <IconButton icon="edit" aria-label="Edit" />
 *   <IconButton variant="filled" icon="add" aria-label="Add" />
 *   <IconButton variant="tonal" icon="favorite" aria-label="Favorite" />
 *   <IconButton variant="outlined" icon="settings" aria-label="Settings" />
 *
 * Toggle (controlled):
 *   <IconButton toggle selected={selected} onSelectedChange={setSelected} aria-label="Favorite" />
 *
 * Toggle (uncontrolled):
 *   <IconButton toggle defaultSelected aria-label="Bookmark" />
 *
 * SVG children:
 *   <IconButton aria-label="Custom action"><svg>…</svg></IconButton>
 *
 * Link:
 *   <IconButton icon="open_in_new" href="/profile" aria-label="Profile" />
 *
 * Accessibility: all icon buttons MUST have an aria-label or aria-labelledby.
 * A dev warning fires when both are absent.
 */
const IconButtonBase = forwardRef(function IconButtonBase(
    {
        // Variant
        variant = "standard",   // standard | filled | tonal | outlined
        // Content
        icon = null,            // string → <md-icon>{icon}</md-icon>; children take precedence
        children,               // ReactNode; takes precedence over icon
        // Toggle state
        toggle = false,         // enables toggle mode
        selected,               // controlled: selected state when defined
        defaultSelected,        // uncontrolled: initial selected value
        onSelectedChange,       // (selected: boolean) => void
        ariaLabelSelected,      // accessible label for the selected state (toggle mode)
        flipIconInRtl = false,  // flip icon in RTL layouts
        // Base props
        disabled = false,
        href,                   // renders as <a> when set (MWC native)
        target,                 // used with href
        type = "button",
        // Styling
        className = "",
        iconButtonClassName = "",
        style,
        // Callbacks
        onClick,
        // Passthrough (aria-*, data-*, id, name, …)
        ...rest
    },
    ref
) {
    const [innerRef, callbackRef] = useMergedRef(ref);
    const isControlled = toggle && selected !== undefined;

    // ---- Dev-mode warnings --------------------------------------------------
    if (isDev) {
        if (!rest["aria-label"] && !rest["aria-labelledby"]) {
            // eslint-disable-next-line no-console
            console.warn(
                "[Cloudstry IconButton] Icon buttons require an accessible name. " +
                "Add an `aria-label` or `aria-labelledby` prop."
            );
        }
        if (toggle && isControlled && defaultSelected !== undefined) {
            // eslint-disable-next-line no-console
            console.warn(
                "[Cloudstry IconButton] Received both `selected` and `defaultSelected`. " +
                "Use `selected` for controlled or `defaultSelected` for uncontrolled, not both."
            );
        }
    }

    // ---- Keep onSelectedChange in a ref so the event listener always calls
    //      the latest handler without needing to re-attach. -------------------
    const onSelectedChangeRef = useRef(onSelectedChange);
    onSelectedChangeRef.current = onSelectedChange;

    // ---- Attach native change listener (toggle mode) -----------------------
    // React 18 synthetic onChange on custom elements has edge-case issues;
    // addEventListener is the most reliable approach for MWC elements.
    useEffect(() => {
        const el = innerRef.current;
        if (!el) return;
        const handler = (e) => onSelectedChangeRef.current?.(e.target.selected);
        el.addEventListener("change", handler);
        return () => el.removeEventListener("change", handler);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ---- Sync `selected` DOM property (controlled toggle) ------------------
    // React 18 passes boolean false as the string attribute "false" on custom
    // elements, which Lit reads as truthy. Set the DOM property directly.
    useEffect(() => {
        const el = innerRef.current;
        if (!el || !isControlled) return;
        el.selected = !!selected;
    }, [selected, isControlled]); // eslint-disable-line react-hooks/exhaustive-deps

    // ---- Uncontrolled: seed defaultSelected once on mount ------------------
    useEffect(() => {
        const el = innerRef.current;
        if (!el || isControlled || defaultSelected === undefined) return;
        el.selected = !!defaultSelected;
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ---- Sync ariaLabelSelected DOM property -------------------------------
    // MWC property name is ariaLabelSelected; set imperatively to avoid
    // React attribute normalization issues with camelCase property names.
    useEffect(() => {
        const el = innerRef.current;
        if (!el) return;
        if (ariaLabelSelected != null) {
            el.ariaLabelSelected = ariaLabelSelected;
        }
    }, [ariaLabelSelected]);

    // ---- Sync flipIconInRtl DOM property -----------------------------------
    useEffect(() => {
        const el = innerRef.current;
        if (!el) return;
        el.flipIconInRtl = !!flipIconInRtl;
    }, [flipIconInRtl]);

    // ---- Resolve MWC tag ---------------------------------------------------
    const Tag = VARIANT_TAGS[variant] || VARIANT_TAGS.standard;

    // ---- Icon content ------------------------------------------------------
    // children > registry SVG > md-icon ligature (Material Symbols font fallback)
    let iconContent = children;
    if (iconContent == null && icon != null) {
        const resolved = resolveIcon(icon);
        iconContent = resolved ?? (typeof icon === "string" ? <md-icon>{icon}</md-icon> : null);
    }

    // ---- Build MWC attributes ----------------------------------------------
    const mdAttrs = {};
    if (toggle) mdAttrs.toggle = true;
    if (disabled) mdAttrs.disabled = true;
    if (href) mdAttrs.href = href;
    if (target) mdAttrs.target = target;
    if (type !== "button") mdAttrs.type = type;

    // ---- CSS classes -------------------------------------------------------
    const classes = [
        "cst-icon-btn",
        `cst-icon-btn--${variant}`,
        toggle ? "cst-icon-btn--toggle" : "",
        iconButtonClassName,
        className,
    ]
        .filter(Boolean)
        .join(" ");

    const handleClick = (e) => {
        if (disabled) {
            e.preventDefault();
            return;
        }
        onClick?.(e);
    };

    return (
        <Tag
            ref={callbackRef}
            className={classes}
            style={style}
            onClick={handleClick}
            {...mdAttrs}
            {...rest}
        >
            {iconContent}
        </Tag>
    );
});

export default IconButtonBase;
