import { forwardRef, useEffect } from "react";
import InputBase from "./input.base.jsx";

// SSR-friendly variant: defers Material 3 custom-element registration to the
// client so importing it never touches `customElements`/`HTMLElement` on the
// server. The real Next.js consumer uses the client `Input` from the barrel
// with `"use client"`; this variant is kept for dynamic-registration cases.
//
// (Previously broken: it referenced `InputBase` without importing it and never
// deferred registration — a ReferenceError if used. Repaired here to mirror the
// Button SSR variant.)
export const InputSSR = forwardRef(function InputSSR(props, ref) {
    useEffect(() => {
        // Client-only registration of both variants.
        import("@material/web/textfield/outlined-text-field.js");
        import("@material/web/textfield/filled-text-field.js");
    }, []);

    return <InputBase ref={ref} {...props} />;
});
