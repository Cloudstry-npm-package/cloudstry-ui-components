import { createContext, useContext } from "react";

export const TabsContext = createContext({ variant: "primary" });

export function useTabsContext() {
    return useContext(TabsContext);
}
