import { forwardRef, useId, useState } from "react";
import "./passwordField.css";

/**
 * Cloudstry PasswordField — presentational layer (field-renderer agnostic).
 *
 * COMPOSITION over the TextField shell: this component owns ONLY the password
 * delta (a reveal/hide toggle) and renders an injected `Field` component
 * (`Input` on the client, `InputSSR` for deferred registration). It therefore
 * inherits the entire TextField contract for free — label, floatingLabel,
 * error/supportingText, tokens, slots, `forwardRef`, controlled/uncontrolled,
 * and `...rest` passthrough. There is NO separate field architecture.
 *
 * Why a `Field` prop instead of importing Input directly: it keeps this base
 * free of `@material/web` side-effects so the same toggle logic backs both the
 * client and SSR entries without duplication.
 *
 * @typedef {Object} PasswordFieldProps
 * @property {boolean} [visibilityToggle=true]  Render the trailing show/hide toggle.
 * @property {boolean} [defaultVisible=false]    Initial reveal state.
 * @property {(visible: boolean) => void} [onVisibilityChange] Fires when toggled.
 * ...plus every TextField prop (label, value, defaultValue, onChange, error,
 *    supportingText, required, disabled, readOnly, name, className, style, ref…).
 */

function EyeIcon({ open }) {
    // Two glyphs: open eye (currently visible) vs slashed eye (hidden).
    return open ? (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
        </svg>
    ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M12 7a5 5 0 0 1 5 5c0 .65-.13 1.26-.36 1.83l2.92 2.92A11.8 11.8 0 0 0 22 12s-3-7-10-7c-1.27 0-2.49.2-3.64.57l2.17 2.17C11.1 7.26 11.54 7 12 7zM2 4.27l2.28 2.28A11.8 11.8 0 0 0 2 12s3 7 10 7c1.55 0 3.03-.3 4.38-.84l3.35 3.35 1.27-1.27L3.27 3 2 4.27z" />
        </svg>
    );
}

const PasswordFieldBase = forwardRef(function PasswordFieldBase(
    {
        Field,
        visibilityToggle = true,
        defaultVisible = false,
        onVisibilityChange,
        // We own `type`; never let a caller force it on a password field.
        type: _ignoredType,
        // If the toggle is disabled, a caller may still supply their own endIcon.
        endIcon,
        disabled = false,
        ...rest
    },
    ref
) {
    const [visible, setVisible] = useState(defaultVisible);
    const reactId = useId();
    const toggleId = `cst-pwd-toggle-${reactId}`;

    const toggle = () => {
        setVisible((prev) => {
            const next = !prev;
            onVisibilityChange?.(next);
            return next;
        });
    };

    const toggleButton = visibilityToggle ? (
        <button
            type="button"
            id={toggleId}
            className="cst-password__toggle"
            // Toggle reflects pressed-state; label describes the ACTION.
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            // Don't steal focus-blur validation; keep it out of the tab-on-submit
            // path only if the field is disabled.
            disabled={disabled}
            onClick={toggle}
            tabIndex={disabled ? -1 : 0}
        >
            <EyeIcon open={visible} />
        </button>
    ) : (
        endIcon
    );

    return (
        <Field
            ref={ref}
            {...rest}
            disabled={disabled}
            type={visible ? "text" : "password"}
            endIcon={toggleButton}
        />
    );
});

export default PasswordFieldBase;
