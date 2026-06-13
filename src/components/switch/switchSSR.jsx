import { forwardRef, useEffect } from "react";
import SwitchBase from "./switch.base.jsx";

// SSR-friendly variant: defers md-switch custom-element registration to the
// client so importing it never touches `customElements`/`HTMLElement` on the
// server. The real Next.js consumer uses the client `Switch` from the barrel
// with `"use client"`; this variant is kept for dynamic-registration cases.
export const SwitchSSR = forwardRef(function SwitchSSR(props, ref) {
    useEffect(() => {
        import("@material/web/switch/switch.js");
    }, []);

    return <SwitchBase ref={ref} {...props} />;
});
