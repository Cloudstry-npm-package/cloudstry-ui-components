import "@material/web/checkbox/checkbox.js";
import { forwardRef } from "react";
import CheckboxBase from "./checkbox.base.jsx";

// Client entry: registers md-checkbox at module evaluation, then renders the
// presentational base. Use inside client components — see README.
const Checkbox = forwardRef(function Checkbox(props, ref) {
    return <CheckboxBase ref={ref} {...props} />;
});

export default Checkbox;
export { Checkbox };
