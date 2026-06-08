"use client";

import "@material/web/textfield/outlined-text-field.js";
import "@material/web/textfield/filled-text-field.js";
import { forwardRef } from "react";
import InputBase from "./input.base.jsx";

// Client entry: owns the client boundary (`"use client"`) and registers both
// Material 3 text-field variants (outlined + filled) at module evaluation, then
// renders the presentational base. Importing this from a Server Component is
// safe because the directive marks it as client-only; consumers no longer need
// to add their own `"use client"` just to use <Input>. (For deferred /
// dynamic registration use the SSR variant instead — see README.)
const Input = forwardRef(function Input(props, ref) {
    return <InputBase ref={ref} {...props} />;
});

export default Input;
export { Input };
