"use client";

import { forwardRef } from "react";
import Input from "../input/input.jsx";
import SearchFieldBase from "./searchField.base.jsx";

// Client entry: composes the search delta over the client `Input` (which owns
// the `"use client"` boundary + Material 3 registration). The search behaviour
// (clear / debounce / Enter) lives in SearchFieldBase; this entry only wires the
// renderer.
const SearchField = forwardRef(function SearchField(props, ref) {
    return <SearchFieldBase ref={ref} Field={Input} {...props} />;
});

export default SearchField;
export { SearchField };
