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
 * ARIA pattern: trigger is `role="combobox"` (aria-haspopup="listbox",
 * aria-expanded, aria-controls); the popup is `role="listbox"` with
 * `md-menu-item type="option"` children (role="option", `selected` drives
 * aria-selected). `md-menu`'s own ElementInternals role defaults to "menu" —
 * the explicit `role="listbox"` attribute set below overrides that.
 *
 * @typedef {Object} SelectOption
 * @property {string} label
 * @property {string} value
 * @property {boolean} [disabled]
 *
 * @typedef {Object} SelectProps
 * @property {string} [value]            Controlled selected value.
 * @property {(value: string) => void} [onChange] Value-first change handler.
 * @property {SelectOption[]} options    Data-driven option list.
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

const SelectBase = forwardRef(function SelectBase(
    {
        Field,
        Menu,
        MenuItem,
        value,
        onChange = () => { },
        options = [],
        placeholder = "",
        endIcon,
        disabled = false,
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

    const selectedOption = options.find((opt) => opt.value === value);
    const displayValue = selectedOption ? selectedOption.label : "";

    // Popup width mirrors the trigger's rendered width (md-menu does not do
    // this on its own — it only anchors position, not size).
    useLayoutEffect(() => {
        if (!open) return;
        const el = triggerRef.current;
        if (el) setMenuWidth(el.offsetWidth);
    }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSelect = (option) => {
        if (option.disabled) return;
        onChange(option.value);
        setOpen(false);
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
                aria-expanded={open}
                aria-controls={listboxId}
                endIcon={endIcon ?? <ChevronIcon open={open} />}
                onClick={handleTriggerClick}
                onKeyDown={handleTriggerKeyDown}
            />
            <Menu
                id={listboxId}
                role="listbox"
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
                        selected={option.value === value}
                        disabled={option.disabled}
                        headline={option.label}
                        onClick={() => handleSelect(option)}
                    />
                ))}
            </Menu>
        </Fragment>
    );
});

export default SelectBase;
