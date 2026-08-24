import { forwardRef, useId, useState } from "react";
import "./input.css";

/**
 * Cloudstry Input / TextField — presentational layer.
 *
 * Renderer-agnostic, React-first public API: consumers never touch
 * `@material/web` tags, slot names, or `--md-*` token names directly. This
 * component maps a small, stable React API onto the current Material 3
 * text-field renderer (`md-outlined-text-field` / `md-filled-text-field`).
 *
 * Key design points (see Documents/Input/input-modernization-plan.md):
 *  - value-first `onChange(value)` (kept — 100% of consumers use it this way).
 *  - Label model supports BOTH: an external top `<label>` (default, zero visual
 *    change) and the M3 floating label (opt-in per field via `floatingLabel`).
 *  - First-class `error` (string) + `supportingText` mapped onto the element's
 *    native `error`/`errorText`/`supportingText` (a11y wired inside the element).
 *  - `className` targets the WRAPPER (layout); the host field is themed via the
 *    `--cst-input-*` token contract, with `fieldClassName` for advanced host-box
 *    overrides. `style` lands on the wrapper so per-instance `--cst-input-*`
 *    overrides cascade into the field.
 *  - `forwardRef` to the underlying element (focus()/select()/reportValidity()).
 *  - `...rest` is forwarded onto the element (aria-*, data-*, onBlur, name, …).
 *
 *  - Controlled OR uncontrolled: pass `value` (controlled) or `defaultValue`
 *    (uncontrolled — the field tracks its own value internally). `onChange`
 *    stays value-first in both modes.
 *
 * @typedef {Object} InputProps
 * @property {string} [value]            Controlled value (omit for uncontrolled).
 * @property {string} [defaultValue]     Initial value for uncontrolled mode.
 * @property {(value: string) => void} [onChange] Value-first change handler.
 * @property {(value: string, event: KeyboardEvent) => void} [onEnter] Fires when
 *   Enter is pressed in the field. Parity with `OtpInput.onEnter` /
 *   `SearchField.onSearch`. A consumer-supplied `onKeyDown` still runs — this
 *   composes with it rather than replacing it. Not fired on a multiline field,
 *   where Enter inserts a newline.
 * @property {boolean} [submitOnEnter]   Set `false` to opt out of implicit form
 *   submission. By default, pressing Enter in a field inside a `<form>` submits
 *   it, the way a native `<input>` does — see the note in `handleKeyDown` for
 *   why that needs code rather than coming for free. Calling `preventDefault()`
 *   from `onEnter`/`onKeyDown` suppresses it for a single keystroke.
 * @property {string} [label]            Field label.
 * @property {boolean} [floatingLabel]   Opt into the M3 floating label (default external).
 * @property {string} [placeholder]
 * @property {"outlined"|"filled"} [variant]
 * @property {string|boolean} [error]    Controlled error; truthy string ⇒ error state + message.
 * @property {string} [errorText]        Error message when `error` is boolean (alias).
 * @property {string} [supportingText]   M3 supporting/helper text (below the field).
 * @property {boolean} [required]
 * @property {boolean} [disabled]
 * @property {boolean} [readOnly]
 * @property {string} [type]             text|email|password|search|tel|url|number|textarea
 * @property {boolean} [multiline]       Sugar for type="textarea".
 * @property {number} [rows]             Rows for textarea.
 * @property {React.ReactNode} [startIcon] Leading icon (→ leading-icon slot).
 * @property {React.ReactNode} [endIcon]   Trailing icon (→ trailing-icon slot).
 * @property {string} [prefix]           Prefix text shown before the value.
 * @property {string} [suffix]           Suffix text shown after the value.
 * @property {number} [maxLength]        Enables the native character counter.
 * @property {string} [name]             Form field name.
 * @property {string} [autoComplete]     → element `autocomplete`.
 * @property {string} [id]
 * @property {string} [className]        Applied to the WRAPPER (layout).
 * @property {string} [fieldClassName]   Applied to the host field (advanced host-box overrides).
 * @property {React.CSSProperties} [style] Applied to the WRAPPER (per-instance token overrides).
 */

const VARIANT_TAGS = {
    outlined: "md-outlined-text-field",
    filled: "md-filled-text-field",
};

/**
 * Normalize the `error` / `errorText` props into a single (hasError, message).
 * Mirrors MWC semantics: `errorText` replaces supporting text only when the
 * element is in the error state and the message is non-empty.
 *  - error="msg"            → error state, message "msg"      (primary API)
 *  - error={true} errorText → error state, message errorText  (MWC shape)
 *  - error={false}          → no error
 *  - errorText="msg" only   → error state, message "msg"      (alias)
 */
function resolveError(error, errorText) {
    if (typeof error === "string") {
        return { hasError: error.trim().length > 0, message: error };
    }
    if (error === true) {
        return { hasError: true, message: errorText || "" };
    }
    if (error === false) {
        return { hasError: false, message: "" };
    }
    if (typeof errorText === "string" && errorText.trim().length > 0) {
        return { hasError: true, message: errorText };
    }
    return { hasError: false, message: "" };
}

