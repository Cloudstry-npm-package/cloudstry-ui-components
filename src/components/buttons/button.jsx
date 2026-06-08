import "@material/web/button/filled-button.js";
import "@material/web/button/filled-tonal-button.js";
import "@material/web/button/elevated-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/button/text-button.js";
import "@material/web/icon/icon.js";
import { forwardRef } from "react";
import ButtonBase from "./button.base.jsx";

// Client entry: registers all five Material 3 button variants (+ md-icon) at
// module evaluation, then renders the presentational base. Use inside client
// components (or via the SSR variant) — see README.
const Button = forwardRef(function Button(props, ref) {
    return <ButtonBase ref={ref} {...props} />;
});

export default Button;
export { Button };
