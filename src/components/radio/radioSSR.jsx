import { forwardRef, useEffect } from "react";
import RadioBase from "./radio.base.jsx";
import RadioGroupBase from "./radio-group.base.jsx";

// SSR-safe variants: RadioSSR defers md-radio registration to the client.
// RadioGroupSSR renders pure HTML (fieldset/div) — no MWC dependency.

export const RadioSSR = forwardRef(function RadioSSR(props, ref) {
    useEffect(() => {
        import("@material/web/radio/radio.js");
    }, []);

    return <RadioBase ref={ref} {...props} />;
});

export const RadioGroupSSR = forwardRef(function RadioGroupSSR(props, ref) {
    return <RadioGroupBase ref={ref} {...props} />;
});
