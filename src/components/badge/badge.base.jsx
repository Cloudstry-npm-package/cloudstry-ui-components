import { forwardRef } from "react";
import "./badge.css";

/**
 * Returns the string value to pass to md-badge.
 * - null/undefined/"" → "" (dot/small badge)
 * - number            → capped at max, suffixed "+"
 * - string            → passed through as-is (no max applied)
 */
function getDisplayValue(value, max) {
    if (value == null || value === "") return "";
    if (typeof value === "number") {
        return value > max ? `${max}+` : String(value);
    }
    return String(value);
}

const VARIANT_CLASSES = {
    brand:   "cst-badge--brand",
    error:   "cst-badge--error",
    success: "cst-badge--success",
    warning: "cst-badge--warning",
};

/**
 * Cloudstry Badge — presentational layer.
 *
 * BadgeWrapper usage (recommended — handles positioning automatically):
 *   <Badge value={5}>
 *       <IconButton />
 *   </Badge>
 *
 * Dot badge (no value):
 *   <Badge><Avatar /></Badge>
 *
 * String badge:
 *   <Badge value="NEW"><Button /></Badge>
 *
 * Standalone (consumer handles positioning):
 *   <Badge value={3} />
 *
 * Accessibility: the md-badge element is aria-hidden by default.
 * Communicate counts through the host element's accessible name:
 *   <Badge value={3}>
 *       <button aria-label="Notifications, 3 unread">
 *           <BellIcon />
 *       </button>
 *   </Badge>
 */
const BadgeBase = forwardRef(function BadgeBase(
    {
        value,              // number | string | undefined — undefined/null → dot badge
        max = 99,           // number — cap for numeric values; default 99
        variant = "brand",  // brand | error | success | warning
        children,           // ReactNode — the host element to attach badge to
        className = "",     // applied to wrapper (children mode) or md-badge (standalone)
        badgeClassName = "", // applied to md-badge in children/wrapper mode
        ...rest             // forwarded to the wrapper div (children mode) or md-badge (standalone)
    },
    ref
) {
    const displayValue = getDisplayValue(value, max);

    const badgeClasses = [
        "cst-badge",
        VARIANT_CLASSES[variant] || VARIANT_CLASSES.brand,
        badgeClassName,
    ]
        .filter(Boolean)
        .join(" ");

    if (children) {
        return (
            <div
                ref={ref}
                className={`cst-badge-wrapper${className ? ` ${className}` : ""}`}
                {...rest}
            >
                {children}
                <md-badge
                    value={displayValue}
                    className={badgeClasses}
                    aria-hidden="true"
                />
            </div>
        );
    }

    // Standalone mode — no wrapper div
    return (
        <md-badge
            ref={ref}
            value={displayValue}
            className={`${badgeClasses}${className ? ` ${className}` : ""}`}
            aria-hidden="true"
            {...rest}
        />
    );
});

export default BadgeBase;
