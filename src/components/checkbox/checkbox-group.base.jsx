import { forwardRef } from "react";
// checkbox.css is imported by checkbox.base.jsx and covers CheckboxGroup styles.

/**
 * Cloudstry CheckboxGroup — layout/semantic grouping wrapper.
 *
 * Wraps a set of independent Checkbox components with correct ARIA semantics.
 * Unlike RadioGroup, CheckboxGroup owns NO state — each Checkbox is independently
 * controlled or uncontrolled by the consumer.
 *
 * With label (preferred — renders fieldset + legend for best screen-reader semantics):
 *   <CheckboxGroup label="Permissions">
 *     <Checkbox label="Read"  value="read"  checked={perms.read}  onChange={...} />
 *     <Checkbox label="Write" value="write" checked={perms.write} onChange={...} />
 *   </CheckboxGroup>
 *
 * Without label (renders div[role="group"] — provide aria-label for a11y):
 *   <CheckboxGroup aria-label="File permissions">
 *     <Checkbox label="Read" />
 *     <Checkbox label="Write" />
 *   </CheckboxGroup>
 *
 * Orientation:
 *   <CheckboxGroup label="Sort by" orientation="horizontal">...</CheckboxGroup>
 *
 * Accessibility:
 *   - With label: fieldset + legend provides the best AT grouping announcement.
 *   - Without label: div[role="group"] requires aria-label or aria-labelledby.
 *   - Each Checkbox inside retains its own accessible name (label prop or aria-*).
 */
const CheckboxGroupBase = forwardRef(function CheckboxGroupBase(
    {
        label,                    // group label; renders fieldset+legend when provided
        orientation = "vertical", // "vertical" | "horizontal"
        children,
        className = "",
        style,
        ...rest                   // aria-*, data-*, id, …
    },
    ref
) {
    const groupClasses = [
        "cst-checkbox-group",
        `cst-checkbox-group--${orientation}`,
        className,
    ]
        .filter(Boolean)
        .join(" ");

    const items = (
        <div className="cst-checkbox-group-items">{children}</div>
    );

    // ---- With label: fieldset + legend for best a11y semantics -------------
    if (label) {
        return (
            <fieldset
                ref={ref}
                className={groupClasses}
                style={style}
                {...rest}
            >
                <legend className="cst-checkbox-group-legend">{label}</legend>
                {items}
            </fieldset>
        );
    }

    // ---- Without label: div with role="group" ------------------------------
    return (
        <div
            ref={ref}
            role="group"
            className={groupClasses}
            style={style}
            {...rest}
        >
            {items}
        </div>
    );
});

export default CheckboxGroupBase;
