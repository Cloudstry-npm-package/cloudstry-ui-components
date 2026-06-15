import { forwardRef, useCallback, useContext, useEffect, useRef } from "react";
import { RadioGroupContext } from "./radio-context.js";
import "./radio.css";

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
 * Cloudstry Radio — presentational layer.
 *
 * Renderer-agnostic public API over md-radio. Participates in RadioGroup context
 * when nested inside <RadioGroup>; works standalone when used directly.
 *
 * Recommended (inside RadioGroup):
 *   <RadioGroup value={v} onChange={setV}>
 *     <Radio value="email" label="Email" />
 *     <Radio value="phone" label="Phone" />
 *   </RadioGroup>
 *
 * Standalone controlled:
 *   <Radio value="email" label="Email" checked={checked} onChange={setChecked} />
 *
 * Children label (takes precedence over label prop):
 *   <Radio value="custom"><strong>Formatted</strong> label</Radio>
 *
 * Accessibility: provide `label`, `children`, `aria-label`, or `aria-labelledby`.
 * A dev warning fires when none are present.
 */
const RadioBase = forwardRef(function RadioBase(
    {
        // Value identity (required)
        value = "",
        // Standalone checked state (ignored when inside RadioGroup)
        checked,
        defaultChecked,
        // Form props
        disabled = false,
        required = false,
        name,
        // Presentation
        label,
        children,
        className = "",
        radioClassName = "",
        style,
        id: customId,
        // Callbacks
        onChange,           // (value: string) => void
        onNativeChange,     // (event: Event) => void — escape hatch
        // Passthrough (aria-*, data-*, …)
        ...rest
    },
    ref
) {
    const [innerRef, callbackRef] = useMergedRef(ref);

    // ---- RadioGroup context ------------------------------------------------
    const group = useContext(RadioGroupContext);

    // When inside a group, group coordinates name/checked/onChange.
    const effectiveName     = group ? group.groupName     : name;
    const effectiveDisabled = disabled || (group ? group.groupDisabled : false);
    const effectiveRequired = required || (group ? group.groupRequired : false);

    // checked: controlled if in group (group owns state) or if checked prop provided
    const isControlled      = group ? group.groupValue !== undefined : checked !== undefined;
    const effectiveChecked  = group
        ? group.groupValue === value
        : (checked !== undefined ? !!checked : undefined);

    // ---- Dev-mode warnings ------------------------------------------------
    if (isDev) {
        if (!group && checked !== undefined && defaultChecked !== undefined) {
            // eslint-disable-next-line no-console
            console.warn(
                "[Cloudstry Radio] Received both `checked` and `defaultChecked`. " +
                "Use `checked` for controlled or `defaultChecked` for uncontrolled, not both."
            );
        }
        if (!label && !children && !rest["aria-label"] && !rest["aria-labelledby"]) {
            // eslint-disable-next-line no-console
            console.warn(
                "[Cloudstry Radio] No accessible name provided. " +
                "Use the `label` prop, `children`, `aria-label`, or `aria-labelledby`."
            );
        }
    }

    // ---- Keep handlers in refs so mount-only listeners stay current --------
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;
    const onNativeChangeRef = useRef(onNativeChange);
    onNativeChangeRef.current = onNativeChange;
    const groupHandleChangeRef = useRef(group ? group.handleChange : null);
    groupHandleChangeRef.current = group ? group.handleChange : null;

    // ---- Attach native change listener once on mount ----------------------
    useEffect(() => {
        const el = innerRef.current;
        if (!el) return;
        const handler = (e) => {
            if (!e.target.checked) return; // radio only fires 'checked' transitions
            if (groupHandleChangeRef.current) {
                groupHandleChangeRef.current(value);
            } else {
                onChangeRef.current?.(value);
            }
            onNativeChangeRef.current?.(e);
        };
        el.addEventListener("change", handler);
        return () => el.removeEventListener("change", handler);
    }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

    // ---- Sync `checked` DOM property (React 18 safe) ----------------------
    // md-radio.checked is a getter/setter; boolean false passed as attribute
    // "false" is truthy in Lit. Set the property directly to avoid this.
    useEffect(() => {
        const el = innerRef.current;
        if (!el || !isControlled) return;
        el.checked = !!effectiveChecked;
    }, [effectiveChecked, isControlled]); // eslint-disable-line react-hooks/exhaustive-deps

    // ---- Uncontrolled: seed initial value once on mount (standalone only) --
    useEffect(() => {
        const el = innerRef.current;
        if (!el || group || isControlled || defaultChecked === undefined) return;
        el.checked = !!defaultChecked;
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ---- Build md-radio element -------------------------------------------
    const radioClasses = ["cst-radio", radioClassName].filter(Boolean).join(" ");

    const radioAttrs = {};
    if (effectiveDisabled) radioAttrs.disabled = true;
    if (effectiveRequired) radioAttrs.required = true;
    if (effectiveName) radioAttrs.name = effectiveName;
    if (value !== undefined) radioAttrs.value = value;
    if (customId) radioAttrs.id = customId;

    const element = (
        <md-radio
            ref={callbackRef}
            className={radioClasses}
            {...radioAttrs}
            {...rest}
        />
    );

    // ---- Resolve label content: children > label string > nothing ----------
    const labelNode = children !== undefined
        ? children
        : (label ? <span className="cst-radio-label-text">{label}</span> : null);

    if (labelNode) {
        return (
            <label
                className={`cst-radio-wrapper${className ? ` ${className}` : ""}`}
                data-disabled={effectiveDisabled || undefined}
                style={style}
            >
                {element}
                {labelNode}
            </label>
        );
    }

    // Standalone (no label) — thin wrapper for consistent structure
    return (
        <div
            className={`cst-radio-wrapper cst-radio-wrapper--standalone${className ? ` ${className}` : ""}`}
            data-disabled={effectiveDisabled || undefined}
            style={style}
        >
            {element}
        </div>
    );
});

export default RadioBase;
