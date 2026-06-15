import { forwardRef, useCallback, useEffect, useId, useRef, isValidElement, cloneElement } from "react";
import { useTabsContext } from "./tabs-context.js";

/**
 * Cloudstry Tab — a single tab item inside <Tabs>.
 *
 * Reads `variant` from <Tabs> context and renders the correct MWC element:
 *   variant="primary"   → md-primary-tab
 *   variant="secondary" → md-secondary-tab
 *
 * With label:
 *   <Tab label="Home" />
 *
 * With icon (icon-only):
 *   <Tab icon={<HomeIcon />} aria-label="Home" />
 *
 * With icon + label (stacked by default, inline with inlineIcon):
 *   <Tab label="Home" icon={<HomeIcon />} />
 *   <Tab label="Home" icon={<HomeIcon />} inlineIcon />
 *
 * Disabled:
 *   <Tab label="Archive" disabled />
 *
 * Explicit id (for TabPanel aria-labelledby):
 *   <Tab label="Home" id="home-tab" />
 */
const TabBase = forwardRef(function TabBase(
    {
        // Content
        label,
        icon,               // ReactNode — placed in slot="icon"
        inlineIcon = false, // primary-tab only: icon inline with label (vs stacked)
        // State
        disabled = false,
        // A11y
        id: customId,
        // Styling
        className = "",
        style,
        // Passthrough (aria-*, data-*, …)
        ...rest
    },
    ref
) {
    const { variant } = useTabsContext();

    // ---- Stable auto-generated ID ------------------------------------------
    // useId() generates a stable ID for aria-labelledby wiring in TabPanel.
    // Consumer-provided `id` takes precedence.
    const autoId = useId();
    const resolvedId = customId ?? autoId;

    // ---- Merge consumer ref with internal ref for DOM property sync --------
    const innerRef = useRef(null);
    const callbackRef = useCallback(
        (node) => {
            innerRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
        },
        [ref]
    );

    // ---- Sync `inlineIcon` DOM property ------------------------------------
    // Lit attribute is `inline-icon` (kebab). React 18 cannot set camelCase
    // as kebab attribute on custom elements reliably, so use DOM property.
    // Only applies to md-primary-tab; secondary tabs ignore this prop.
    useEffect(() => {
        const el = innerRef.current;
        if (!el || variant !== "primary") return;
        el.inlineIcon = !!inlineIcon;
    }, [inlineIcon, variant]);

    // ---- Icon slot assignment -----------------------------------------------
    // MWC tab uses slot="icon" for leading icon content. Use cloneElement when
    // the icon is already a React element (sets slot prop without a wrapper),
    // otherwise wrap in a span to add slot attribution.
    let iconNode = null;
    if (icon != null) {
        if (isValidElement(icon)) {
            iconNode = cloneElement(icon, { slot: "icon" });
        } else {
            iconNode = <span slot="icon">{icon}</span>;
        }
    }

    // ---- Dynamic tag name --------------------------------------------------
    // Uppercase so JSX treats it as a variable (not a built-in HTML element).
    // React.createElement receives the string and creates the correct DOM node.
    const TagName = variant === "primary" ? "md-primary-tab" : "md-secondary-tab";

    // ---- Build attrs -------------------------------------------------------
    const tabClasses = ["cst-tab", disabled ? "cst-tab--disabled" : "", className]
        .filter(Boolean)
        .join(" ");

    const mdAttrs = { id: resolvedId };
    if (disabled) {
        // md-primary-tab / md-secondary-tab have no native disabled support in
        // v1.5.1. Use aria-disabled + CSS (pointer-events: none, opacity) to
        // simulate disabled without breaking the ARIA tree.
        mdAttrs["aria-disabled"] = "true";
        mdAttrs["data-disabled"] = "true";
    }

    return (
        <TagName
            ref={callbackRef}
            className={tabClasses}
            style={style}
            {...mdAttrs}
            {...rest}
        >
            {iconNode}
            {label}
        </TagName>
    );
});

export default TabBase;
