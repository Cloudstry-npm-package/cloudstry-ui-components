import "./footer.css";

/* ─── Internal: Links slot renderer ─────────────────────────────────────── */
function LinksSlot({ links, ariaLabel }) {
    if (!links) return null;
    return (
        <nav aria-label={ariaLabel ?? "Footer navigation"} className="cst-footer-links-nav">
            {Array.isArray(links) ? (
                <ul className="cst-footer-nav">
                    {links.map(({ label, href, target, rel }, i) => (
                        <li key={i}>
                            <a
                                className="cst-footer-link"
                                href={href}
                                target={target}
                                rel={target === "_blank" ? (rel ?? "noopener noreferrer") : rel}
                                aria-label={
                                    target === "_blank" ? `${label} (opens in new tab)` : undefined
                                }
                            >
                                {label}
                            </a>
                        </li>
                    ))}
                </ul>
            ) : (
                links
            )}
        </nav>
    );
}

/* ─── Internal: Social slot renderer ────────────────────────────────────── */
function SocialSlot({ social, ariaLabel }) {
    if (!social) return null;
    return (
        <nav aria-label={ariaLabel ?? "Social media links"} className="cst-footer-social-nav">
            {Array.isArray(social) ? (
                <ul className="cst-footer-social">
                    {social.map(({ label, href, icon, target }, i) => (
                        <li key={i}>
                            <a
                                className="cst-footer-social-link"
                                href={href}
                                target={target ?? "_blank"}
                                rel="noopener noreferrer"
                                aria-label={label}
                            >
                                {icon}
                            </a>
                        </li>
                    ))}
                </ul>
            ) : (
                social
            )}
        </nav>
    );
}

/* ─── FooterBase ─────────────────────────────────────────────────────────── */
function FooterBase({
    // Existing props — fully preserved
    text = "© Cloudstry Tech. All rights reserved.",
    className = "",

    // Slot props (new — additive, all optional)
    brand,
    links,
    social,
    legal,
    children,

    // Layout control
    variant = "simple",

    // Accessibility
    "aria-label": ariaLabel = "Site footer",
    linksAriaLabel,
    socialAriaLabel,

    // Passthrough
    style,
    ...rest
}) {
    // `legal` takes precedence over `text`
    const legalContent = legal !== undefined ? legal : text;

    // Dev-mode warning: slots ignored in simple variant
    if (process.env.NODE_ENV !== "production" && variant === "simple" && (brand || links || social)) {
        console.warn(
            '[Footer] Slot props (brand, links, social) are ignored in variant="simple". ' +
            'Set variant="centered" or variant="split" to use slots.'
        );
    }

    const hasSlots = !!(brand || links || social);

    // Effective variant drives data-attribute (matches what's actually rendered)
    const effectiveVariant =
        children || variant === "simple" || !hasSlots ? "simple" : variant;

    const footerProps = {
        className: `cst-footer${className ? ` ${className}` : ""}`,
        "aria-label": ariaLabel,
        "data-variant": effectiveVariant,
        style,
        ...rest,
    };

    // ── Children escape hatch — full layout control ────────────────────────
    if (children) {
        return <footer {...footerProps}>{children}</footer>;
    }

    // ── Simple: default and backward-compat path ───────────────────────────
    // Renders when: variant="simple", OR no slot props supplied
    if (variant === "simple" || !hasSlots) {
        return (
            <footer {...footerProps}>
                <div className="cst-footer-inner">
                    <p className="cst-footer-text">{legalContent}</p>
                </div>
            </footer>
        );
    }

    // ── Centered: stacked center — brand → links → social → legal ─────────
    if (variant === "centered") {
        return (
            <footer {...footerProps}>
                <div className="cst-footer-inner">
                    {brand && <div className="cst-footer-brand">{brand}</div>}
                    <LinksSlot links={links} ariaLabel={linksAriaLabel} />
                    <SocialSlot social={social} ariaLabel={socialAriaLabel} />
                    {legalContent && <p className="cst-footer-legal">{legalContent}</p>}
                </div>
            </footer>
        );
    }

    // ── Split: brand+legal left, links+social right (collapses on mobile) ──
    return (
        <footer {...footerProps}>
            <div className="cst-footer-inner">
                <div className="cst-footer-brand-legal">
                    {brand && <div className="cst-footer-brand">{brand}</div>}
                    {legalContent && <p className="cst-footer-legal">{legalContent}</p>}
                </div>
                <div className="cst-footer-end">
                    <LinksSlot links={links} ariaLabel={linksAriaLabel} />
                    <SocialSlot social={social} ariaLabel={socialAriaLabel} />
                </div>
            </div>
        </footer>
    );
}

export default FooterBase;
