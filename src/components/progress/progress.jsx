"use client";
import "@material/web/progress/circular-progress.js";
import "@material/web/progress/linear-progress.js";
import { forwardRef } from "react";
import CircularProgressBase from "./circular-progress.base.jsx";
import LinearProgressBase from "./linear-progress.base.jsx";

// Client entry: registers md-circular-progress and md-linear-progress at module
// evaluation, then renders the presentational bases. The "use client" directive
// is re-injected into this chunk's dist output via the Rollup banner.

export const CircularProgress = forwardRef(function CircularProgress(props, ref) {
    return <CircularProgressBase ref={ref} {...props} />;
});

export const LinearProgress = forwardRef(function LinearProgress(props, ref) {
    return <LinearProgressBase ref={ref} {...props} />;
});
