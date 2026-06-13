import { forwardRef, useEffect } from "react";
import AssistChipBase from "./assist-chip.base.jsx";
import FilterChipBase from "./filter-chip.base.jsx";
import InputChipBase from "./input-chip.base.jsx";
import SuggestionChipBase from "./suggestion-chip.base.jsx";
import ChipSetBase from "./chip-set.base.jsx";

// SSR-friendly variants: defer all five MWC chip custom-element registrations
// to the client so importing them never touches `customElements`/`HTMLElement`
// on the server. The real Next.js consumer uses the client chips from the
// barrel with `"use client"`; these variants are for dynamic-registration cases.

function useRegisterChips() {
    useEffect(() => {
        import("@material/web/chips/assist-chip.js");
        import("@material/web/chips/filter-chip.js");
        import("@material/web/chips/input-chip.js");
        import("@material/web/chips/suggestion-chip.js");
        import("@material/web/chips/chip-set.js");
    }, []);
}

export const AssistChipSSR = forwardRef(function AssistChipSSR(props, ref) {
    useRegisterChips();
    return <AssistChipBase ref={ref} {...props} />;
});

export const FilterChipSSR = forwardRef(function FilterChipSSR(props, ref) {
    useRegisterChips();
    return <FilterChipBase ref={ref} {...props} />;
});

export const InputChipSSR = forwardRef(function InputChipSSR(props, ref) {
    useRegisterChips();
    return <InputChipBase ref={ref} {...props} />;
});

export const SuggestionChipSSR = forwardRef(function SuggestionChipSSR(props, ref) {
    useRegisterChips();
    return <SuggestionChipBase ref={ref} {...props} />;
});

export const ChipSetSSR = forwardRef(function ChipSetSSR(props, ref) {
    useRegisterChips();
    return <ChipSetBase ref={ref} {...props} />;
});
