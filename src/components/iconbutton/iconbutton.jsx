"use client";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/iconbutton/filled-icon-button.js";
import "@material/web/iconbutton/filled-tonal-icon-button.js";
import "@material/web/iconbutton/outlined-icon-button.js";
import "@material/web/icon/icon.js";
import { forwardRef } from "react";
import IconButtonBase from "./iconbutton.base.jsx";

// Client entry: registers all four Material 3 icon button variants (+ md-icon)
// at module evaluation, then renders the presentational base. Use inside client
// components — see README.
const IconButton = forwardRef(function IconButton(props, ref) {
    return <IconButtonBase ref={ref} {...props} />;
});

export default IconButton;
export { IconButton };
