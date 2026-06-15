import { useEffect, useId, useRef, useState } from "react";
import "./otp.css";

/* ─── Hook: useResendTimer ─────────────────────────────────────────────────
 * Owns countdown state. When canResendOverride is supplied, the internal
 * interval is not started — the consumer drives canResend externally.
 * timerTextOverride replaces the internal "MM:SS" display when provided.
 */
function useResendTimer(initialSeconds, canResendOverride, timerTextOverride) {
    const controlled = canResendOverride !== undefined;
    const [timeLeft, setTimeLeft] = useState(initialSeconds);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (controlled) return;
        if (canResend) return;
        if (timeLeft <= 0) {
            setCanResend(true);
            return;
        }
        const id = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(id);
    }, [timeLeft, canResend, controlled]);

    const resetTimer = () => {
        if (controlled) return;
        setTimeLeft(initialSeconds);
        setCanResend(false);
    };

    const resolvedCanResend = controlled ? canResendOverride : canResend;

    let timerDisplay = "";
    if (timerTextOverride !== undefined) {
        timerDisplay = timerTextOverride;
    } else if (!controlled && timeLeft > 0) {
        const m = String(Math.floor(timeLeft / 60)).padStart(2, "0");
        const s = String(timeLeft % 60).padStart(2, "0");
        timerDisplay = `${m}:${s}`;
    }

    return { canResend: resolvedCanResend, timerDisplay, resetTimer };
}

/* ─── Hook: useFocusManager ────────────────────────────────────────────── */
function useFocusManager(inputsRef) {
    const focusInput = (index) => {
        const el = inputsRef.current[index];
        if (el && typeof el.focus === "function") el.focus();
    };
    return { focusInput };
}

/* ─── Hook: useOtpDigits ───────────────────────────────────────────────────
 * Owns digits[] state. Syncs from controlled `value` prop. Emits onChange
 * and fires onComplete (debounced one tick) when all positions are filled.
 */
function useOtpDigits(length, valueFromProps, onChange, onComplete) {
    const isControlled = typeof valueFromProps === "string";
    const [digits, setDigits] = useState(() => Array.from({ length }, () => ""));
    const wasControlled = useRef(isControlled);

    useEffect(() => {
        if (process.env.NODE_ENV !== "production") {
            if (wasControlled.current !== isControlled) {
                console.warn(
                    "[OtpInput] Switching between controlled and uncontrolled modes. " +
                    "Provide `value` consistently or not at all."
                );
            }
            wasControlled.current = isControlled;
        }
    });

    // Resize without emitting when length changes
    useEffect(() => {
        setDigits((prev) => Array.from({ length }, (_, i) => prev[i] || ""));
    }, [length]);

    // Sync from controlled value
    useEffect(() => {
        if (isControlled) {
            const chars = valueFromProps.split("");
            setDigits(Array.from({ length }, (_, i) => chars[i] || ""));
        }
    }, [valueFromProps, length, isControlled]);

    const emitChange = (vals) => {
        onChange?.(vals.join(""));
    };

    const checkComplete = (vals) => {
        if (onComplete && vals.length === length && vals.every((d) => d !== "")) {
            setTimeout(() => onComplete(vals.join("")), 0);
        }
    };

    // Returns the new digits array
    const setAllDigits = (next) => {
        setDigits(next);
        emitChange(next);
        checkComplete(next);
        return next;
    };

    const updateDigit = (index, val, currentDigits) => {
        const next = [...currentDigits];
        next[index] = val;
        return setAllDigits(next);
    };

    return { digits, setAllDigits, updateDigit, emitChange };
}

