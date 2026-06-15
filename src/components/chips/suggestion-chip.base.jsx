import { forwardRef, isValidElement, cloneElement } from "react";
import "./chips.css";

/**
 * Cloudstry SuggestionChip — presentational layer.
 *
 * An offered suggestion the user can accept (e.g. quick-reply suggestions in
 * chat, autocomplete options). Behaves like a button or link.
 *
 *   <SuggestionChip label="Sounds great!" onClick={fn} />
 *   <SuggestionChip label="Learn more" href="https://..." />
 */
const SuggestionChipBase = forwardRef(function SuggestionChipBase(
    {
        label,
        elevated = false,
        href,
        target,
        rel,
        disabled = false,
        icon,
        size = "md",    // "sm" | "md"
        onClick,
        className = "",
        style,
        ...rest
    },
    ref
) {
    const classes = ["cst-chip", "cst-chip--suggestion", `cst-chip--${size}`, className].filter(Boolean).join(" ");

    const attrs = {};
    if (elevated) attrs.elevated = true;
    if (disabled) attrs.disabled = true;
    if (href) attrs.href = href;
    if (target) attrs.target = target;
    if (rel) attrs.rel = rel;
    if (onClick) attrs.onClick = onClick;

    const iconNode = isValidElement(icon) ? cloneElement(icon, { slot: "icon" }) : null;

    return (
        <md-suggestion-chip
            ref={ref}
            label={label}
            className={classes}
            style={style}
            {...attrs}
            {...rest}
        >
            {iconNode}
        </md-suggestion-chip>
    );
});

export default SuggestionChipBase;
