import { useContext } from "react";
import { SnackbarContext } from "./snackbar-provider.jsx";

const isDev =
    typeof process !== "undefined" &&
    process.env &&
    process.env.NODE_ENV !== "production";

const noOpContext = { show: () => {} };

/**
 * useSnackbar — imperative snackbar API.
 *
 * Must be used inside a <SnackbarProvider>.
 *
 * Returns:
 *   show(config) — enqueue a notification
 *
 * Config shape:
 *   message:    string (required)
 *   type:       "info" | "success" | "warning" | "error"  (default "info")
 *   duration:   number ms, 0 = persistent                 (default provider defaultDuration)
 *   action:     { label: string, onClick: () => void }
 *   dismissible: boolean — show X close button
 */
export function useSnackbar() {
    const ctx = useContext(SnackbarContext);
    if (isDev && ctx === null) {
        // eslint-disable-next-line no-console
        console.warn(
            "[Cloudstry] useSnackbar() called outside <SnackbarProvider>. " +
            "Wrap your application (or the relevant subtree) with <SnackbarProvider>."
        );
    }
    return ctx ?? noOpContext;
}
