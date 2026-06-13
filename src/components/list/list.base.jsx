import { forwardRef } from "react";
import "./list.css";

/**
 * Cloudstry List — container presentational layer.
 *
 * Wraps md-list (renders as <ul>). Manages keyboard navigation for interactive
 * list items internally via MWC. Provide ListItem children directly.
 *
 * Usage:
 *   <List>
 *     <ListItem headline="Primary text" />
 *     <ListItem headline="Two line" supportingText="Secondary text" />
 *   </List>
 *
 * Navigation context (consumer responsibility — do not force semantics into
 * the component):
 *   <nav aria-label="Main Navigation">
 *     <List>…</List>
 *   </nav>
 */
const ListBase = forwardRef(function ListBase(
    {
        children,
        className = "",
        style,
        ...rest
    },
    ref
) {
    const classes = ["cst-list", className].filter(Boolean).join(" ");

    return (
        <md-list ref={ref} className={classes} style={style} {...rest}>
            {children}
        </md-list>
    );
});

export default ListBase;
