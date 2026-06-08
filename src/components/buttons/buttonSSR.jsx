import { forwardRef, useEffect } from "react";
import ButtonBase from "./button.base.jsx";

// SSR-friendly variant: defers Material 3 custom-element registration to the
// client so importing it never touches `customElements`/`HTMLElement` on the
// server. The real Next.js consumer uses the client `Button` from the barrel
// with `"use client"`; this variant is kept for dynamic-registration cases.
export const ButtonSSR = forwardRef(function ButtonSSR(props, ref) {
    useEffect(() => {
        // Client-only registration.
        import("@material/web/button/filled-button.js");
        import("@material/web/button/filled-tonal-button.js");
        import("@material/web/button/elevated-button.js");
        import("@material/web/button/outlined-button.js");
        import("@material/web/button/text-button.js");
        import("@material/web/icon/icon.js");
    }, []);

    return <ButtonBase ref={ref} {...props} />;
});
