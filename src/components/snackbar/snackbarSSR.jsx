/**
 * SSR-safe Snackbar variants.
 *
 * SnackbarProviderSSR:
 *   Renders children + persistent (empty) live region HTML server-side.
 *   No portal, no useEffect, no client-only APIs.
 *   On hydration the client SnackbarProvider takes over and mounts the portal.
 *
 * SnackbarSSR:
 *   The declarative Snackbar renders nothing server-side (portal is client-only).
 *   Returns null — no content, no hydration mismatch.
 */

export function SnackbarProviderSSR({ children }) {
    return (
        <>
            {children}
            {/* Server-rendered live region stubs — ensures AT registers the
                observer before any client-side notifications are injected. */}
            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="cst-snackbar-sr-region"
            />
            <div
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
                className="cst-snackbar-sr-region"
            />
        </>
    );
}

export function SnackbarSSR() {
    return null;
}
