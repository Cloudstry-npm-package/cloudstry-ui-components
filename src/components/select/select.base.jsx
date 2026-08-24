import {
    Fragment,
    forwardRef,
    useCallback,
    useId,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import "./select.css";

/**
 * Cloudstry Select — presentational layer (renderer-agnostic).
 *
 * COMPOSITION over the TextField shell + the Menu popup: the trigger is a
 * read-only `Field` (Input/InputSSR) so it inherits label/floatingLabel/
 * error/supportingText/tokens for free; the popup is `Menu`/`MenuItem`
 * (md-menu composition) anchored to the trigger. Neither `Field` nor
 * `Menu`/`MenuItem` are imported directly here — they're injected props —
 * so this base stays free of `@material/web` side-effects and backs both
 * the client and SSR entries without duplication (same technique as
 * `passwordField.base.jsx`'s `Field` injection).
 *
 * ARIA pattern: the popup is `role="listbox"` with `md-menu-item type="option"`
 * children (role="option"). `md-menu`'s own ElementInternals role defaults to
 * "menu" — the explicit `role="listbox"` attribute set below overrides that,
 * which IS effective. In `multiple` mode the listbox also carries
 * `aria-multiselectable="true"`.
 *
 * ⚠️ KNOWN ARIA LIMITATION on the TRIGGER (verified in-browser, resolves a
 * question left open when Select was first built): Material Web's text field
 * forces `role="presentation"` on its own host via ElementInternals — a bare
 * `md-outlined-text-field` created outside React already carries it — because
 * the real control is an `<input>` inside its shadow root. The
 * `role="combobox"` set below therefore does NOT reach the accessibility tree,
 * and it cannot simply be moved to the inner input because
 * `aria-controls`/`aria-activedescendant` are IDREFs and cannot cross the
 * shadow boundary to reach the popup. Keyboard operation is correct; the
 * announced role is not. Same limitation, and same fix, as `Combobox` — see
 * the note there.
 *
 * V3 additions:
 *   - `multiple` — array value, menu stays open while picking, selected labels
 *     are joined in the trigger.
 *   - `clearable` / `onClear` — trailing reset control, mirroring the behaviour
 *     `SearchField` already offers for text fields. Removes the hand-rolled
 *     "Reset" button every filtered list screen was writing next to a Select.
 *
 * @typedef {Object} SelectOption
 * @property {string} label
 * @property {string} value
 * @property {boolean} [disabled]
 *
 * @typedef {Object} SelectProps
 * @property {string|string[]} [value]   Controlled selection. Array when `multiple`.
 * @property {(value: string|string[]) => void} [onChange] Value-first change handler.
 *   Receives an array when `multiple`, a single value otherwise.
 * @property {SelectOption[]} options    Data-driven option list.
 * @property {boolean} [multiple]        Allow picking more than one option.
 * @property {boolean} [clearable]       Show a trailing clear control when something is selected.
 * @property {string} [clearLabel]       Accessible name for the clear control.
 * @property {() => void} [onClear]      Called after clearing (in addition to onChange).
 * @property {string} [placeholder]      Shown when nothing is selected.
 * @property {React.ReactNode} [endIcon] Defaults to a chevron; overridable.
 * ...plus the inherited TextField shell (label, floatingLabel, error,
 *    errorText, supportingText, required, disabled, name, id, className,
 *    fieldClassName, style, ref, ...rest).
 */

function ChevronIcon({ open }) {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
            className={`cst-select__chevron${open ? " cst-select__chevron--open" : ""}`}
        >
            <path d="M7 10l5 5 5-5z" fill="currentColor" />
        </svg>
    );
}

function ClearGlyph() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
                d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                fill="currentColor"
            />
        </svg>
    );
}

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

/** Normalize the controlled value to an array regardless of mode. */
function toArray(value) {
    if (value == null || value === "") return [];
    return Array.isArray(value) ? value : [value];
}

