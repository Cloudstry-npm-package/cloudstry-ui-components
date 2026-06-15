import { forwardRef, isValidElement, cloneElement } from "react";
import "./fab.css";

const SIZE_MAP = { sm: "small", md: "medium", lg: "large" };

const isDev =
    typeof process !== "undefined" &&
    process.env &&
    process.env.NODE_ENV !== "production";

// Position styles injected when the `position` convenience prop is set.
// Offsets use CSS tokens (--cst-fab-offset-x / --cst-fab-offset-y) so
// consumers can override via style prop without changing these mappings.
const POSITION_STYLES = {
    "bottom-right": {
        position: "fixed",
        bottom: "var(--cst-fab-offset-y, 16px)",
        right: "var(--cst-fab-offset-x, 16px)",
    },
    "bottom-left": {
        position: "fixed",
        bottom: "var(--cst-fab-offset-y, 16px)",
        left: "var(--cst-fab-offset-x, 16px)",
    },
    "bottom-center": {
        position: "fixed",
        bottom: "var(--cst-fab-offset-y, 16px)",
        left: "50%",
        transform: "translateX(-50%)",
    },
};

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
 * Fixed position (V2):
 *   <FAB icon={<PlusIcon />} position="bottom-right" aria-label="Create" />
 *
 * ICON SLOT: MWC FAB uses a named slot "icon" (not the default slot). The
 * `icon` prop automatically wraps content with slot="icon". Children are also
 * wrapped with slot="icon" when no icon prop is provided.
 *
 * ACCESSIBILITY: Icon-only FABs must have aria-label. A dev warning fires when
 * neither label nor aria-label is provided. When disabled, tabIndex=-1 prevents
 * keyboard focus in addition to pointer-events:none and aria-disabled.
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
        position = null,        // "bottom-right" | "bottom-left" | "bottom-center" | null
        onClick,
        href,                   // programmatic navigation; MWC does not natively support href
        target,
        className = "",
        fabClassName = "",
        children,               // escape hatch: wrapped in slot="icon" when no icon prop
        "aria-label": ariaLabel,
        tabIndex: externalTabIndex,
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

    // ---- Resolved tabIndex --------------------------------------------------
    // When disabled: always -1 (removes from tab order; MWC FAB has no native
    // disabled, so CSS pointer-events:none alone is insufficient for keyboard).
    // When enabled: pass through the consumer's tabIndex (or undefined).
    const resolvedTabIndex = disabled ? -1 : externalTabIndex;

    // ---- Position convenience style ----------------------------------------
    // When position is set, inject fixed-placement inline styles. Consumer's
    // style prop is merged last so token overrides (--cst-fab-offset-*) win.
    const positionStyle = position ? POSITION_STYLES[position] : null;
    const mergedStyle = (positionStyle || style)
        ? { ...positionStyle, ...style }
        : undefined;

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
            style={mergedStyle}
            aria-label={ariaLabel || undefined}
            tabIndex={resolvedTabIndex}
            onClick={handleClick}
            {...mdAttrs}
            {...rest}
        >
            {iconNode}
        </Tag>
    );
});

export default FABBase;
