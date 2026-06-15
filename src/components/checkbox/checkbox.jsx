"use client";
import "@material/web/checkbox/checkbox.js";
import { forwardRef } from "react";
import CheckboxBase from "./checkbox.base.jsx";
import CheckboxGroupBase from "./checkbox-group.base.jsx";

// Client entry: registers md-checkbox at module evaluation, then renders the
// presentational bases. CheckboxGroup renders pure HTML so no additional MWC
// import is needed for it. The "use client" directive is re-injected into this
// chunk's dist output via the Rollup banner.

const Checkbox = forwardRef(function Checkbox(props, ref) {
    return <CheckboxBase ref={ref} {...props} />;
});

const CheckboxGroup = forwardRef(function CheckboxGroup(props, ref) {
    return <CheckboxGroupBase ref={ref} {...props} />;
});

export default Checkbox;
export { Checkbox, CheckboxGroup };
