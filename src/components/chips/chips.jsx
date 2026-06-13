"use client";
import "@material/web/chips/assist-chip.js";
import "@material/web/chips/filter-chip.js";
import "@material/web/chips/input-chip.js";
import "@material/web/chips/suggestion-chip.js";
import "@material/web/chips/chip-set.js";
import { forwardRef } from "react";
import AssistChipBase from "./assist-chip.base.jsx";
import FilterChipBase from "./filter-chip.base.jsx";
import InputChipBase from "./input-chip.base.jsx";
import SuggestionChipBase from "./suggestion-chip.base.jsx";
import ChipSetBase from "./chip-set.base.jsx";

// Client entries: register all five MWC chip custom elements at module
// evaluation, then delegate to the presentational base components.
// The "use client" directive is re-injected into this chunk's dist output
// via the Rollup banner (see rollup.config.mjs CLIENT_ENTRY_SUFFIXES).

export const AssistChip = forwardRef(function AssistChip(props, ref) {
    return <AssistChipBase ref={ref} {...props} />;
});

export const FilterChip = forwardRef(function FilterChip(props, ref) {
    return <FilterChipBase ref={ref} {...props} />;
});

export const InputChip = forwardRef(function InputChip(props, ref) {
    return <InputChipBase ref={ref} {...props} />;
});

export const SuggestionChip = forwardRef(function SuggestionChip(props, ref) {
    return <SuggestionChipBase ref={ref} {...props} />;
});

export const ChipSet = forwardRef(function ChipSet(props, ref) {
    return <ChipSetBase ref={ref} {...props} />;
});
