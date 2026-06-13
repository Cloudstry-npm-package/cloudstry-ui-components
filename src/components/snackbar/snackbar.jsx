"use client";
import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";
import SnackbarBase from "./snackbar.base.jsx";

export { SnackbarProvider } from "./snackbar-provider.jsx";
export { useSnackbar } from "./useSnackbar.js";

// ── Matches CSS --cst-snackbar-anim-duration ───────────────────────────────
const EXIT_DURATION = 250;

/**
 * Declarative Snackbar — secondary API, standalone (no SnackbarProvider needed).
 *
 * Use the imperative hook API for most cases. This variant suits component-local
 * feedback where you already control `open` state.
 *
 * <Snackbar
 *   open={open}
 *   message="Settings saved"
 *   type="success"
 *   onClose={() => setOpen(false)}
 * />
 *
 * Accessibility: two persistent ARIA live regions are rendered into the portal
 * as long as the component is mounted. A brief 50 ms delay ensures the live
 * region is registered by AT before the message is injected (avoids the
 * create-and-inject-simultaneously problem inherent to standalone portals).
 */
export function Snackbar({
    open = false,
    message = "",
    type = "info",
    duration = 5000,
    action,
    dismissible = false,
    position = "bottom-center",
    onClose,
    className = "",
    style,
}) {
    const [isVisible, setIsVisible]     = useState(false);
    const [isExiting, setIsExiting]     = useState(false);
    const [ariaMsg, setAriaMsg]         = useState("");
    const [isMounted, setIsMounted]     = useState(false);

    const timerRef     = useRef(null);
    const exitTimerRef = useRef(null);
    const ariaTimerRef = useRef(null);
    const remainingRef = useRef(duration);
    const startTimeRef = useRef(null);

    useEffect(() => { setIsMounted(true); }, []);

    // Keep onClose current in ref for timer callbacks
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    const clearTimers = useCallback(() => {
        clearTimeout(timerRef.current);
        clearTimeout(exitTimerRef.current);
        clearTimeout(ariaTimerRef.current);
        timerRef.current = exitTimerRef.current = ariaTimerRef.current = null;
    }, []);

    // close() — trigger exit animation then call onClose
    const close = useCallback(() => {
        clearTimeout(timerRef.current);
        timerRef.current = null;
        setIsExiting(true);
        setAriaMsg("");
        exitTimerRef.current = setTimeout(() => {
            exitTimerRef.current = null;
            setIsVisible(false);
            setIsExiting(false);
            onCloseRef.current?.();
        }, EXIT_DURATION);
    }, []);

    // Keep close ref current
    const closeRef = useRef(close);
    closeRef.current = close;

    const pauseTimer = useCallback(() => {
        if (timerRef.current === null) return;
        clearTimeout(timerRef.current);
        timerRef.current = null;
        const elapsed = Date.now() - (startTimeRef.current ?? Date.now());
        remainingRef.current = Math.max(0, remainingRef.current - elapsed);
    }, []);

    const resumeTimer = useCallback(() => {
        if (timerRef.current !== null) return;
        const remaining = remainingRef.current;
        if (!remaining || remaining <= 0) return;
        startTimeRef.current = Date.now();
        timerRef.current = setTimeout(() => closeRef.current(), remaining);
    }, []);

    // React to open prop changes
    useEffect(() => {
        if (open) {
            setIsVisible(true);
            setIsExiting(false);
            remainingRef.current = duration;
            // Delay ARIA injection by 50 ms so the live region is in the DOM
            // and registered by AT before the message appears (standalone portal
            // has no pre-existing live region unlike SnackbarProvider).
            clearTimeout(ariaTimerRef.current);
            ariaTimerRef.current = setTimeout(() => {
                setAriaMsg(message);
            }, 50);
            // Start auto-dismiss timer
            if (duration > 0 && duration !== Infinity) {
                clearTimeout(timerRef.current);
                startTimeRef.current = Date.now();
                timerRef.current = setTimeout(() => closeRef.current(), duration);
            }
        } else if (isVisible && !isExiting) {
            // External close (consumer set open=false): animate out without calling onClose
            clearTimers();
            setIsExiting(true);
            setAriaMsg("");
            exitTimerRef.current = setTimeout(() => {
                setIsVisible(false);
                setIsExiting(false);
            }, EXIT_DURATION);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    // Cleanup on unmount
    useEffect(() => () => clearTimers(), [clearTimers]);

    if (!isMounted) return null;

    const isUrgent = type === "warning" || type === "error";

    return createPortal(
        <>
            {/* Persistent live regions — always in DOM when component is mounted */}
            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="cst-snackbar-sr-region"
            >
                {!isUrgent ? ariaMsg : ""}
            </div>
            <div
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
                className="cst-snackbar-sr-region"
            >
                {isUrgent ? ariaMsg : ""}
            </div>

            {/* Visual snackbar */}
            {(isVisible || isExiting) && (
                <div className={`cst-snackbar-positioner cst-snackbar-positioner--${position}`}>
                    <SnackbarBase
                        message={message}
                        type={type}
                        action={action}
                        dismissible={dismissible}
                        isExiting={isExiting}
                        onDismiss={close}
                        onActionClick={() => { action?.onClick?.(); close(); }}
                        onMouseEnter={pauseTimer}
                        onMouseLeave={resumeTimer}
                        onFocus={pauseTimer}
                        onBlur={resumeTimer}
                        className={className}
                        style={style}
                    />
                </div>
            )}
        </>,
        document.body
    );
}