const SelectBase = forwardRef(function SelectBase(
    {
        Field,
        Menu,
        MenuItem,
        value,
        onChange = () => { },
        options = [],
        multiple = false,
        clearable = false,
        clearLabel = "Clear selection",
        onClear,
        placeholder = "",
        endIcon,
        disabled = false,
        readOnly: _ignoredReadOnly,
        menuClassName = "",
        id: customId,
        ...rest
    },
    ref
) {
    const [open, setOpen] = useState(false);
    const [menuWidth, setMenuWidth] = useState();
    const [triggerRef, callbackRef] = useMergedRef(ref);

    const reactId = useId();
    const id = customId || `cst-select-${reactId}`;
    const listboxId = `${id}-listbox`;

    const selectedValues = toArray(value);
    const isSelected = (optionValue) => selectedValues.includes(optionValue);

    // Trigger text: single mode shows the one label, multiple joins them in the
    // order the options are declared (stable, unlike selection order).
    const displayValue = multiple
        ? options.filter((opt) => isSelected(opt.value)).map((opt) => opt.label).join(", ")
        : (options.find((opt) => opt.value === value)?.label ?? "");

    const hasSelection = selectedValues.length > 0;
    const showClear = clearable && hasSelection && !disabled;

    // Popup width mirrors the trigger's rendered width (md-menu does not do
    // this on its own — it only anchors position, not size).
    useLayoutEffect(() => {
        if (!open) return;
        const el = triggerRef.current;
        if (el) setMenuWidth(el.offsetWidth);
    }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSelect = (option) => {
        if (option.disabled) return;
        if (multiple) {
            // Toggle membership; the popup deliberately stays open so several
            // options can be picked without reopening it each time.
            const next = isSelected(option.value)
                ? selectedValues.filter((v) => v !== option.value)
                : [...selectedValues, option.value];
            onChange(next);
            return;
        }
        onChange(option.value);
        setOpen(false);
    };

    const handleClear = (event) => {
        // The clear control sits inside the trigger, so its click would
        // otherwise bubble up and toggle the popup open.
        event.stopPropagation();
        event.preventDefault();
        onChange(multiple ? [] : "");
        onClear?.();
        setOpen(false);
        triggerRef.current?.focus?.();
    };

    const handleClose = () => {
        setOpen(false);
        // Defensive: return focus to the trigger even if md-menu already does.
        triggerRef.current?.focus?.();
    };

    const handleTriggerClick = () => {
        if (disabled) return;
        setOpen((prev) => !prev);
    };

    const handleTriggerKeyDown = (event) => {
        if (disabled) return;
        switch (event.key) {
            case "Enter":
            case " ":
            case "ArrowDown":
            case "ArrowUp":
                event.preventDefault();
                setOpen(true);
                break;
            case "Escape":
                setOpen(false);
                break;
            default:
                break;
        }
    };

    const chevron = endIcon ?? <ChevronIcon open={open} />;
    const trailing = showClear ? (
        <span className="cst-select__adornments">
            <button
                type="button"
                className="cst-select__clear"
                aria-label={clearLabel}
                // Keep the trigger's own keyboard contract intact: the clear
                // control is reachable by Tab but must not swallow Enter/Space
                // meant for opening the listbox.
                onClick={handleClear}
                onKeyDown={(event) => event.stopPropagation()}
            >
                <ClearGlyph />
            </button>
            {chevron}
        </span>
    ) : (
        chevron
    );

    return (
        <Fragment>
            <Field
                ref={callbackRef}
                {...rest}
                id={id}
                value={displayValue}
                placeholder={placeholder}
                readOnly
                disabled={disabled}
                role="combobox"
                aria-haspopup="listbox"
                // Explicit string: React writes a boolean `true` onto a custom
                // element as the empty attribute value.
                aria-expanded={open ? "true" : "false"}
                aria-controls={listboxId}
                endIcon={trailing}
                onClick={handleTriggerClick}
                onKeyDown={handleTriggerKeyDown}
            />
            <Menu
                id={listboxId}
                role="listbox"
                aria-multiselectable={multiple ? "true" : undefined}
                anchorRef={triggerRef}
                open={open}
                onClose={handleClose}
                menuClassName={["cst-select__menu", menuClassName].filter(Boolean).join(" ")}
                style={menuWidth ? { minWidth: menuWidth } : undefined}
            >
                {options.map((option) => (
                    <MenuItem
                        key={option.value}
                        type="option"
                        selected={isSelected(option.value)}
                        disabled={option.disabled}
                        // In multiple mode the item must not dismiss the popup.
                        keepOpen={multiple}
                        headline={option.label}
                        onClick={() => handleSelect(option)}
                    />
                ))}
            </Menu>
        </Fragment>
    );
});

export default SelectBase;
