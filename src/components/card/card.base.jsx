import { forwardRef } from "react";
import "./card.css";

const VARIANT_TAGS = {
    elevated: "md-elevated-card",
    filled: "md-filled-card",
    outlined: "md-outlined-card",
};

/**
 * Cloudstry Card — presentational layer.
 *
 * Provides a Cloudstry-owned content structure convention on top of the MWC
 * Labs card surface. Consumers get header/media/body/actions slots without
 * rebuilding the layout in every application.
 *
 * Slot-based usage (recommended):
 *   <Card header={<CardHeader title="..." subtitle="..." />} actions={<>...</>}>
 *     body content
 *   </Card>
 *
 * Escape hatch (children-only, full layout control):
 *   <Card>any content</Card>
 *
 * Interactive card (onClick):
 *   <Card onClick={fn} aria-label="Go to detail">...</Card>
 *
 * Interactive card (href / link):
 *   <Card href="/detail/1">...</Card>
 */
const CardBase = forwardRef(function CardBase(
    {
        variant = "elevated",   // elevated | filled | outlined
        // Content slot props (Cloudstry layout convention)
        header,                 // ReactNode — header region (use CardHeader helper)
        media,                  // ReactNode — full-bleed media region (image/video)
        actions,                // ReactNode — actions region (buttons, etc.)
        children,               // ReactNode — body region (or full content in escape-hatch mode)
        // Interactive card props
        onClick,                // Makes card a button-like interactive surface
        href,                   // Makes card a link (wraps in <a>)
        target,                 // anchor target (only used with href)
        rel,                    // anchor rel (only used with href)
        // a11y
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        // Styling
        className = "",
        style,
        ...rest
    },
    ref
) {
    const Tag = VARIANT_TAGS[variant] || VARIANT_TAGS.elevated;
    const isInteractive = !!(onClick || href);

    const classes = [
        "cst-card",
        `cst-card--${variant}`,
        isInteractive ? "cst-card--interactive" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    // Structured layout: rendered when at least one slot prop is provided
    const hasStructure = header !== undefined || media !== undefined || actions !== undefined;

    const inner = hasStructure ? (
        <>
            {media && <div className="cst-card__media">{media}</div>}
            {header && <div className="cst-card__header">{header}</div>}
            {children && <div className="cst-card__body">{children}</div>}
            {actions && <div className="cst-card__actions">{actions}</div>}
        </>
    ) : (
        children
    );

    if (href) {
        // Link-interactive card: entire card is an anchor
        return (
            <a
                href={href}
                target={target}
                rel={target === "_blank" ? (rel ?? "noopener noreferrer") : rel}
                className="cst-card-link-wrap"
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledBy}
            >
                <Tag ref={ref} className={classes} style={style} {...rest}>
                    {inner}
                </Tag>
            </a>
        );
    }

    const handleKeyDown = onClick
        ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick(e);
              }
          }
        : undefined;

    return (
        <Tag
            ref={ref}
            className={classes}
            style={style}
            {...(onClick
                ? {
                      role: "button",
                      tabIndex: 0,
                      onClick,
                      onKeyDown: handleKeyDown,
                      "aria-label": ariaLabel,
                      "aria-labelledby": ariaLabelledBy,
                  }
                : {})}
            {...rest}
        >
            {inner}
        </Tag>
    );
});

export default CardBase;

/* ---- CardHeader convenience component ------------------------------------ */
export function CardHeader({ title, subtitle, avatar, action, className = "" }) {
    return (
        <div className={`cst-card__header-inner${className ? ` ${className}` : ""}`}
             style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            {avatar && (
                <div className="cst-card__header-avatar" style={{ flexShrink: 0 }}>
                    {avatar}
                </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
                {title != null && <p className="cst-card__header-title">{title}</p>}
                {subtitle != null && <p className="cst-card__header-subtitle">{subtitle}</p>}
            </div>
            {action && (
                <div className="cst-card__header-action" style={{ flexShrink: 0 }}>
                    {action}
                </div>
            )}
        </div>
    );
}
