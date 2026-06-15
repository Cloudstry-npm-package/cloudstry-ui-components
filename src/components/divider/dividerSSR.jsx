import { forwardRef } from "react";
import DividerBase from "./divider.base.jsx";

// SSR variant: structurally consistent with other SSR entries.
// Divider is pure CSS — no MWC registration to defer. This entry is
// identical to the client variant; it exists to maintain the library's
// consistent per-component SSR export contract.
export const DividerSSR = forwardRef(function DividerSSR(props, ref) {
    return <DividerBase ref={ref} {...props} />;
});
