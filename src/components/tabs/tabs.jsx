"use client";
import "@material/web/tabs/tabs.js";
import "@material/web/tabs/primary-tab.js";
import "@material/web/tabs/secondary-tab.js";
import { forwardRef } from "react";
import TabsBase from "./tabs.base.jsx";
import TabBase from "./tab.base.jsx";
import { TabPanel } from "./tabpanel.base.jsx";

// Client entry: registers md-tabs, md-primary-tab, md-secondary-tab at module
// evaluation, then renders the presentational bases. Use inside client
// components — see README.
const Tabs = forwardRef(function Tabs(props, ref) {
    return <TabsBase ref={ref} {...props} />;
});

const Tab = forwardRef(function Tab(props, ref) {
    return <TabBase ref={ref} {...props} />;
});

export default Tabs;
export { Tabs, Tab, TabPanel };
