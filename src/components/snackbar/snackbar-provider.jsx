import {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";
import SnackbarContainer from "./snackbar-container.jsx";

// ── CSS animation duration — must match CSS --cst-snackbar-anim-duration ──
const EXIT_DURATION = 250;

let _nextId = 0;

// ── Queue state machine ────────────────────────────────────────────────────

const initialState = { active: null, isExiting: false, queue: [] };

function reducer(state, action) {
    switch (action.type) {
        case "SHOW": {
            // Immediately promote when no notification is visible
            if (!state.active) {
                return { ...state, active: action.payload, isExiting: false };
            }
            return { ...state, queue: [...state.queue, action.payload] };
        }
        case "CLOSE_START": {
            if (!state.active) return state;
            return { ...state, isExiting: true };
        }
        case "CLOSE_END": {
            const [next = null, ...rest] = state.queue;
            return { active: next, isExiting: false, queue: rest };
        }
        default:
            return state;
    }
}

// ── Context ────────────────────────────────────────────────────────────────

export const SnackbarContext = createContext(null);

// ── Provider ───────────────────────────────────────────────────────────────

export function SnackbarProvider({
    children,
    defaultDuration = 5000,
    position = "bottom-center",
}) {
    const [state, dispatch] = useReducer(reducer, initialState);
    // Portal target: only rendered client-side to avoid hydration mismatch.
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { setIsMounted(true); }, []);

    // ── Timer refs ──────────────────────────────────────────────────────────
    const timerRef     = useRef(null);  // auto-dismiss setTimeout handle
    const exitTimerRef = useRef(null);  // exit animation setTimeout handle
    const remainingRef = useRef(null);  // ms remaining when paused
    const startTimeRef = useRef(null);  // when current timer started (Date.now())

    // startExit stored as ref so timerRef callback is always current
    const startExitRef = useRef(null);

    const clearDismissTimer = useCallback(() => {
        if (timerRef.current !== null) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const startExit = useCallback(() => {
        clearDismissTimer();
        dispatch({ type: "CLOSE_START" });
        if (exitTimerRef.current !== null) clearTimeout(exitTimerRef.current);
        exitTimerRef.current = setTimeout(() => {
            exitTimerRef.current = null;
            dispatch({ type: "CLOSE_END" });
        }, EXIT_DURATION);
    }, [clearDismissTimer]);

    // Keep startExit ref current so the dismiss timer callback is never stale
    startExitRef.current = startExit;

    // ── Start timer for the active notification ────────────────────────────
    useEffect(() => {
        if (!state.active || state.isExiting) {
            clearDismissTimer();
            return;
        }
        const duration = state.active.duration ?? defaultDuration;
        if (duration <= 0 || duration === Infinity) return; // persistent

        clearDismissTimer();
        remainingRef.current = duration;
        startTimeRef.current = Date.now();
        timerRef.current = setTimeout(() => {
            timerRef.current = null;
            startExitRef.current?.();
        }, duration);

        return clearDismissTimer;
    }, [state.active?.id, state.isExiting, defaultDuration, clearDismissTimer]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Full cleanup on unmount ────────────────────────────────────────────
    useEffect(() => {
        return () => {
            if (timerRef.current !== null)    clearTimeout(timerRef.current);
            if (exitTimerRef.current !== null) clearTimeout(exitTimerRef.current);
        };
    }, []);

    // ── Pause / resume (hover + focus) ─────────────────────────────────────
    const pauseTimer = useCallback(() => {
        if (timerRef.current === null) return;
        clearTimeout(timerRef.current);
        timerRef.current = null;
        const elapsed = Date.now() - (startTimeRef.current ?? Date.now());
        remainingRef.current = Math.max(0, (remainingRef.current ?? 0) - elapsed);
    }, []);

    const resumeTimer = useCallback(() => {
        // Only restart if paused (no active handle) and time remains
        if (timerRef.current !== null) return;
        const remaining = remainingRef.current;
        if (!remaining || remaining <= 0) return;
        startTimeRef.current = Date.now();
        timerRef.current = setTimeout(() => {
            timerRef.current = null;
            startExitRef.current?.();
        }, remaining);
    }, []);

    // ── Public show() API ──────────────────────────────────────────────────
    const show = useCallback((config) => {
        _nextId += 1;
        dispatch({
            type: "SHOW",
            payload: { id: _nextId, ...config },
        });
    }, []);

    const contextValue = useMemo(
        () => ({ show }),
        [show]
    );

    return (
        <SnackbarContext.Provider value={contextValue}>
            {children}
            {isMounted && createPortal(
                <SnackbarContainer
                    active={state.active}
                    isExiting={state.isExiting}
                    position={position}
                    onClose={startExit}
                    onPause={pauseTimer}
                    onResume={resumeTimer}
                />,
                document.body
            )}
        </SnackbarContext.Provider>
    );
}