/* ─── OtpInputBase ─────────────────────────────────────────────────────── */
function OtpInputBase({
    // Existing props — all unchanged
    length = 6,
    initialSeconds = 59,
    value,
    onChange,
    onResend,
    onEnter,
    description = "Didn't get the code?",
    resendLabel = "Click to resend",
    timerPrefix = "Resend in",
    className = "",
    inputClassName = "",

    // New props (additive — zero breaking changes)
    disabled = false,
    error = null,
    onComplete,
    autoFocus = false,
    showTimer = true,
    canResend: canResendProp,
    timerText,
}) {
    const inputsRef = useRef([]);
    const componentId = useId();

    const { digits, setAllDigits, updateDigit } = useOtpDigits(
        length, value, onChange, onComplete
    );
    const { focusInput } = useFocusManager(inputsRef);
    const { canResend, timerDisplay, resetTimer } = useResendTimer(
        initialSeconds, canResendProp, timerText
    );

    // autoFocus: place focus on first digit once on mount (skip if disabled)
    useEffect(() => {
        if (autoFocus && !disabled) {
            const t = setTimeout(() => focusInput(0), 0);
            return () => clearTimeout(t);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // WebOTP progressive enhancement — Android Chrome only.
    // Guard: OTPCredential exists on desktop Chrome too (added to API surface broadly),
    // but calling navigator.credentials.get with sms transport on non-Android sends an
    // invalid Mojo IPC message that kills the renderer tab. Require Android UA.
    useEffect(() => {
        if (!("OTPCredential" in window)) return;
        if (!/Android/i.test(navigator.userAgent)) return;
        if (disabled) return;

        const controller = new AbortController();
        navigator.credentials
            .get({ otp: { transport: ["sms"] }, signal: controller.signal })
            .then((credential) => {
                const code = (credential.code || "").replace(/[^0-9]/g, "");
                const next = Array.from({ length }, (_, i) => code[i] || "");
                setAllDigits(next);
                focusInput(Math.min(code.length, length) - 1);
            })
            .catch(() => {
                // User dismissed or timed out — silent no-op
            });

        return () => controller.abort();
    }, [disabled]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleChange = (e, index) => {
        if (disabled) return;
        let val = e.target.value || "";
        // Keep only the last character entered; reject non-digits
        if (val.length > 1) val = val.slice(-1);
        if (val && !/^[0-9]$/.test(val)) return;

        updateDigit(index, val, digits);
        if (val && index < length - 1) focusInput(index + 1);
    };

    const handlePaste = (e, index) => {
        if (disabled) return;
        e.preventDefault();
        const raw = e.clipboardData.getData("text").trim();
        const otpDigits = raw.replace(/[^0-9]/g, "").split("");
        if (otpDigits.length === 0) return;

        // Full-length paste always fills from position 0
        const startIndex = otpDigits.length === length ? 0 : index;
        const next = [...digits];
        let pos = startIndex;
        for (const d of otpDigits) {
            if (pos >= length) break;
            next[pos++] = d;
        }
        setAllDigits(next);

        const nextEmpty = next.findIndex((d, i) => i >= startIndex && d === "");
        focusInput(nextEmpty !== -1 ? nextEmpty : length - 1);
    };

    const handleKeyDown = (e, index) => {
        if (disabled) return;
        if (e.key === "Backspace" && !digits[index] && index > 0) {
            focusInput(index - 1);
        }
        if (e.key === "Enter") {
            e.preventDefault();
            onEnter?.(digits.join(""));
        }
    };

    const handleResendClick = () => {
        if (!canResend) return;
        const cleared = Array.from({ length }, () => "");
        setAllDigits(cleared);
        resetTimer();
        onResend?.();
        focusInput(0);
    };

    const errorId = `${componentId}-error`;

    return (
        <div
            className={`cst-otp-container${className ? ` ${className}` : ""}`}
            data-error={error ? "" : undefined}
            data-disabled={disabled ? "" : undefined}
        >
            <div
                role="group"
                aria-label="One-time password"
                aria-describedby={error ? errorId : undefined}
                className="cst-otp-inputs"
            >
                {Array.from({ length }).map((_, index) => (
                    <input
                        key={index}
                        ref={(el) => (inputsRef.current[index] = el)}
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoComplete="one-time-code"
                        autoCorrect="off"
                        autoCapitalize="none"
                        spellCheck={false}
                        maxLength={1}
                        value={digits[index]}
                        disabled={disabled}
                        aria-label={`Digit ${index + 1} of ${length}`}
                        aria-invalid={error ? "true" : undefined}
                        aria-required="true"
                        className={`cst-otp-input${inputClassName ? ` ${inputClassName}` : ""}`}
                        data-filled={digits[index] !== "" ? "" : undefined}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={(e) => handlePaste(e, index)}
                    />
                ))}
            </div>

            {error && (
                <p id={errorId} role="alert" className="cst-otp-error">
                    {error}
                </p>
            )}

            {showTimer && (
                <div className="cst-otp-meta">
                    <p className="cst-otp-description">
                        {description}{" "}
                        <button
                            type="button"
                            className={`cst-otp-resend-btn${!canResend ? " disabled" : ""}`}
                            disabled={!canResend}
                            onClick={handleResendClick}
                            aria-label={
                                canResend
                                    ? resendLabel
                                    : `${resendLabel} — available in ${timerDisplay}`
                            }
                        >
                            {resendLabel}
                        </button>
                    </p>

                    {timerDisplay && (
                        <p className="cst-otp-timer">
                            {timerPrefix} {timerDisplay}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

export default OtpInputBase;
