"use client";
import "@material/web/radio/radio.js";
import { forwardRef } from "react";
import RadioBase from "./radio.base.jsx";
import RadioGroupBase from "./radio-group.base.jsx";

// Client entry: registers md-radio at module evaluation, then renders the
// presentational bases. RadioGroup renders pure HTML so no additional MWC
// import is needed for it. The "use client" directive is re-injected into this
// chunk's dist output via the Rollup banner.

export const Radio = forwardRef(function Radio(props, ref) {
    return <RadioBase ref={ref} {...props} />;
});

export const RadioGroup = forwardRef(function RadioGroup(props, ref) {
    return <RadioGroupBase ref={ref} {...props} />;
});
