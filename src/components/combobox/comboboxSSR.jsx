import { forwardRef } from "react";
import { InputSSR } from "../input/inputSSR.jsx";
import "./combobox.css";

/**
 * SSR-friendly Combobox.
 *
 * A combobox is inherently interactive — the popup, filtering, highlight and
 * `aria-activedescendant` all depend on client state that a Server Component
 * never hydrates. Rather than emit a listbox that can never open, this variant
 * renders the field in its resting state (showing the current selection) and
 * strips the interaction props, mirroring how `TableSSR` strips sort/selection.
 *
 * Use the client `Combobox` from the barrel for the real thing.
 */
const ComboboxSSR = forwardRef(function ComboboxSSR(
    {
        options = [],
        value,
        multiple = false,
        placeholder = "",
        // Interaction-only props — intentionally dropped on the server.
        onChange,
        onCreate,
        onSearchChange,
        creatable,
        createLabel,
        filterFn,
        clearable,
        clearLabel,
        loading,
        loadingText,
        noResultsText,
        listboxClassName,
        chipsClassName,
        Chip,
        ChipContainer,
        Field,
        ...rest
    },
    ref
) {
    const selected = value == null || value === "" ? [] : (Array.isArray(value) ? value : [value]);
    const display = options
        .filter((opt) => selected.includes(opt.value))
        .map((opt) => opt.label)
        .join(", ");

    return (
        <InputSSR
            ref={ref}
            {...rest}
            readOnly
            value={display}
            placeholder={placeholder}
            role="combobox"
            aria-expanded="false"
            aria-multiselectable={multiple ? "true" : undefined}
        />
    );
});

export default ComboboxSSR;
export { ComboboxSSR };
