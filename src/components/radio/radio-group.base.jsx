import { forwardRef, useCallback, useMemo, useRef, useState } from "react";
import { RadioGroupContext } from "./radio-context.js";

let _autoId = 0;

/**
 * Cloudstry RadioGroup — presentational layer.
 *
 * Manages group-level state, coordinates the shared `name` attribute, and
 * provides RadioGroupContext to nested Radio children.
 *
 * Controlled:
 *   <RadioGroup value={method} onChange={setMethod} label="Contact method">
 *     <Radio value="email" label="Email" />
 *     <Radio value="phone" label="Phone" />
 *   </RadioGroup>
 *
 * Uncontrolled:
 *   <RadioGroup defaultValue="email" label="Contact method">
 *     <Radio value="email" label="Email" />
 *     <Radio value="phone" label="Phone" />
 *   </RadioGroup>
 *
 * No label (uses role="radiogroup"):
 *   <RadioGroup aria-label="Contact method">
 *     <Radio value="email" label="Email" />
 *   </RadioGroup>
 *
 * When `label` is provided the group renders a <fieldset> + <legend> for the
 * best screen-reader semantics. Without a label it renders a <div role="radiogroup">.
 *
 * Accessibility: pass `label` or `aria-label`/`aria-labelledby` on the group.
 */
const RadioGroupBase = forwardRef(function RadioGroupBase(
    {
        value,                      // controlled: string | null | undefined
        defaultValue,               // uncontrolled: initial selected value
        onChange,                   // (value: string) => void
        name,                       // shared name for all child radios
        label,                      // group label; drives fieldset+legend when present
        disabled = false,
        required = false,
        orientation = "vertical",   // "vertical" | "horizontal"
        children,
        className = "",
        style,
        ...rest                     // aria-*, data-*, id, …
    },
    ref
) {
    const isControlled = value !== undefined;

    // ---- Stable auto-generated name ----------------------------------------
    // useRef so the name never changes across renders when not provided.
    const autoName = useRef(null);
    if (autoName.current === null) {
        _autoId += 1;
        autoName.current = `cst-radio-group-${_autoId}`;
    }
    const groupName = name ?? autoName.current;

    // ---- Uncontrolled internal state ---------------------------------------
    const [uncontrolledValue, setUncontrolledValue] = useState(
        defaultValue !== undefined ? defaultValue : null
    );

    const groupValue = isControlled ? value : uncontrolledValue;

    // ---- Keep onChange in a ref so context consumers stay current ----------
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    // ---- Group change handler (stable reference via useCallback) -----------
    const handleChange = useCallback(
        (newValue) => {
            if (!isControlled) {
                setUncontrolledValue(newValue);
            }
            onChangeRef.current?.(newValue);
        },
        [isControlled]
    );

    // ---- Memoized context to avoid re-rendering all child Radios -----------
    const contextValue = useMemo(
        () => ({
            groupValue,
            groupName,
            groupDisabled: disabled,
            groupRequired: required,
            handleChange,
        }),
        [groupValue, groupName, disabled, required, handleChange]
    );

    const groupClasses = [
        "cst-radio-group",
        `cst-radio-group--${orientation}`,
        className,
    ]
        .filter(Boolean)
        .join(" ");

    const content = (
        <RadioGroupContext.Provider value={contextValue}>
            <div className="cst-radio-group-items">
                {children}
            </div>
        </RadioGroupContext.Provider>
    );

    // ---- With label: fieldset + legend for best a11y semantics -------------
    if (label) {
        return (
            <fieldset
                ref={ref}
                className={groupClasses}
                disabled={disabled || undefined}
                style={style}
                {...rest}
            >
                <legend className="cst-radio-group-legend">{label}</legend>
                {content}
            </fieldset>
        );
    }

    // ---- Without label: div with role="radiogroup" -------------------------
    return (
        <div
            ref={ref}
            role="radiogroup"
            className={groupClasses}
            aria-disabled={disabled || undefined}
            style={style}
            {...rest}
        >
            {content}
        </div>
    );
});

export default RadioGroupBase;
