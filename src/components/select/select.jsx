"use client";

import { forwardRef } from "react";
import Input from "../input/input.jsx";
import { Menu, MenuItem } from "../menu/menu.jsx";
import SelectBase from "./select.base.jsx";

// Client entry: composes the Select delta over the client `Input` (trigger)
// and client `Menu`/`MenuItem` (popup), both of which own their own
// `"use client"` boundary + Material 3 registration.
const Select = forwardRef(function Select(props, ref) {
    return <SelectBase ref={ref} Field={Input} Menu={Menu} MenuItem={MenuItem} {...props} />;
});

export default Select;
export { Select };
