import { forwardRef } from "react";
import "./button.css";

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
        size = "md",            // sm | md | lg  (Cloudstry-owned, not M3 XS–XL)
        startIcon = null,       // ReactNode leading icon
        endIcon = null,         // ReactNode trailing icon
        loading = false,        // Cloudstry composition (not an MWC feature)
        fullWidth = false,
        disabled = false,
        type = "button",        // intentionally "button" (not the element's "submit")
        onClick,
        className = "",
        style,
        ...rest                 // aria-*, data-*, id, name, href, ... forwarded
    },
    ref
) {
    const Tag = VARIANT_TAGS[variant] || VARIANT_TAGS.filled;
    const content = children ?? label;

    const leadingNode = loading
        ? <span className="cst-btn__spinner" aria-hidden="true" />
        : (startIcon ?? (icon ? <md-icon>{icon}</md-icon> : null));
    const trailingNode = loading ? null : endIcon;

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
            ref={ref}
            {...rest}
            className={classes}
            type={type}
            disabled={disabled}
            style={style}
            aria-busy={loading || undefined}
            aria-disabled={loading || undefined}
            onClick={handleClick}
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
            </span>
        </Tag>
    );
});

export default ButtonBase;
