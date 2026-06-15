import { forwardRef, useEffect } from "react";
import CircularProgressBase from "./circular-progress.base.jsx";
import LinearProgressBase from "./linear-progress.base.jsx";

// SSR-safe variants: defer custom-element registration to the client via
// useEffect so these modules are safe to import on the server.

export const CircularProgressSSR = forwardRef(function CircularProgressSSR(props, ref) {
    useEffect(() => {
        import("@material/web/progress/circular-progress.js");
    }, []);

    return <CircularProgressBase ref={ref} {...props} />;
});

export const LinearProgressSSR = forwardRef(function LinearProgressSSR(props, ref) {
    useEffect(() => {
        import("@material/web/progress/linear-progress.js");
    }, []);

    return <LinearProgressBase ref={ref} {...props} />;
});
