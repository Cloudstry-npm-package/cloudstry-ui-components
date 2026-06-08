import { forwardRef, useEffect, useRef, useState } from "react";
import "./searchField.css";

/**
 * Cloudstry SearchField — presentational layer (field-renderer agnostic).
 *
 * COMPOSITION over the TextField shell. Adds the search delta only: a leading
 * search glyph, an optional clear (×) button, optional debounced `onSearch`,
 * and Enter-to-search. Everything else (label, error/supportingText, tokens,
 * a11y, `forwardRef`) is inherited from the injected `Field` (Input / InputSSR).
 *
 * Value ownership: unlike PasswordField (a pure passthrough), SearchField must
 * drive the field's value so that `clearable` and `debounce` work reliably in
 * BOTH controlled and uncontrolled modes. It therefore renders the inner field
 * as controlled (`value={innerValue}`) and exposes controlled/uncontrolled at
 * its OWN boundary via `value` / `defaultValue`.
 *
 * NOT an autocomplete/combobox — there is no popup, list, or suggestion logic.
 *
 * @typedef {Object} SearchFieldProps
 * @property {string} [value]                 Controlled value (omit for uncontrolled).
 * @property {string} [defaultValue]          Initial value for uncontrolled mode.
 * @property {(value: string) => void} [onChange] Value-first change handler.
 * @property {(value: string) => void} [onSearch] Fires on Enter, and on change when `debounce` is set.
 * @property {number} [debounce]              ms to debounce `onSearch` on change. Omit = search on Enter only.
 * @property {boolean} [clearable=true]       Show a trailing clear button when non-empty.
 * @property {React.ReactNode} [startIcon]    Leading icon (defaults to a search glyph).
 * ...plus every TextField prop (label, placeholder, supportingText, error,
 *    disabled, name, className, style, ref, …).
 */

function SearchGlyph() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 5 1.5-1.5-5-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z" />
        </svg>
    );
}

function ClearGlyph() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
    );
}

const SearchFieldBase = forwardRef(function SearchFieldBase(
    {
        Field,
        value,
        defaultValue,
        onChange,
        onSearch,
        debounce,
        clearable = true,
        startIcon,
        endIcon,
        label = "",
        ...rest
    },
    ref
) {
    const isControlled = value !== undefined;
    const [innerValue, setInnerValue] = useState(
        isControlled ? value : defaultValue !== undefined ? defaultValue : ""
    );

    // Keep the inner value in sync when used as a controlled component.
    useEffect(() => {
        if (isControlled) setInnerValue(value);
    }, [isControlled, value]);

    const debounceTimer = useRef(null);
    useEffect(() => () => clearTimeout(debounceTimer.current), []);

    const useDebounce = typeof debounce === "number" && debounce >= 0;

    // Merge the forwarded ref with an internal ref so we can refocus on clear.
    const fieldRef = useRef(null);
    const setFieldRef = (node) => {
        fieldRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
    };

    const emitSearch = (v) => onSearch?.(v);

    const handleChange = (v) => {
        setInnerValue(v);
        onChange?.(v);
        if (useDebounce) {
            clearTimeout(debounceTimer.current);
            debounceTimer.current = setTimeout(() => emitSearch(v), debounce);
        }
    };

    const handleClear = () => {
        clearTimeout(debounceTimer.current);
        setInnerValue("");
        onChange?.("");
        emitSearch("");
        // Return focus to the field after clearing (expected search UX).
        fieldRef.current?.focus?.();
    };

    // Compose onKeyDown so Enter triggers an immediate search (flushing debounce)
    // without clobbering a consumer-supplied handler.
    const { onKeyDown: consumerKeyDown, ...restProps } = rest;
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            clearTimeout(debounceTimer.current);
            emitSearch(innerValue);
        }
        consumerKeyDown?.(event);
    };

    // Accessible name: search fields are usually label-less, so default an
    // aria-label of "Search" when the consumer gives neither label nor aria-*.
    const ariaLabelProp = restProps["aria-label"];
    const ariaLabelledByProp = restProps["aria-labelledby"];
    if (!label && !ariaLabelledByProp && !ariaLabelProp) {
        restProps["aria-label"] = "Search";
    }

    const resolvedStartIcon = startIcon !== undefined ? startIcon : <SearchGlyph />;

    const showClear = clearable && innerValue.length > 0 && !restProps.disabled && !restProps.readOnly;
    const resolvedEndIcon = showClear ? (
        <button
            type="button"
            className="cst-search__clear"
            aria-label="Clear search"
            onClick={handleClear}
        >
            <ClearGlyph />
        </button>
    ) : (
        endIcon
    );

    return (
        <Field
            ref={setFieldRef}
            {...restProps}
            label={label}
            type="search"
            value={innerValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            startIcon={resolvedStartIcon}
            endIcon={resolvedEndIcon}
        />
    );
});

export default SearchFieldBase;
