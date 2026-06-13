"use client";
import "@material/web/slider/slider.js";
import { forwardRef } from "react";
import SliderBase from "./slider.base.jsx";

export const Slider = forwardRef(function Slider(props, ref) {
    return <SliderBase ref={ref} {...props} />;
});
