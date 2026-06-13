import { forwardRef, useEffect } from "react";
import BadgeBase from "./badge.base.jsx";

// SSR-friendly variant: defers md-badge custom-element registration to the
// client so importing it never touches `customElements`/`HTMLElement` on the
// server. The real Next.js consumer uses the client `Badge` from the barrel
// with `"use client"`; this variant is kept for dynamic-registration cases.
export const BadgeSSR = forwardRef(function BadgeSSR(props, ref) {
    useEffect(() => {
        import("@material/web/labs/badge/badge.js");
    }, []);

    return <BadgeBase ref={ref} {...props} />;
});
