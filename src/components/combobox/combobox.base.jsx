import {
    forwardRef,
    useCallback,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";
import {
    useFloating,
    autoUpdate,
    offset,
    flip,
    shift,
    size,
    useDismiss,
    useInteractions,
} from "@floating-ui/react";
import "./combobox.css";

/**
 * Cloudstry Combobox — presentational layer (renderer-agnostic).
 *
 * The search-as-you-type picker `SearchField` deliberately is not, and `Select`
 * cannot be: type to filter, pick one or many, show the picks as removable
 * chips, optionally create a value that isn't in the list.
 *
 * COMPOSITION over the TextField shell (`Field`) for the visible input, with a
 * Cloudstry-owned listbox popup. `Field`, `Chip` and `ChipContainer` are
 * injected props (never imported here) so this base stays free of
 * `@material/web` side-effects — same technique as `select.base.jsx`.
 *
 * WHY NOT md-menu (unlike Select): `md-menu` owns focus, roving tabindex and
 * typeahead over its items. A combobox must keep DOM focus in the text input
 * while the highlighted option is published via `aria-activedescendant`, so the
 * popup here is a plain `role="listbox"` positioned with `@floating-ui/react` —
 * the same overlay foundation `Tooltip` uses. `useDismiss` also handles the
 * outside-click case correctly through `composedPath()`, including the one
 * where clicking an option re-renders the list while the click is still
 * bubbling and detaches `event.target`.
 *
 * ⚠️ KNOWN ARIA LIMITATION (shared with `Select`, verified in-browser):
 * Material Web's text field sets `role="presentation"` on its own host through
 * ElementInternals — a bare `md-outlined-text-field` created outside React
 * already carries it — because the real control is an `<input>` inside its
 * SHADOW root. So the `role="combobox"` set below does NOT reach the
 * accessibility tree, and moving it to the inner input would not help either:
 * `aria-controls`/`aria-activedescendant` are IDREFs, and an IDREF cannot cross
 * a shadow boundary to reach this popup in the light DOM.
 *
 * Keyboard operation is fully correct — focus stays in the field, arrows move
 * the highlight, Enter commits, Escape closes — but a screen reader will
 * announce this as a text field rather than as a combobox. Closing that gap
 * means giving up the Material text-field shell for a native <input> styled to
 * match, which is a design decision for the library owner, not something a prop
 * can fix. The attributes are kept below so the intent is explicit and so the
 * fix is a one-line change if that decision is ever made.
 *
 * @typedef {Object} ComboboxOption
 * @property {string} label
 * @property {string} value
 * @property {boolean} [disabled]
 *
 * @typedef {Object} ComboboxProps
 * @property {ComboboxOption[]} options
 * @property {string|string[]} [value]      Controlled selection; array when `multiple`.
 * @property {(value: string|string[]) => void} [onChange] Value-first.
 * @property {boolean} [multiple]           Pick more than one; renders chips.
 * @property {boolean} [clearable]          Trailing clear control.
 * @property {boolean} [creatable]         Offer "add <query>" when nothing matches.
 * @property {(query: string) => void} [onCreate] Called when the create row is chosen.
 * @property {(query: string) => string} [createLabel] Label for the create row.
 * @property {(option: ComboboxOption, query: string) => boolean} [filterFn] Custom filter.
 * @property {(query: string) => void} [onSearchChange] Observe the typed query (async sources).
 * @property {boolean} [loading]            Show a loading row instead of "no results".
 * @property {string} [noResultsText]
 * @property {string} [placeholder]
 * ...plus the inherited TextField shell (label, floatingLabel, error, errorText,
 *    supportingText, required, disabled, name, id, className, style, ref, ...rest).
 */

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

function ChevronIcon({ open }) {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
            className={`cst-combobox__chevron${open ? " cst-combobox__chevron--open" : ""}`}
        >
            <path d="M7 10l5 5 5-5z" fill="currentColor" />
        </svg>
    );
}

