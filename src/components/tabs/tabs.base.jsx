import { forwardRef, useCallback, useEffect, useRef } from "react";
import { TabsContext } from "./tabs-context.js";
import "./tabs.css";

const isDev =
    typeof process !== "undefined" &&
    process.env &&
    process.env.NODE_ENV !== "production";

function useMergedRef(externalRef) {
    const innerRef = useRef(null);
    const callbackRef = useCallback(
        (node) => {
            innerRef.current = node;
            if (typeof externalRef === "function") externalRef(node);
            else if (externalRef) externalRef.current = node;
        },
        [externalRef]
    );
    return [innerRef, callbackRef];
}

/**
 * Cloudstry Tabs — presentational layer.
 *
 * Composition API over md-tabs / md-primary-tab / md-secondary-tab.
 * Place <Tab> children directly inside <Tabs>. Manage tab panels externally
 * using <TabPanel> or a custom implementation.
 *
 * Controlled:
 *   <Tabs activeTab={tab} onTabChange={setTab}>
 *     <Tab label="Home" />
 *     <Tab label="Settings" />
 *   </Tabs>
 *
 * Uncontrolled:
 *   <Tabs defaultActiveTab={0}>
 *     <Tab label="Home" />
 *     <Tab label="Settings" />
 *   </Tabs>
 *
 * Variant:
 *   <Tabs variant="secondary">...</Tabs>
 *
 * Panel association:
 *   <TabPanel active={tab === 0} labelledBy="home-tab">Home content</TabPanel>
 */
const TabsBase = forwardRef(function TabsBase(
    {
        // State
        activeTab,              // controlled: 0-based index
        defaultActiveTab,       // uncontrolled: initial index (default 0)
        // Callbacks
        onTabChange,            // (index: number) => void
        // Appearance
        variant = "primary",    // "primary" | "secondary"
        // Presentation
        children,
        className = "",
        tabsClassName = "",
        style,
        // Passthrough (aria-*, data-*, id, …)
        ...rest
    },
    ref
) {
    const [innerRef, callbackRef] = useMergedRef(ref);
    const isControlled = activeTab !== undefined;

    // ---- Dev warnings -------------------------------------------------------
    if (isDev) {
        if (isControlled && defaultActiveTab !== undefined) {
            // eslint-disable-next-line no-console
            console.warn(
                "[Cloudstry Tabs] Received both `activeTab` and `defaultActiveTab`. " +
                "Use `activeTab` for controlled or `defaultActiveTab` for uncontrolled, not both."
            );
        }
        if (variant !== "primary" && variant !== "secondary") {
            // eslint-disable-next-line no-console
            console.warn(
                `[Cloudstry Tabs] Unknown variant "${variant}". Expected "primary" or "secondary".`
            );
        }
    }

    // ---- Keep onTabChange in a ref so mount-only listener stays current -----
    const onTabChangeRef = useRef(onTabChange);
    onTabChangeRef.current = onTabChange;

    // ---- Attach native change listener once on mount -----------------------
    // md-tabs fires `change` when the active tab changes via user interaction.
    // event.target.activeTabIndex gives the newly selected 0-based index.
    useEffect(() => {
        const el = innerRef.current;
        if (!el) return;
        const handler = (e) => {
            onTabChangeRef.current?.(e.target.activeTabIndex);
        };
        el.addEventListener("change", handler);
        return () => el.removeEventListener("change", handler);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ---- Sync activeTabIndex DOM property (controlled mode) ----------------
    // md-tabs.activeTabIndex is a Lit property (attribute: 'active-tab-index').
    // React 18 cannot set camelCase as kebab attribute reliably, so we use
    // imperative DOM property sync — same approach as Checkbox `checked`.
    useEffect(() => {
        const el = innerRef.current;
        if (!el || !isControlled) return;
        el.activeTabIndex = activeTab;
    }, [activeTab, isControlled]); // eslint-disable-line react-hooks/exhaustive-deps

    // ---- Uncontrolled: seed initial active tab on mount --------------------
    useEffect(() => {
        const el = innerRef.current;
        if (!el || isControlled) return;
        // MWC default is 0; only override if defaultActiveTab is explicitly set
        // and different from the default.
        if (defaultActiveTab !== undefined && defaultActiveTab !== 0) {
            el.activeTabIndex = defaultActiveTab;
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ---- Build classes ------------------------------------------------------
    const tabsClasses = ["cst-tabs", tabsClassName].filter(Boolean).join(" ");
    const wrapperClasses = ["cst-tabs-wrapper", className].filter(Boolean).join(" ");

    return (
        <TabsContext.Provider value={{ variant }}>
            <div className={wrapperClasses} style={style}>
                <md-tabs
                    ref={callbackRef}
                    className={tabsClasses}
                    {...rest}
                >
                    {children}
                </md-tabs>
            </div>
        </TabsContext.Provider>
    );
});

export default TabsBase;
