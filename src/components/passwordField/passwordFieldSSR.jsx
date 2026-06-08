import { forwardRef } from "react";
import { InputSSR } from "../input/inputSSR.jsx";
import PasswordFieldBase from "./passwordField.base.jsx";

// SSR-friendly variant: composes the password toggle over `InputSSR`, which
// defers Material 3 registration to the client. Same toggle logic as the client
// entry (shared via PasswordFieldBase) — no duplication.
export const PasswordFieldSSR = forwardRef(function PasswordFieldSSR(props, ref) {
    return <PasswordFieldBase ref={ref} Field={InputSSR} {...props} />;
});
