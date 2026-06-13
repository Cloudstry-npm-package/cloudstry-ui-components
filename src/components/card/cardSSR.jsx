import { forwardRef, useEffect } from "react";
import CardBase, { CardHeader } from "./card.base.jsx";

// SSR-friendly variant: defers Material 3 Labs custom-element registration to
// the client so importing it never touches `customElements`/`HTMLElement` on
// the server. The real Next.js consumer uses the client `Card` from the barrel
// with `"use client"`; this variant is kept for dynamic-registration cases.
export const CardSSR = forwardRef(function CardSSR(props, ref) {
    useEffect(() => {
        import("@material/web/labs/card/elevated-card.js");
        import("@material/web/labs/card/filled-card.js");
        import("@material/web/labs/card/outlined-card.js");
    }, []);

    return <CardBase ref={ref} {...props} />;
});

export { CardHeader };
