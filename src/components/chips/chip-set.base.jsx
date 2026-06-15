import { forwardRef } from "react";
import "./chips.css";

/**
 * Cloudstry ChipSet — presentational layer.
 *
 * A wrapping flex layout container for chips. Renders as `md-chip-set`, which
 * has `display: flex; flex-wrap: wrap; gap: 8px` on the host.
 *
 * When `aria-label` is provided, the component receives `role="group"` to
 * communicate that the contained chips form a logically related group
 * (e.g. a set of filter chips that all filter the same data set).
 *
 *   <ChipSet aria-label="Filter by category">
 *     <FilterChip label="Sports" … />
 *     <FilterChip label="Music"  … />
 *   </ChipSet>
 */
const ChipSetBase = forwardRef(function ChipSetBase(
    {
        children,
        "aria-label": ariaLabel,
        className = "",
        style,
        ...rest
    },
    ref
) {
    const classes = ["cst-chip-set", className].filter(Boolean).join(" ");

    return (
        <md-chip-set
            ref={ref}
            className={classes}
            style={style}
            {...(ariaLabel ? { role: "group", "aria-label": ariaLabel } : {})}
            {...rest}
        >
            {children}
        </md-chip-set>
    );
});

export default ChipSetBase;
