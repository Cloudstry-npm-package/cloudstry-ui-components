import { forwardRef } from "react";
import { InputSSR } from "../input/inputSSR.jsx";
import SearchFieldBase from "./searchField.base.jsx";

// SSR-friendly variant: composes the search delta over `InputSSR`, which defers
// Material 3 registration to the client. Same search logic as the client entry
// (shared via SearchFieldBase) — no duplication.
export const SearchFieldSSR = forwardRef(function SearchFieldSSR(props, ref) {
    return <SearchFieldBase ref={ref} Field={InputSSR} {...props} />;
});
