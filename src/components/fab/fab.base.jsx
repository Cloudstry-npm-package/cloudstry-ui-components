import { forwardRef, isValidElement, cloneElement } from "react";
import "./fab.css";

const SIZE_MAP = { sm: "small", md: "medium", lg: "large" };

const isDev =
    typeof process !== "undefined" &&
    process.env &&
    process.env.NODE_ENV !== "production";

/**
 * Cloudstry FAB — presentational layer.
 *
 * Unified FAB component. Switches between md-fab and md-branded-fab via the
 * `branded` prop. Size uses the Cloudstry sm | md | lg system (consistent
 * with Button), mapped to MWC small | medium | large internally.
 *
 * Standard (icon-only):
 *   <FAB icon={<PlusIcon />} aria-label="Create" />
 *
 * Extended (icon + label):
 *   <FAB icon={<PlusIcon />} label="Create" />
 *
 * Branded:
 *   <FAB branded icon={<BrandLogo />} aria-label="Brand action" />
 *
 * Lowered:
 *   <FAB icon={<PlusIcon />} lowered aria-label="Create" />
 *
 * Link (programmatic — md-fab renders a <button>, not <a>):
 *   <FAB icon={<PlusIcon />} href="/compose" aria-label="Compose" />
 *
 * ICON SLOT: MWC FAB uses a named slot "icon" (not the default slot). The
 * `icon` prop automatically wraps content with slot="icon". Children are also
 * wrapped with slot="icon" when no icon prop is provided.
 *
 * ACCESSIBILITY: Icon-only FABs must have aria-label. A dev warning fires when
 * neither label nor aria-label is provided.
 */
const FABBase = forwardRef(function FABBase(
    {
        icon,                   // ReactElement | string — icon; auto-slotted to slot="icon"
        label,                  // string — drives extended mode when non-empty
        branded = false,        // use md-branded-fab instead of md-fab
        variant = "surface",    // surface | primary | secondary | tertiary (non-branded only)
        size = "md",            // sm | md | lg → small | medium | large
        lowered = false,
        disabled = false,
        onClick,
        href,                   // programmatic navigation; MWC does not natively support href
        target,
        className = "",
        fabClassName = "",
        children,               // escape hatch: wrapped in slot="icon" when no icon prop
        "aria-label": ariaLabel,
        style,
        ...rest
    },
    ref
) {
    // ---- Dev warnings -------------------------------------------------------
    if (isDev) {
        if (!label && !ariaLabel && !rest["aria-labelledby"]) {
            // eslint-disable-next-line no-console
            console.warn(
                "[Cloudstry FAB] Icon-only FABs require an accessible name. " +
                "Add an `aria-label` prop, or provide a `label` for an Extended FAB."
            );
        }
        if (branded && size === "sm") {
            // eslint-disable-next-line no-console
            console.warn(
                "[Cloudstry FAB] Branded FABs cannot be sized to 'sm'. " +
                "Defaulting to 'md' (medium)."
            );
        }
    }

    // ---- Size ---------------------------------------------------------------
    const mwcSize = SIZE_MAP[size] || "medium";
    const safeSize = branded && size === "sm" ? "medium" : mwcSize;

    // ---- Icon slot content --------------------------------------------------
    // MWC FAB uses slot name="icon" — content MUST have slot="icon" to render.
    // Fallback order: icon prop → children → nothing (MWC shows empty span).
    let iconNode = null;
    if (isValidElement(icon)) {
        iconNode = cloneElement(icon, { slot: "icon" });
    } else if (icon != null) {
        iconNode = <span slot="icon">{icon}</span>;
    } else if (children != null) {
        iconNode = <span slot="icon">{children}</span>;
    }

    // ---- Build MWC attributes -----------------------------------------------
    const Tag = branded ? "md-branded-fab" : "md-fab";

    const mdAttrs = { size: safeSize };
    if (label) mdAttrs.label = label;
    if (lowered) mdAttrs.lowered = true;
    if (disabled) {
        mdAttrs.disabled = true;
        mdAttrs["aria-disabled"] = "true";
    }
    // variant only on md-fab (branded has no variants)
    if (!branded && variant !== "surface") mdAttrs.variant = variant;

    const classes = ["cst-fab", fabClassName, className].filter(Boolean).join(" ");

    // ---- Click handler (handles disabled + href) ----------------------------
    const handleClick = (e) => {
        if (disabled) {
            e.preventDefault();
            return;
        }
        onClick?.(e);
        if (href && !e.defaultPrevented) {
            if (target === "_blank") {
                window.open(href, "_blank", "noopener,noreferrer");
            } else {
                window.location.href = href;
            }
        }
    };

    return (
        <Tag
            ref={ref}
            className={classes}
            style={style}
            aria-label={ariaLabel || undefined}
            onClick={handleClick}
            {...mdAttrs}
            {...rest}
        >
            {iconNode}
        </Tag>
    );
});

export default FABBase;