function toArray(value) {
    if (value == null || value === "") return [];
    return Array.isArray(value) ? value : [value];
}

function defaultFilter(option, query) {
    return option.label.toLowerCase().includes(query.trim().toLowerCase());
}

const CREATE_INDEX = -2; // sentinel: the "create new" row is highlighted

const ComboboxBase = forwardRef(function ComboboxBase(
    {
        Field,
        Chip,
        ChipContainer,
        options = [],
        value,
        onChange = () => { },
        multiple = false,
        clearable = false,
        clearLabel = "Clear selection",
        creatable = false,
        onCreate,
        createLabel = (query) => `Add "${query}"`,
        filterFn,
        onSearchChange,
        loading = false,
        loadingText = "Loading…",
        noResultsText = "No results",
        placeholder = "",
        disabled = false,
        id: customId,
        className = "",
        listboxClassName = "",
        chipsClassName = "",
        ...rest
    },
    ref
) {
    const reactId = useId();
    const id = customId || `cst-combobox-${reactId}`;
    const listboxId = `${id}-listbox`;
    const optionId = (index) => `${id}-option-${index}`;

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [highlight, setHighlight] = useState(-1);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => { setIsMounted(true); }, []);

    const selectedValues = toArray(value);
    const isSelected = (v) => selectedValues.includes(v);

    const selectedOptions = useMemo(
        () => options.filter((opt) => isSelected(opt.value)),
        [options, value] // eslint-disable-line react-hooks/exhaustive-deps
    );

    // Single-select shows the chosen label in the input when the popup is shut;
    // while open, the input holds whatever the user is typing.
    const singleLabel = !multiple ? (selectedOptions[0]?.label ?? "") : "";
    const inputValue = open ? query : (multiple ? "" : singleLabel);

    const filtered = useMemo(() => {
        const q = query.trim();
        if (!q) return options;
        const predicate = filterFn || defaultFilter;
        return options.filter((opt) => predicate(opt, q));
    }, [options, query, filterFn]);

    // The create row only appears for a non-empty query that matches no
    // existing option label exactly.
    const trimmedQuery = query.trim();
    const showCreate =
        creatable &&
        trimmedQuery.length > 0 &&
        !options.some((opt) => opt.label.toLowerCase() === trimmedQuery.toLowerCase());

    const selectableIndexes = useMemo(
        () => filtered.map((opt, i) => (opt.disabled ? null : i)).filter((i) => i !== null),
        [filtered]
    );

    /* ── Positioning ──────────────────────────────────────────────────────── */

    const { refs, floatingStyles, context } = useFloating({
        open,
        onOpenChange: setOpen,
        placement: "bottom-start",
        middleware: [
            offset(4),
            flip({ padding: 8 }),
            shift({ padding: 8 }),
            // Match the popup width to the field and never overflow the viewport.
            size({
                apply({ rects, elements, availableHeight }) {
                    Object.assign(elements.floating.style, {
                        width: `${rects.reference.width}px`,
                        maxHeight: `${Math.max(120, Math.min(availableHeight - 8, 320))}px`,
                    });
                },
                padding: 8,
            }),
        ],
        whileElementsMounted: autoUpdate,
    });

    const dismiss = useDismiss(context, { outsidePress: true });
    const { getFloatingProps } = useInteractions([dismiss]);

    const fieldRef = useRef(null);
    const setFieldRef = useCallback(
        (node) => {
            fieldRef.current = node;
            refs.setReference(node);
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
        },
        [ref, refs]
    );

    const listRef = useRef(null);

    // Keep the highlighted row inside the scroll viewport during keyboard nav.
    useEffect(() => {
        if (!open || highlight < 0) return;
        // Attribute selector rather than #id: the generated ids come from
        // useId() and can contain characters that need escaping in a selector.
        const node = listRef.current?.querySelector(`[id="${optionId(highlight)}"]`);
        node?.scrollIntoView({ block: "nearest" });
    }, [highlight, open]); // eslint-disable-line react-hooks/exhaustive-deps

    // Reset the highlight whenever the visible result set changes.
    useEffect(() => {
        if (!open) return;
        setHighlight(selectableIndexes.length > 0 ? selectableIndexes[0] : (showCreate ? CREATE_INDEX : -1));
    }, [query, open]); // eslint-disable-line react-hooks/exhaustive-deps

    /* ── Behaviour ────────────────────────────────────────────────────────── */

    const openPopup = () => {
        if (disabled || open) return;
        setOpen(true);
    };

    const closePopup = ({ refocus = false } = {}) => {
        setOpen(false);
        setQuery("");
        setHighlight(-1);
        if (refocus) fieldRef.current?.focus?.();
    };

    const commit = (option) => {
        if (!option || option.disabled) return;
        if (multiple) {
            const next = isSelected(option.value)
                ? selectedValues.filter((v) => v !== option.value)
                : [...selectedValues, option.value];
            onChange(next);
            // Stay open so several picks can be made in one go; clear the query
            // so the full list is available again.
            setQuery("");
            onSearchChange?.("");
            fieldRef.current?.focus?.();
            return;
        }
        onChange(option.value);
        closePopup({ refocus: true });
    };

    const commitCreate = () => {
        if (!trimmedQuery) return;
        onCreate?.(trimmedQuery);
        if (multiple) {
            setQuery("");
            onSearchChange?.("");
            fieldRef.current?.focus?.();
        } else {
            closePopup({ refocus: true });
        }
    };

    const handleQueryChange = (next) => {
        setQuery(next);
        onSearchChange?.(next);
        if (!open) setOpen(true);
    };

    const moveHighlight = (delta) => {
        const stops = [...selectableIndexes];
        if (showCreate) stops.push(CREATE_INDEX);
        if (stops.length === 0) return;
        const current = stops.indexOf(highlight);
        const nextIndex = current === -1
            ? (delta > 0 ? 0 : stops.length - 1)
            : (current + delta + stops.length) % stops.length;
        setHighlight(stops[nextIndex]);
    };

    const handleKeyDown = (event) => {
        if (disabled) return;
        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                if (!open) { openPopup(); return; }
                moveHighlight(1);
                break;
            case "ArrowUp":
                event.preventDefault();
                if (!open) { openPopup(); return; }
                moveHighlight(-1);
                break;
            case "Enter":
                if (!open) return;
                event.preventDefault();
                if (highlight === CREATE_INDEX) commitCreate();
                else if (highlight >= 0) commit(filtered[highlight]);
                break;
            case "Escape":
                if (!open) return;
                event.preventDefault();
                closePopup({ refocus: true });
                break;
            case "Backspace":
                // Standard tag-input affordance: backspace on an empty query
                // removes the last chip.
                if (multiple && query === "" && selectedValues.length > 0) {
                    onChange(selectedValues.slice(0, -1));
                }
                break;
            case "Tab":
                if (open) closePopup();
                break;
            default:
                break;
        }
    };

    const handleClear = (event) => {
        event.stopPropagation();
        event.preventDefault();
        onChange(multiple ? [] : "");
        setQuery("");
        onSearchChange?.("");
        fieldRef.current?.focus?.();
    };

    const removeChip = (optionValue) => {
        onChange(selectedValues.filter((v) => v !== optionValue));
        fieldRef.current?.focus?.();
    };

    /* ── Render ───────────────────────────────────────────────────────────── */

    const hasSelection = selectedValues.length > 0;
    const showClear = clearable && (hasSelection || query.length > 0) && !disabled;

    const trailing = (
        <span className="cst-combobox__adornments">
            {showClear && (
                <button
                    type="button"
                    className="cst-combobox__clear"
                    aria-label={clearLabel}
                    onClick={handleClear}
                    onKeyDown={(event) => event.stopPropagation()}
                >
                    <ClearGlyph />
                </button>
            )}
            <ChevronIcon open={open} />
        </span>
    );

    const activeDescendant = !open
        ? undefined
        : highlight === CREATE_INDEX
            ? `${id}-create`
            : highlight >= 0
                ? optionId(highlight)
                : undefined;

    const popup = open ? (
        <div
            ref={refs.setFloating}
            style={floatingStyles}
            className={["cst-combobox__popup", listboxClassName].filter(Boolean).join(" ")}
            {...getFloatingProps()}
        >
            <ul
                ref={listRef}
                id={listboxId}
                role="listbox"
                aria-multiselectable={multiple ? "true" : undefined}
                aria-label={rest["aria-label"] || rest.label || "Options"}
                className="cst-combobox__list"
            >
                {loading && (
                    <li className="cst-combobox__status" role="presentation">{loadingText}</li>
                )}

                {!loading && filtered.length === 0 && !showCreate && (
                    <li className="cst-combobox__status" role="presentation">{noResultsText}</li>
                )}

                {!loading && filtered.map((option, index) => {
                    const selected = isSelected(option.value);
                    return (
                        <li
                            key={option.value}
                            id={optionId(index)}
                            role="option"
                            aria-selected={selected}
                            aria-disabled={option.disabled || undefined}
                            className={[
                                "cst-combobox__option",
                                index === highlight ? "cst-combobox__option--active" : "",
                                selected ? "cst-combobox__option--selected" : "",
                                option.disabled ? "cst-combobox__option--disabled" : "",
                            ].filter(Boolean).join(" ")}
                            // onMouseDown (not onClick) so the field never loses
                            // focus before the selection is committed.
                            onMouseDown={(event) => { event.preventDefault(); commit(option); }}
                            onMouseEnter={() => !option.disabled && setHighlight(index)}
                        >
                            {multiple && (
                                <span className="cst-combobox__check" aria-hidden="true">
                                    {selected ? "✓" : ""}
                                </span>
                            )}
                            <span className="cst-combobox__option-label">{option.label}</span>
                        </li>
                    );
                })}

                {showCreate && (
                    <li
                        id={`${id}-create`}
                        role="option"
                        aria-selected={false}
                        className={[
                            "cst-combobox__option",
                            "cst-combobox__create",
                            highlight === CREATE_INDEX ? "cst-combobox__option--active" : "",
                        ].filter(Boolean).join(" ")}
                        onMouseDown={(event) => { event.preventDefault(); commitCreate(); }}
                        onMouseEnter={() => setHighlight(CREATE_INDEX)}
                    >
                        <span className="cst-combobox__check" aria-hidden="true">+</span>
                        <span className="cst-combobox__option-label">{createLabel(trimmedQuery)}</span>
                    </li>
                )}
            </ul>
        </div>
    ) : null;

    return (
        <div className={["cst-combobox", className].filter(Boolean).join(" ")}>
            <Field
                ref={setFieldRef}
                {...rest}
                id={id}
                type="text"
                value={inputValue}
                onChange={handleQueryChange}
                onKeyDown={handleKeyDown}
                onClick={openPopup}
                placeholder={multiple && hasSelection ? "" : placeholder}
                disabled={disabled}
                endIcon={trailing}
                role="combobox"
                // Explicit strings: React writes a boolean `true` onto a custom
                // element as the empty attribute value, which is not a valid
                // aria-expanded value.
                aria-expanded={open ? "true" : "false"}
                aria-controls={listboxId}
                aria-autocomplete="list"
                aria-activedescendant={activeDescendant}
                autoComplete="off"
            />

            {multiple && selectedOptions.length > 0 && (
                <ChipContainer
                    aria-label="Selected items"
                    className={["cst-combobox__chips", chipsClassName].filter(Boolean).join(" ")}
                >
                    {selectedOptions.map((option) => (
                        <Chip
                            key={option.value}
                            label={option.label}
                            disabled={disabled}
                            onRemove={() => removeChip(option.value)}
                        />
                    ))}
                </ChipContainer>
            )}

            {isMounted && popup && createPortal(popup, document.body)}
        </div>
    );
});

export default ComboboxBase;
