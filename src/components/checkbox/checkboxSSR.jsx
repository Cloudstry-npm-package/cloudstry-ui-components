import { forwardRef, useEffect } from "react";
import CheckboxBase from "./checkbox.base.jsx";
import CheckboxGroupBase from "./checkbox-group.base.jsx";

// SSR-safe variants: CheckboxSSR defers md-checkbox registration to the client.
// CheckboxGroupSSR renders pure HTML (fieldset/div) — no MWC dependency.

export const CheckboxSSR = forwardRef(function CheckboxSSR(props, ref) {
    useEffect(() => {
        import("@material/web/checkbox/checkbox.js");
    }, []);

    return <CheckboxBase ref={ref} {...props} />;
});

export const CheckboxGroupSSR = forwardRef(function CheckboxGroupSSR(props, ref) {
    return <CheckboxGroupBase ref={ref} {...props} />;
});