const InputBase = forwardRef(function InputBase(
    {
        value,
        defaultValue,
        onChange = () => { },
        onEnter,
        submitOnEnter,          // set false to opt out of implicit form submission
        label = "",
        floatingLabel = false,
        placeholder = "",
        variant = "outlined",
        error,
        errorText,
        supportingText = "",
        required = false,
        disabled = false,
        readOnly = false,
        type = "text",
        multiline = false,
        rows,
        startIcon = null,
        endIcon = null,
        prefix,
        suffix,
        maxLength,
        name,
        autoComplete,
        id: customId,
        className = "",
        fieldClassName = "",
        style,
        ...rest
    },
    ref
) {
    const reactId = useId();
    const id = customId || `cst-input-${reactId}`;

    // Controlled vs uncontrolled: `value` present ⇒ controlled (consumer owns
    // the value); otherwise the field owns it internally, seeded by
    // `defaultValue`. `onChange` fires value-first in both modes.
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(
        defaultValue !== undefined ? defaultValue : ""
    );
    const currentValue = isControlled ? value : internalValue;

    const Tag = VARIANT_TAGS[variant] || VARIANT_TAGS.outlined;
    const resolvedType = multiline ? "textarea" : type;
    const { hasError, message } = resolveError(error, errorText);

    // External label is the default; floatingLabel opts into the M3 anatomy.
    const showExternalLabel = Boolean(label) && !floatingLabel;

    const wrapperClasses = [
        "cst-input",
        `cst-input--${variant}`,
        floatingLabel ? "cst-input--floating" : "cst-input--external-label",
        hasError ? "cst-input--error" : "",
        disabled ? "cst-input--disabled" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    // Properties mapped onto the element. Built conditionally so we never push
    // `undefined`/empty values that would clobber the element's own defaults.
    const fieldProps = {
        id,
        placeholder,
        type: resolvedType,
        value: currentValue,
        required,
        disabled,
        readOnly,
        error: hasError,
        errorText: message,
        supportingText,
        hasLeadingIcon: Boolean(startIcon),
        hasTrailingIcon: Boolean(endIcon),
    };
    if (floatingLabel && label) fieldProps.label = label;
    if (prefix) fieldProps.prefixText = prefix;
    if (suffix) fieldProps.suffixText = suffix;
    if (name) fieldProps.name = name;
    if (autoComplete) fieldProps.autocomplete = autoComplete;
    if (typeof maxLength === "number") fieldProps.maxLength = maxLength;
    if (resolvedType === "textarea" && typeof rows === "number") fieldProps.rows = rows;

    const handleInput = (event) => {
        const next = event.target.value;
        if (!isControlled) setInternalValue(next);
        onChange(next);
    };

    // Enter-to-submit convenience. Composed with (never replacing) a
    // consumer-supplied onKeyDown, which is why onKeyDown is pulled out of
    // `rest` here instead of being spread straight onto the element.
    const { onKeyDown: consumerKeyDown, ...restProps } = rest;
    const handleKeyDown = (event) => {
        // On a textarea Enter inserts a newline; firing onEnter (or submitting)
        // there would make the field impossible to use for multi-line input.
        if (event.key !== "Enter" || resolvedType === "textarea") {
            consumerKeyDown?.(event);
            return;
        }

        onEnter?.(event.target.value, event);
        consumerKeyDown?.(event);

        // Implicit form submission.
        //
        // A native <input> in a <form> submits on Enter for free. This field is
        // an <input> inside the Material Web element's SHADOW root, so it is not
        // one of the form's own controls — and the submit Button is a
        // form-associated custom element, which the browser's implicit-submission
        // algorithm does not accept as a "default button" either. Between them,
        // Enter did nothing at all. Reproduce the native behaviour explicitly.
        //
        // Respects preventDefault, so a consumer handler (or a composed control
        // like Combobox/Select, which use Enter to commit a highlighted option)
        // can suppress it.
        if (event.defaultPrevented || submitOnEnter === false) return;
        const form = event.currentTarget?.closest?.("form");
        if (form && typeof form.requestSubmit === "function") {
            event.preventDefault();
            form.requestSubmit();
        }
    };

    const isDev =
        typeof process !== "undefined" &&
        process.env &&
        process.env.NODE_ENV !== "production";

    // Dev-only nudge: don't mix controlled (`value`) and uncontrolled
    // (`defaultValue`) — React's own rule. Pick one.
    if (isDev && isControlled && defaultValue !== undefined) {
        // eslint-disable-next-line no-console
        console.warn(
            "[Cloudstry Input] Received both `value` and `defaultValue`. " +
            "Use `value` for controlled or `defaultValue` for uncontrolled, not both."
        );
    }

    // Dev-only a11y nudge: a field needs an accessible name (external/floating
    // label or aria-label). A placeholder alone is not a label.
    if (
        isDev &&
        !label &&
        !rest["aria-label"] &&
        !rest["aria-labelledby"]
    ) {
        // eslint-disable-next-line no-console
        console.warn(
            "[Cloudstry Input] Field has no `label` or `aria-label`; " +
            "provide one for accessibility (placeholder is not a label)."
        );
    }

    return (
        <div className={wrapperClasses} style={style}>
            {showExternalLabel && (
                <label htmlFor={id} className="cst-input__label">
                    {label}
                </label>
            )}

            <Tag
                ref={ref}
                {...restProps}
                {...fieldProps}
                className={fieldClassName || undefined}
                onInput={handleInput}
                onKeyDown={handleKeyDown}
            >
                {startIcon && (
                    <span slot="leading-icon" className="cst-input__icon cst-input__icon--start">
                        {startIcon}
                    </span>
                )}
                {endIcon && (
                    <span slot="trailing-icon" className="cst-input__icon cst-input__icon--end">
                        {endIcon}
                    </span>
                )}
            </Tag>
        </div>
    );
});

export default InputBase;
