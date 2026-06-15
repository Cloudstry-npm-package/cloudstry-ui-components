import { forwardRef, useId } from "react";

/**
 * Cloudstry TabPanel — accessible tab panel container.
 *
 * Provides role="tabpanel", aria-labelledby wiring, and hidden management.
 * Use alongside <Tabs>/<Tab> to build a complete tabs UI with keyboard
 * navigation and screen reader support.
 *
 * Basic usage (index-based):
 *   <TabPanel active={activeTab === 0}>Home content</TabPanel>
 *   <TabPanel active={activeTab === 1}>Settings content</TabPanel>
 *
 * With explicit tab ID association (recommended for accessibility):
 *   <Tab label="Home" id="home-tab" />
 *   <TabPanel active={activeTab === 0} labelledBy="home-tab">...</TabPanel>
 *
 * The `hidden` HTML attribute is set on inactive panels, which:
 *   1. Hides them visually.
 *   2. Removes them from the accessibility tree.
 *   3. Prevents focus from entering inactive panel content.
 */
const TabPanelBase = forwardRef(function TabPanelBase(
    {
        // State
        active = false,         // whether this panel is currently visible
        // A11y
        labelledBy,             // id of the associated <Tab>; sets aria-labelledby
        id: customId,           // override auto-generated panel id
        // Content
        children,
        // Styling
        className = "",
        style,
        // Passthrough
        ...rest
    },
    ref
) {
    const autoId = useId();
    const resolvedId = customId ?? autoId;

    const panelClasses = ["cst-tabpanel", className].filter(Boolean).join(" ");

    return (
        <div
            ref={ref}
            role="tabpanel"
            id={resolvedId}
            aria-labelledby={labelledBy || undefined}
            hidden={active ? undefined : true}
            className={panelClasses}
            style={style}
            {...rest}
        >
            {children}
        </div>
    );
});

export default TabPanelBase;
export { TabPanelBase as TabPanel };
