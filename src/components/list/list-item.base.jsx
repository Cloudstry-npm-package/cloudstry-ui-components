import { forwardRef, isValidElement, cloneElement } from "react";

/**
 * Cloudstry ListItem — presentational layer.
 *
 * Maps a clean React prop API onto md-list-item's named slots and properties.
 * Consumers do not need to know MWC slot names or the `type` property values.
 *
 * Single line:
 *   <ListItem headline="Profile" />
 *
 * Two line:
 *   <ListItem headline="John Doe" supportingText="Administrator" />
 *
 * Rich content:
 *   <ListItem
 *     headline="John Doe"
 *     supportingText="Administrator"
 *     start={<Avatar />}
 *     end={<Badge value={3} />}
 *   />
 *
 * Trailing metadata:
 *   <ListItem headline="Message" supportingText="Preview…" trailingSupportingText="2m" />
 *
 * Clickable (renders as <button> semantically):
 *   <ListItem headline="Settings" onClick={handleClick} />
 *
 * Link (renders as <a> semantically):
 *   <ListItem headline="Profile" href="/profile" />
 *
 * Advanced (slot attributes directly on children):
 *   <ListItem>
 *     <md-icon slot="start">person</md-icon>
 *     <span slot="headline">Custom</span>
 *   </ListItem>
 *
 * Interactive type mapping (Cloudstry-to-MWC):
 *   href present       → type="link"   (MWC also auto-sets this via willUpdate)
 *   onClick (no href)  → type="button"
 *   neither            → type="text"   (display-only)
 */
const ListItemBase = forwardRef(function ListItemBase(
    {
        // Content slots (named prop API)
        headline,               // string | ReactNode → slot="headline"
        supportingText,         // string | ReactNode → slot="supporting-text"
        trailingSupportingText, // string | ReactNode → slot="trailing-supporting-text"
        start,                  // ReactNode → slot="start" (leading icon/avatar)
        end,                    // ReactNode → slot="end" (trailing icon/content)
        // Advanced: children with slot attributes (consumer manages slot names)
        children,
        // Interaction
        href,
        target,
        onClick,
        disabled = false,
        // Styling
        className = "",
        style,
        // Passthrough (aria-*, data-*, id, …)
        ...rest
    },
    ref
) {
    // ---- Interactive type mapping -----------------------------------------
    // MWC type controls which root element is rendered: li (text), button, or a.
    let mwcType = "text";
    if (href) {
        mwcType = "link"; // MWC auto-detects href but we set explicitly for clarity
    } else if (onClick) {
        mwcType = "button";
    }

    // ---- Slot assignment for start content --------------------------------
    let startNode = null;
    if (start != null) {
        if (isValidElement(start)) {
            startNode = cloneElement(start, { slot: "start" });
        } else {
            startNode = <span slot="start">{start}</span>;
        }
    }

    // ---- Slot assignment for end content ----------------------------------
    let endNode = null;
    if (end != null) {
        if (isValidElement(end)) {
            endNode = cloneElement(end, { slot: "end" });
        } else {
            endNode = <span slot="end">{end}</span>;
        }
    }

    // ---- Slot assignment for text content --------------------------------
    // MWC md-list-item v1.5.1 uses named slots for all text regions. There are
    // no headline/supportingText attributes — content must be placed via the
    // correct named slot attributes.
    const headlineNode = headline != null
        ? <span slot="headline">{headline}</span>
        : null;

    const supportingTextNode = supportingText != null
        ? <span slot="supporting-text">{supportingText}</span>
        : null;

    const trailingSupportingTextNode = trailingSupportingText != null
        ? <span slot="trailing-supporting-text">{trailingSupportingText}</span>
        : null;

    // ---- Build MWC attrs -------------------------------------------------
    const mdAttrs = { type: mwcType };
    if (disabled) mdAttrs.disabled = true;
    if (href) mdAttrs.href = href;
    if (target) mdAttrs.target = target;

    const classes = ["cst-list-item", className].filter(Boolean).join(" ");

    return (
        <md-list-item
            ref={ref}
            className={classes}
            style={style}
            onClick={onClick}
            {...mdAttrs}
            {...rest}
        >
            {startNode}
            {endNode}
            {headlineNode}
            {supportingTextNode}
            {trailingSupportingTextNode}
            {children}
        </md-list-item>
    );
});

export default ListItemBase;
