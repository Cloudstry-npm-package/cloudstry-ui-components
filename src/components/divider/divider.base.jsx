import { forwardRef } from "react";
import "./divider.css";

/**
 * Cloudstry Divider — presentational layer.
 *
 * Pure CSS implementation — no MWC dependency.
 * Renders a semantic <hr> element styled with --cst-divider-* tokens.
 *
 * Horizontal (default):
 *   <Divider />
 *
 * Inset variants (indent from one or both sides):
 *   <Divider inset />           both sides
 *   <Divider insetStart />      leading edge only
 *   <Divider insetEnd />        trailing edge only
 *
 * Vertical (for toolbars, flex-row layouts):
 *   <Divider vertical />
 *
 * Decorative (no semantic meaning in context):
 *   <Divider aria-hidden="true" />
 *
 * `inset` is a shorthand for insetStart + insetEnd. If both insetStart and
 * insetEnd are supplied without inset, both edges are indented independently.
 */
const DividerBase = forwardRef(function DividerBase(
    {
        inset = false,
        insetStart = false,
        insetEnd = false,
        vertical = false,
        className = "",
        ...rest
    },
    ref
) {
    const classes = [
        "cst-divider",
        vertical ? "cst-divider--vertical" : "cst-divider--horizontal",
        inset && "cst-divider--inset",
        !inset && insetStart && "cst-divider--inset-start",
        !inset && insetEnd && "cst-divider--inset-end",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    // Vertical dividers need explicit aria-orientation — <hr> defaults to horizontal
    const ariaProps = {};
    if (vertical && !rest["aria-orientation"]) {
        ariaProps["aria-orientation"] = "vertical";
    }

    return (
        <hr
            ref={ref}
            className={classes}
            {...ariaProps}
            {...rest}
        />
    );
});

export default DividerBase;
