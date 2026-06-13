import { forwardRef, useEffect } from "react";
import TabsBase from "./tabs.base.jsx";
import TabBase from "./tab.base.jsx";
import { TabPanel } from "./tabpanel.base.jsx";

// SSR-friendly variant: defers MWC custom-element registration to the client
// so importing this module never touches `customElements`/`HTMLElement` on
// the server. All three MWC modules are imported dynamically in a single
// useEffect so they share one client-side evaluation.
//
// The real Next.js consumer uses the client `Tabs` from the barrel with
// `"use client"`; this variant is kept for dynamic-registration cases.
export const TabsSSR = forwardRef(function TabsSSR(props, ref) {
    useEffect(() => {
        Promise.all([
            import("@material/web/tabs/tabs.js"),
            import("@material/web/tabs/primary-tab.js"),
            import("@material/web/tabs/secondary-tab.js"),
        ]);
    }, []);

    return <TabsBase ref={ref} {...props} />;
});

export const TabSSR = forwardRef(function TabSSR(props, ref) {
    return <TabBase ref={ref} {...props} />;
});

export { TabPanel as TabPanelSSR } from "./tabpanel.base.jsx";
