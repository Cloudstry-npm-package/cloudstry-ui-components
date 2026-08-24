import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { resolveIcon } from "../../icons/index.jsx";
import "./button.css";

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
 * Cloudstry Button — presentational layer.
 *
 * Renderer-agnostic public API: consumers never touch `@material/web` tags,
 * slot names, or `--md-*` tokens directly. This component maps a small,
 * stable React API onto the current Material 3 web-component renderer.
 *
 * Icons + label are rendered as light-DOM content inside the element's default
 * slot, wrapped in a single Cloudstry-controlled flex layout. This is what lets
 * `startIcon` AND `endIcon` coexist (the underlying element exposes only one
 * native icon slot), makes `loading` a trivial swap, and keeps the layout
 * identical if the renderer is ever decoupled from `@material/web`.
 *
 * V2 additions (2026-06-13):
 *   - `href` / `target` / `rel` — link button support (MWC renders <a> natively)
 *   - Loading spinner: role="status" + aria-label + visually-hidden text
 *   - `--cst-button-outlined-border` token (see button.css)
 *   - `pointer: coarse` touch-target fix for sm (see button.css)
 *   - `xs` and `xl` added to the size scale
 *
 * V3 additions:
 *   - Per-size line-height token so the rendered height matches the size token
 *     (see button.css — this is the whole of the size-scale height fix)
 *   - `type` now follows native <button> semantics: a button inside a <form>
 *     defaults to "submit", one outside a form defaults to "button". Passing
 *     `type` explicitly always wins.
 *
 * @typedef {Object} ButtonProps
 * @property {"button"|"submit"|"reset"} [type] Explicit type. When omitted the
 *   button resolves to "submit" inside a <form> and "button" outside one,
 *   matching a native <button>. Pass `type="button"` on a non-submitting
 *   control that lives inside a form (e.g. a "Cancel" or toolbar button).
 */

const VARIANT_TAGS = {
    filled: "md-filled-button",
    tonal: "md-filled-tonal-button",
    elevated: "md-elevated-button",
    outlined: "md-outlined-button",
    text: "md-text-button",
};

const ButtonBase = forwardRef(function ButtonBase(
    {
        children,
        label,                  // back-compat: used when `children` is absent
        icon = null,            // back-compat: string -> leading <md-icon>
        variant = "filled",     // filled | tonal | elevated | outlined | text
        size = "md",            // xs | sm | md | lg | xl  (Cloudstry-owned, not M3 XS–XL)
        startIcon = null,       // ReactNode leading icon
        endIcon = null,         // ReactNode trailing icon
        loading = false,        // Cloudstry composition (not an MWC feature)
        fullWidth = false,
        disabled = false,
        type,                   // omitted ⇒ resolved from form membership (see below)
        // Link button props — MWC renders <a> internally when href is set
        href,                   // navigation target; renders button as anchor link
        target,                 // anchor target, e.g. "_blank" (only used with href)
        rel,                    // anchor rel, e.g. "noopener noreferrer" (only used with href)
        onClick,
        className = "",
        style,
        ...rest                 // aria-*, data-*, id, name, ... forwarded
    },
    ref
) {
    const Tag = VARIANT_TAGS[variant] || VARIANT_TAGS.filled;
    const content = children ?? label;

    const [innerRef, callbackRef] = useMergedRef(ref);

    // Native <button> semantics: inside a <form> the default type is "submit",
    // outside one it is "button". Form membership can only be known once the
    // element is in the document, so it is detected on mount. The first paint
    // uses the safe "button" value; if the button turns out to be inside a form
    // it flips to "submit" before any interaction can occur.
    //
    // An explicit `type` prop always wins and skips detection entirely — that is
    // the escape hatch for non-submitting controls inside a form (Cancel, etc.).
    const [inForm, setInForm] = useState(false);
    useEffect(() => {
        if (type !== undefined) return;
        const el = innerRef.current;
        if (!el || typeof el.closest !== "function") return;
        setInForm(!!el.closest("form"));
    }, [type]); // eslint-disable-line react-hooks/exhaustive-deps

    // A link button is an <a> under the hood and has no form behaviour at all.
    const resolvedType = href
        ? undefined
        : type !== undefined
            ? type
            : inForm
                ? "submit"
                : "button";

    // V2: spinner uses role="status" + aria-label so it is announced by AT.
    // The visually-hidden "Loading" text in the content area provides an
    // additional accessible label for focus-reading without duplication.
    const leadingNode = loading
        ? <span className="cst-btn__spinner" role="status" aria-label="Loading" />
        : (resolveIcon(startIcon) ?? (icon ? <md-icon>{icon}</md-icon> : null));
    const trailingNode = loading ? null : resolveIcon(endIcon);

    const classes = [
        "cst-btn",
        `cst-btn--${variant}`,
        `cst-btn--${size}`,
        fullWidth ? "cst-btn--full" : "",
        loading ? "cst-btn--loading" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    const handleClick = (event) => {
        if (disabled || loading) {
            event.preventDefault();
            return;
        }
        onClick?.(event);
    };

    // Dev-only a11y nudge: icon-only buttons need an accessible name.
    if (
        typeof process !== "undefined" &&
        process.env &&
        process.env.NODE_ENV !== "production" &&
        content == null &&
        !rest["aria-label"] &&
        !rest["aria-labelledby"]
    ) {
        // eslint-disable-next-line no-console
        console.warn(
            "[Cloudstry Button] Icon-only button has no text content; " +
            "provide an `aria-label` for accessibility."
        );
    }

    return (
        <Tag
            ref={callbackRef}
            {...rest}
            className={classes}
            type={resolvedType}
            disabled={disabled}
            style={style}
            aria-busy={loading || undefined}
            aria-disabled={loading || undefined}
            onClick={handleClick}
            href={href}
            target={target}
            rel={rel}
        >
            <span className="cst-btn__content">
                {leadingNode && (
                    <span className="cst-btn__icon cst-btn__icon--start">
                        {leadingNode}
                    </span>
                )}
                {content != null && content !== "" && (
                    <span className="cst-btn__label">{content}</span>
                )}
                {trailingNode && (
                    <span className="cst-btn__icon cst-btn__icon--end">
                        {trailingNode}
                    </span>
                )}
                {/* V2: visually hidden loading text — read on focus while spinner is visible */}
                {loading && (
                    <span className="cst-visually-hidden">Loading</span>
                )}
            </span>
        </Tag>
    );
});

export default ButtonBase;
