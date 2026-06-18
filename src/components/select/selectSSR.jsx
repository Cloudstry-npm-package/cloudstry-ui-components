import { forwardRef } from "react";
import { InputSSR } from "../input/inputSSR.jsx";
import { MenuSSR, MenuItemSSR } from "../menu/menuSSR.jsx";
import SelectBase from "./select.base.jsx";

// SSR-friendly variant: composes the same Select delta over `InputSSR`
// (trigger) and `MenuSSR`/`MenuItemSSR` (popup), which defer Material 3
// registration to the client. Same delta logic as the client entry (shared
// via SelectBase) — no duplication.
export const SelectSSR = forwardRef(function SelectSSR(props, ref) {
    return <SelectBase ref={ref} Field={InputSSR} Menu={MenuSSR} MenuItem={MenuItemSSR} {...props} />;
});
