import "@material/web/labs/badge/badge.js";
import { forwardRef } from "react";
import BadgeBase from "./badge.base.jsx";

// Client entry: registers md-badge at module evaluation, then renders the
// presentational base. Use inside client components — see README.
const Badge = forwardRef(function Badge(props, ref) {
    return <BadgeBase ref={ref} {...props} />;
});

export default Badge;
export { Badge };
