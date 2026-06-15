import { createContext } from "react";

/**
 * Context provided by RadioGroup to coordinate group state across Radio children.
 * null when a Radio is used standalone (outside a RadioGroup).
 */
export const RadioGroupContext = createContext(null);
