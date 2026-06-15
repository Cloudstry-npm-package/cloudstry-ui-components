import "@material/web/labs/card/elevated-card.js";
import "@material/web/labs/card/filled-card.js";
import "@material/web/labs/card/outlined-card.js";
import { forwardRef } from "react";
import CardBase, { CardHeader } from "./card.base.jsx";

// Client entry: registers all three Material 3 Labs card variants at module
// evaluation, then renders the presentational base. Use inside client
// components (or via the SSR variant) — see README.
const Card = forwardRef(function Card(props, ref) {
    return <CardBase ref={ref} {...props} />;
});

export default Card;
export { Card, CardHeader };
