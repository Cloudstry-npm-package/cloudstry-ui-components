import { forwardRef, useEffect } from "react";
import SliderBase from "./slider.base.jsx";

export const SliderSSR = forwardRef(function SliderSSR(props, ref) {
    useEffect(() => {
        import("@material/web/slider/slider.js");
    }, []);
    return <SliderBase ref={ref} {...props} />;
});
