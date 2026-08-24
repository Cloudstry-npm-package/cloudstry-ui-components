import { forwardRef } from "react";
import { resolveIcon } from "../../icons/index.jsx";
import "./tag.css";

/**
 * Cloudstry Tag — a read-only, non-interactive status label.
 *
 * This is the third distinct thing in the "small coloured element" family, and
 * the one that was missing:
 *
 *   Badge  — a dot or count overlaid on the CORNER of another element
 *            (notifications on an icon). aria-hidden; not standalone text.
 *   Chips  — INTERACTIVE controls (filter, assist, suggestion, input/removable).
 *   Tag    — a standalone, non-interactive coloured LABEL. "Ongoing",
 *            "Completed", "Draft". No click target, no remove button.
 *
 * Reach for Tag wherever a row or card needs to state a status in words. It is
 * plain CSS over a <span> — no Material Web element, no client boundary, so it
 * renders in a Server Component unchanged.
 *
 *   <Tag variant="success">Completed</Tag>
 *   <Tag variant="warning" dot>Ongoing</Tag>
 *   <Tag variant="neutral" size="sm" icon="checkIcon">Verified</Tag>
 *
 * ACCESSIBILITY: a Tag is just text, so it is announced in reading order like
 * any other text. Colour is never the only carrier of meaning — the label says
 * what the status is. When the visible text is an abbreviation, pass an
 * `aria-label` with the full wording.
 *
 * @typedef {Object} TagProps
 * @property {"neutral"|"brand"|"info"|"success"|"warning"|"error"} [variant]
 * @property {"sm"|"md"} [size]
 * @property {boolean} [dot]        Leading status dot in the variant colour.
 * @property {React.ReactNode|string} [icon] Leading icon (registry name or node).
 * @property {React.ReactNode} [children]
 * @property {string} [label]       Back-compat alias used when children is absent.
 */

const VARIANTS = ["neutral", "brand", "info", "success", "warning", "error"];

const TagBase = forwardRef(function TagBase(
    {
        children,
        label,
        variant = "neutral",
        size = "md",
        dot = false,
        icon = null,
        className = "",
        style,
        ...rest
    },
    ref
) {
    const content = children ?? label;
    const safeVariant = VARIANTS.includes(variant) ? variant : "neutral";
    const iconNode = resolveIcon(icon);

    const classes = [
        "cst-tag",
        `cst-tag--${safeVariant}`,
        `cst-tag--${size}`,
        dot ? "cst-tag--dot" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <span ref={ref} className={classes} style={style} {...rest}>
            {dot && <span className="cst-tag__dot" aria-hidden="true" />}
            {iconNode && <span className="cst-tag__icon" aria-hidden="true">{iconNode}</span>}
            {content != null && content !== "" && (
                <span className="cst-tag__label">{content}</span>
            )}
        </span>
    );
});

export default TagBase;
