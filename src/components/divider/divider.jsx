import { forwardRef } from "react";
import DividerBase from "./divider.base.jsx";

// Client entry: pure CSS implementation — no MWC module to register.
// No "use client" directive needed; Divider is server-renderable.
const Divider = forwardRef(function Divider(props, ref) {
    return <DividerBase ref={ref} {...props} />;
});

export default Divider;
export { Divider };
