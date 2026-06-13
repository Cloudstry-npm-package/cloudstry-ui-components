import { forwardRef, useEffect } from "react";
import IconButtonBase from "./iconbutton.base.jsx";

// SSR-safe variant: defers registration of all four MWC icon button custom
// elements to the client via useEffect so this module is safe to import on the
// server. The real Next.js consumer uses the client IconButton from the barrel
// with "use client"; this variant is kept for dynamic-registration cases.
export const IconButtonSSR = forwardRef(function IconButtonSSR(props, ref) {
    useEffect(() => {
        import("@material/web/iconbutton/icon-button.js");
        import("@material/web/iconbutton/filled-icon-button.js");
        import("@material/web/iconbutton/filled-tonal-icon-button.js");
        import("@material/web/iconbutton/outlined-icon-button.js");
        import("@material/web/icon/icon.js");
    }, []);

    return <IconButtonBase ref={ref} {...props} />;
});
