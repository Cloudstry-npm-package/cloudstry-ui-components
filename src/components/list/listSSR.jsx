import { forwardRef, useEffect } from "react";
import ListBase from "./list.base.jsx";
import ListItemBase from "./list-item.base.jsx";

// SSR-safe variant: defers md-list and md-list-item custom-element registration
// to the client via useEffect so this module is safe to import on the server.
// Named slot content (slot="headline", etc.) is valid HTML and renders
// correctly server-side before custom elements upgrade.

function useRegisterList() {
    useEffect(() => {
        import("@material/web/list/list.js");
        import("@material/web/list/list-item.js");
    }, []);
}

export const ListSSR = forwardRef(function ListSSR(props, ref) {
    useRegisterList();
    return <ListBase ref={ref} {...props} />;
});

export const ListItemSSR = forwardRef(function ListItemSSR(props, ref) {
    useRegisterList();
    return <ListItemBase ref={ref} {...props} />;
});
