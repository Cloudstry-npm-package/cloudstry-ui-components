"use client";

import { forwardRef } from "react";
import Input from "../input/input.jsx";
import PasswordFieldBase from "./passwordField.base.jsx";

// Client entry: composes the password reveal toggle over the client `Input`
// (which owns the `"use client"` boundary + Material 3 registration). All
// TextField props pass straight through; only `type` and the trailing toggle
// are owned here.
const PasswordField = forwardRef(function PasswordField(props, ref) {
    return <PasswordFieldBase ref={ref} Field={Input} {...props} />;
});

export default PasswordField;
export { PasswordField };
