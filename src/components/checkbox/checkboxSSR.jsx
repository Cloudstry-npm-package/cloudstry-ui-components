import { forwardRef, useEffect } from "react";
import CheckboxBase from "./checkbox.base.jsx";

// SSR-friendly variant: defers md-checkbox custom-element registration to the
// client so importing it never touches `customElements`/`HTMLElement` on the
// server. The real Next.js consumer uses the client `Checkbox` from the barrel
// with `"use client"`; this variant is kept for dynamic-registration cases.
export const CheckboxSSR = forwardRef(function CheckboxSSR(props, ref) {
    useEffect(() => {
        import("@material/web/checkbox/checkbox.js");
    }, []);

    return <CheckboxBase ref={ref} {...props} />;
});
