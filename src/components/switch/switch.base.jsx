import { forwardRef, useCallback, useEffect, useRef } from "react";
import "./switch.css";

const isDev =
    typeof process !== "undefined" &&
    process.env &&
    process.env.NODE_ENV !== "production";

function useMergedRef(externalRef) {
    const innerRef = useRef(null);
    const callbackRef = useCallback(
        (node) => {
            innerRef.current = node;
            if (typeof externalRef === "function") externalRef(node);
            else if (externalRef) externalRef.current = node;
        },
        [externalRef]
    );
    return [innerRef, callbackRef];
}

/**
 * Cloudstry Switch — presentational layer.
 *
 * Renderer-agnostic public API over md-switch. Maps `checked` → `selected`
 * internally to stay consistent with Checkbox. Handles React 18–20
 * property/attribute friction via imperative DOM property sync.
 *
 * Label usage (recommended):
 *   <Switch label="Enable notifications" />
 *   <Switch>Enable notifications</Switch>
 *
 * Controlled:
 *   <Switch checked={enabled} onChange={setEnabled} />
 *
 * Icons in thumb:
 *   <Switch icons label="Show icons" />
 *   <Switch showOnlySelectedIcon label="Selected icon only" />
 *
 * Accessibility: provide `label`, `children`, `aria-label`, or `aria-labelledby`.
 * Without one of these, a dev warning is emitted.
 */
const SwitchBase = forwardRef(function SwitchBase(
    {
        // State props
        checked,                        // controlled mode when defined
        defaultChecked,                 // uncontrolled initial value
        // Switch-specific display
        icons = false,                  // show both selected and deselected icons
        showOnlySelectedIcon = false,   // show only the selected icon
        // Form props
        disabled = false,
        required = false,
        name,
        value = "on",
        // Presentation
        label,
        children,
        className = "",
        switchClassName = "",
        style,
        // Callbacks
        onChange,                       // (checked: boolean) => void
        // Passthrough (aria-*, data-*, ...)
        ...rest
    },
    ref
) {
    const [innerRef, callbackRef] = useMergedRef(ref);
    const isControlled = checked !== undefined;

    // ---- Dev-mode warnings --------------------------------------------------
    if (isDev) {
        if (isControlled && defaultChecked !== undefined) {
            // eslint-disable-next-line no-console
            console.warn(
                "[Cloudstry Switch] Received both `checked` and `defaultChecked`. " +
                "Use `checked` for controlled or `defaultChecked` for uncontrolled, not both."
            );
        }
        const labelContent = children ?? label;
        if (!labelContent && !rest["aria-label"] && !rest["aria-labelledby"]) {
            // eslint-disable-next-line no-console
            console.warn(
                "[Cloudstry Switch] No accessible name provided. " +
                "Use the `label` prop, `children`, or add `aria-label` / `aria-labelledby`."
            );
        }
    }

    // ---- Keep onChange in a ref so mount-only listener stays current --------
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    // ---- Attach native change listener once on mount -----------------------
    // md-switch fires `change` when `selected` changes due to user interaction.
    // e.target.selected reflects the new state (md-switch uses `selected`, not `checked`).
    useEffect(() => {
        const el = innerRef.current;
        if (!el) return;
        const handler = (e) => onChangeRef.current?.(e.target.selected);
        el.addEventListener("change", handler);
        return () => el.removeEventListener("change", handler);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ---- Sync `selected` DOM property (checked → selected) -----------------
    // md-switch uses `selected`, not `checked`. Cloudstry exposes `checked`
    // for API consistency with Checkbox. React 18 boolean attribute issue
    // (false → "false" string) requires imperative property sync.
    useEffect(() => {
        const el = innerRef.current;
        if (!el || !isControlled) return;
        el.selected = !!checked;
    }, [checked, isControlled]); // eslint-disable-line react-hooks/exhaustive-deps

    // ---- Uncontrolled: seed initial value once on mount --------------------
    useEffect(() => {
        const el = innerRef.current;
        if (!el || isControlled || defaultChecked === undefined) return;
        el.selected = !!defaultChecked;
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ---- Sync `showOnlySelectedIcon` DOM property --------------------------
    // Lit attribute is `show-only-selected-icon` (kebab). React 18 passes
    // camelCase as `showonlyselectedicon` (all lowercase), which Lit does not
    // recognise as the expected `show-only-selected-icon` attribute.
    // Set via DOM property to avoid the attribute name mismatch.
    useEffect(() => {
        const el = innerRef.current;
        if (!el) return;
        el.showOnlySelectedIcon = !!showOnlySelectedIcon;
    }, [showOnlySelectedIcon]);

    // ---- Build md-switch element -------------------------------------------
    const switchClasses = ["cst-switch", switchClassName].filter(Boolean).join(" ");

    // Only forward props md-switch understands as attributes.
    // `checked` / `showOnlySelectedIcon` are handled imperatively above.
    // `icons` has a matching lowercase attribute name — safe to pass as JSX attr.
    const switchAttrs = {};
    if (disabled) switchAttrs.disabled = true;
    if (required) switchAttrs.required = true;
    if (name)     switchAttrs.name     = name;
    if (value !== undefined) switchAttrs.value = value;
    if (icons) switchAttrs.icons = true;

    const labelContent = children ?? label;

    const element = (
        <md-switch
            ref={callbackRef}
            className={switchClasses}
            {...switchAttrs}
            {...rest}
        />
    );

    // ---- With label/children: wrap in <label> so clicking text toggles switch
    if (labelContent) {
        return (
            <label
                className={`cst-switch-wrapper${className ? ` ${className}` : ""}`}
                data-disabled={disabled || undefined}
                style={style}
            >
                {element}
                <span className="cst-switch-label-text">{labelContent}</span>
            </label>
        );
    }

    // ---- Without label: standalone wrapper (thin inline-flex container) ----
    return (
        <div
            className={`cst-switch-wrapper cst-switch-wrapper--standalone${className ? ` ${className}` : ""}`}
            data-disabled={disabled || undefined}
            style={style}
        >
            {element}
        </div>
    );
});

export default SwitchBase;
