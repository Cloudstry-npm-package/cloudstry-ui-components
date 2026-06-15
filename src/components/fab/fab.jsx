"use client";
import "@material/web/fab/fab.js";
import "@material/web/fab/branded-fab.js";
import { forwardRef } from "react";
import FABBase from "./fab.base.jsx";

// Client entry: registers md-fab and md-branded-fab custom elements at module
// evaluation, then renders the presentational base. Use inside client
// components — see README.
const FAB = forwardRef(function FAB(props, ref) {
    return <FABBase ref={ref} {...props} />;
});

export default FAB;
export { FAB };
