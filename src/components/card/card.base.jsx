import { forwardRef } from "react";
import "./card.css";

const VARIANT_TAGS = {
    elevated: "md-elevated-card",
    filled: "md-filled-card",
    outlined: "md-outlined-card",
};

/**
 * Cloudstry Card — V2 — presentational layer.
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
 *
 * Loading skeleton:
 *   <Card loading header={<CardHeader ... />} actions={<>...</>} />
 *
 * Horizontal layout (media left, content right at ≥600px):
 *   <Card horizontal media={<img ... />} header={...}>...</Card>
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
        // V2 layout / state props
        loading = false,        // Renders animated skeleton placeholder when true
        horizontal = false,     // At ≥600px: media left, content right (opt-in)
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
        loading    ? "cst-card--loading"     : "",
        horizontal ? "cst-card--horizontal"  : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    // Structured layout: activated when at least one slot prop is provided
    const hasStructure = header !== undefined || media !== undefined || actions !== undefined;

    // Skeleton: shown when loading=true; skeleton shape reflects provided slot props
    const skeleton = (
        <>
            {media !== undefined && (
                <div className="cst-card__skeleton-media" aria-hidden="true" />
            )}
            <div className="cst-card__skeleton-content" aria-hidden="true">
                <div className="cst-card__skeleton-line cst-card__skeleton-line--title" />
                <div className="cst-card__skeleton-line cst-card__skeleton-line--subtitle" />
                <div className="cst-card__skeleton-line" />
                <div className="cst-card__skeleton-line" />
                <div className="cst-card__skeleton-line cst-card__skeleton-line--short" />
                {actions !== undefined && (
                    <div className="cst-card__skeleton-actions">
                        <div className="cst-card__skeleton-btn" />
                        <div className="cst-card__skeleton-btn cst-card__skeleton-btn--secondary" />
                    </div>
                )}
            </div>
        </>
    );

    // Structured content (when hasStructure and not loading)
    const structuredContent = (
        <>
            {media && <div className="cst-card__media">{media}</div>}
            {horizontal ? (
                // Horizontal mode: wrap text content in a column so media sits beside it
                <div className="cst-card__col">
                    {header  && <div className="cst-card__header">{header}</div>}
                    {children && <div className="cst-card__body">{children}</div>}
                    {actions && <div className="cst-card__actions">{actions}</div>}
                </div>
            ) : (
                <>
                    {header  && <div className="cst-card__header">{header}</div>}
                    {children && <div className="cst-card__body">{children}</div>}
                    {actions && <div className="cst-card__actions">{actions}</div>}
                </>
            )}
        </>
    );

    const inner = loading
        ? skeleton
        : hasStructure
            ? structuredContent
            : children;

    if (href) {
        // Link-interactive card: entire card surface is an anchor
        return (
            <a
                href={href}
                target={target}
                rel={target === "_blank" ? (rel ?? "noopener noreferrer") : rel}
                className="cst-card-link-wrap"
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledBy}
                aria-busy={loading || undefined}
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
            aria-busy={loading || undefined}
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

/* ---- CardHeader convenience component (V2: layout moved to CSS) ----------- */
export function CardHeader({ title, subtitle, avatar, action, className = "" }) {
    return (
        <div className={`cst-card__header-inner${className ? ` ${className}` : ""}`}>
            {avatar && (
                <div className="cst-card__header-avatar">
                    {avatar}
                </div>
            )}
            <div className="cst-card__header-text">
                {title    != null && <p className="cst-card__header-title">{title}</p>}
                {subtitle != null && <p className="cst-card__header-subtitle">{subtitle}</p>}
            </div>
            {action && (
                <div className="cst-card__header-action">
                    {action}
                </div>
            )}
        </div>
    );
}
