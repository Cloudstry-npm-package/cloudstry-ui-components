"use client";

import { forwardRef } from "react";
import Input from "../input/input.jsx";
import { InputChip, ChipSet } from "../chips/chips.jsx";
import ComboboxBase from "./combobox.base.jsx";

// Client entry: composes the Combobox delta over the client `Input` (the visible
// text field) and the client chips (`InputChip` inside a `ChipSet`) used to
// render multi-select values. Each of those owns its own `"use client"` boundary
// and Material 3 registration, so this entry only wires the renderer.
const Combobox = forwardRef(function Combobox(props, ref) {
    return (
        <ComboboxBase
            ref={ref}
            Field={Input}
            Chip={InputChip}
            ChipContainer={ChipSet}
            {...props}
        />
    );
});

export default Combobox;
export { Combobox };
