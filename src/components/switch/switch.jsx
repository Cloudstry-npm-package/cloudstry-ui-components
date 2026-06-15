"use client";
import "@material/web/switch/switch.js";
import { forwardRef } from "react";
import SwitchBase from "./switch.base.jsx";

// Client entry: registers md-switch at module evaluation, then renders the
// presentational base. Use inside client components — see README.
const Switch = forwardRef(function Switch(props, ref) {
    return <SwitchBase ref={ref} {...props} />;
});

export default Switch;
export { Switch };
