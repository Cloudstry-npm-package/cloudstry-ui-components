import { forwardRef, useCallback, useEffect, useRef } from "react";
import "./checkbox.css";

const isDev =
    typeof process !== "undefined" &&
    process.env &&
    process.env.NODE_ENV !== "production";

/**
 * Returns a single callback ref that writes to both an internal ref and the
 * external forwarded ref (function ref or object ref). Recreated only when the
 * external ref identity changes.
 */
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
 * Cloudstry Checkbox — presentational layer.
 *
 * Renderer-agnostic public API over md-checkbox. Handles React 18–20
 * property/attribute friction for `checked` and `indeterminate` via
 * imperative DOM property sync.
 *
 * Label usage (recommended):
 *   <Checkbox label="Accept Terms" />
 *
 * Controlled:
 *   <Checkbox checked={checked} onChange={(val) => setChecked(val)} />
 *
 * Indeterminate (e.g. "select all" with partial selection):
 *   <Checkbox indeterminate checked={false} onChange={handleSelectAll} />
 *
 * Accessibility: provide `label`, `aria-label`, or `aria-labelledby`.
 * Without one of these, a dev warning is emitted.
 */
const CheckboxBase = forwardRef(function CheckboxBase(
    {
        // State props
        checked,                  // controlled mode when defined
        defaultChecked,           // uncontrolled initial value
        indeterminate = false,    // partial-selection state
        // Form props
        disabled = false,
        required = false,
        name,
        value = "on",             // matches native checkbox default
        // Presentation
        label,                    // optional; renders an associated <label>
        size = "md",              // "sm" | "md" | "lg" — maps to --cst-checkbox-size
        // className/checkboxClassName target:
        //   className        → outer wrapper (<label> when label is set, <div> otherwise)
        //   checkboxClassName → md-checkbox element (for element-level token overrides)
        // CSS tokens set on className cascade to md-checkbox (descendant), so most
        // --cst-checkbox-* overrides work equally well on either prop.
        className = "",           // outer wrapper
        checkboxClassName = "",   // md-checkbox element
        style,
        id: customId,
        // Callbacks
        onChange,                 // (checked: boolean) => void
        // Passthrough (aria-*, data-*, onBlur, onFocus, ...)
        ...rest
    },
    ref
) {
    const [innerRef, callbackRef] = useMergedRef(ref);
    const isControlled = checked !== undefined;

    // ---- Dev-mode warnings ------------------------------------------------
    if (isDev) {
        if (isControlled && defaultChecked !== undefined) {
            // eslint-disable-next-line no-console
            console.warn(
                "[Cloudstry Checkbox] Received both `checked` and `defaultChecked`. " +
                "Use `checked` for controlled or `defaultChecked` for uncontrolled, not both."
            );
        }
        if (!label && !rest["aria-label"] && !rest["aria-labelledby"] && !customId) {
            // eslint-disable-next-line no-console
            console.warn(
                "[Cloudstry Checkbox] No accessible name provided. " +
                "Use the `label` prop, or add `aria-label` / `aria-labelledby`."
            );
        }
    }

    // ---- Keep onChange in a ref so the mount-only event listener is always
    //      calling the latest handler without needing to re-attach. -----------
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    // ---- Attach native change listener once on mount ----------------------
    // Using addEventListener is the most reliable approach for React 18–20;
    // React 18's synthetic onChange on custom elements has edge-case issues.
    useEffect(() => {
        const el = innerRef.current;
        if (!el) return;
        const handler = (e) => onChangeRef.current?.(e.target.checked);
        el.addEventListener("change", handler);
        return () => el.removeEventListener("change", handler);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ---- Sync `checked` DOM property (React 18 safe) ----------------------
    // React 18 passes boolean false as the string "false" attribute, which Lit
    // reads as truthy. We bypass this by setting the property directly.
    useEffect(() => {
        const el = innerRef.current;
        if (!el || !isControlled) return;
        el.checked = !!checked;
    }, [checked, isControlled]); // eslint-disable-line react-hooks/exhaustive-deps

    // ---- Uncontrolled: seed initial value once on mount -------------------
    useEffect(() => {
        const el = innerRef.current;
        if (!el || isControlled || defaultChecked === undefined) return;
        el.checked = !!defaultChecked;
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ---- Sync `indeterminate` DOM property --------------------------------
    // `indeterminate` has no HTML attribute — must always be set as a property.
    useEffect(() => {
        const el = innerRef.current;
        if (!el) return;
        el.indeterminate = !!indeterminate;
    }, [indeterminate]); // eslint-disable-line react-hooks/exhaustive-deps

    // ---- Build md-checkbox element ----------------------------------------
    const checkboxClasses = [
        "cst-checkbox",
        `cst-checkbox--${size}`,
        checkboxClassName,
    ]
        .filter(Boolean)
        .join(" ");

    // Only forward props that md-checkbox understands as attributes.
    // `checked` / `indeterminate` are handled imperatively via effects above.
    const checkboxAttrs = {};
    if (disabled) checkboxAttrs.disabled = true;
    if (required) checkboxAttrs.required = true;
    if (name) checkboxAttrs.name = name;
    if (value !== undefined) checkboxAttrs.value = value;
    if (customId) checkboxAttrs.id = customId;

    const element = (
        <md-checkbox
            ref={callbackRef}
            className={checkboxClasses}
            {...checkboxAttrs}
            {...rest}
        />
    );

    // ---- With label: wrap in <label> so clicking text activates checkbox --
    if (label) {
        return (
            <label
                className={`cst-checkbox-wrapper${className ? ` ${className}` : ""}`}
                data-disabled={disabled || undefined}
                style={style}
            >
                {element}
                <span className="cst-checkbox-label-text">{label}</span>
            </label>
        );
    }

    // ---- Without label: standalone wrapper (thin inline-flex container) ---
    return (
        <div
            className={`cst-checkbox-wrapper cst-checkbox-wrapper--standalone${className ? ` ${className}` : ""}`}
            data-disabled={disabled || undefined}
            style={style}
        >
            {element}
        </div>
    );
});

export default CheckboxBase;
