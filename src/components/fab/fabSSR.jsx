import { forwardRef, useEffect } from "react";
import FABBase from "./fab.base.jsx";

// SSR-safe variant: defers md-fab and md-branded-fab custom-element registration
// to the client via useEffect so this module is safe to import on the server.
export const FABSSR = forwardRef(function FABSSR(props, ref) {
    useEffect(() => {
        import("@material/web/fab/fab.js");
        import("@material/web/fab/branded-fab.js");
    }, []);

    return <FABBase ref={ref} {...props} />;
});
