import { forwardRef, useEffect } from "react";
import DialogBase from "./dialog.base.jsx";

// SSR-safe variant: defers md-dialog custom-element registration to the
// client via useEffect so this module is safe to import on the server.
// Dialog always starts closed; open is driven by client-side state.
export const DialogSSR = forwardRef(function DialogSSR(props, ref) {
    useEffect(() => {
        import("@material/web/dialog/dialog.js");
    }, []);

    return <DialogBase ref={ref} {...props} />;
});
