"use client";
import "@material/web/dialog/dialog.js";
import { forwardRef } from "react";
import DialogBase from "./dialog.base.jsx";

// Client entry: registers md-dialog custom element at module evaluation,
// then delegates to the presentational base. Use inside client components.
// For SSR / Next.js server components, use the DialogSSR variant.
const Dialog = forwardRef(function Dialog(props, ref) {
    return <DialogBase ref={ref} {...props} />;
});

export default Dialog;
export { Dialog };
