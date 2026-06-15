import { forwardRef, isValidElement, cloneElement } from "react";
import "./chips.css";

/**
 * Cloudstry AssistChip — presentational layer.
 *
 * An action chip. Behaves like a button or link.
 *
 *   <AssistChip label="Open Maps" onClick={fn} />
 *   <AssistChip label="Visit site" href="https://..." />
 *   <AssistChip label="With icon" icon={<svg slot="icon">…</svg>} />
 *
 * The `icon` prop must be a React element. It receives `slot="icon"` automatically.
 */
const AssistChipBase = forwardRef(function AssistChipBase(
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
    const classes = ["cst-chip", "cst-chip--assist", `cst-chip--${size}`, className].filter(Boolean).join(" ");

    const attrs = {};
    if (elevated) attrs.elevated = true;
    if (disabled) attrs.disabled = true;
    if (href) attrs.href = href;
    if (target) attrs.target = target;
    if (rel) attrs.rel = rel;
    if (onClick) attrs.onClick = onClick;

    const iconNode = isValidElement(icon) ? cloneElement(icon, { slot: "icon" }) : null;

    return (
        <md-assist-chip
            ref={ref}
            label={label}
            className={classes}
            style={style}
            {...attrs}
            {...rest}
        >
            {iconNode}
        </md-assist-chip>
    );
});

export default AssistChipBase;
