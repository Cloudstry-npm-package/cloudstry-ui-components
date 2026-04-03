import { useEffect, useRef, useState } from "react";
import "./otp.css";

function OtpInputBase({
    length = 6,
    initialSeconds = 59,
    value,
    onChange = () => { },
    onResend = () => { },
    onEnter = () => { },
    description = "Didn't get the code?",
    resendLabel = "Click to resend",
    timerPrefix = "Resend in",
    className = "",
    inputClassName = "",
}) {
    const [digits, setDigits] = useState(Array.from({ length }, () => ""));
    const [timeLeft, setTimeLeft] = useState(initialSeconds);
    const [canResend, setCanResend] = useState(false);
    const inputsRef = useRef([]);

    // FIXED: Sync when length changes WITHOUT emitting change
    useEffect(() => {
        setDigits(prev =>
            Array.from({ length }, (_, i) => prev[i] || "")
        );
    }, [length]);

    // Controlled value support
    useEffect(() => {
        if (typeof value === "string") {
            const chars = value.split("");
            const next = Array.from({ length }, (_, i) => chars[i] || "");
            setDigits(next);
        }
    }, [value, length]);

    // Timer logic
    useEffect(() => {
        if (canResend) return;
        if (timeLeft <= 0) {
            setCanResend(true);
            return;
        }
        const id = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(id);
    }, [timeLeft, canResend]);

    const emitChange = (vals) => {
        onChange(vals.join(""));
    };

    const focusInput = (index) => {
        const el = inputsRef.current[index];
        if (el && typeof el.focus === "function") {
            el.focus();
        }
    };

    const handleInput = (e, index) => {
        let val = e.target.value || "";

        if (val.length > 1) {
            val = val.slice(-1);
        }

        const next = [...digits];
        next[index] = val;
        setDigits(next);
        emitChange(next); // correct: user-triggered

        if (val && index < length - 1) {
            focusInput(index + 1);
        }
    };

    const handlePaste = (e, index) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").trim();

        // Only process numeric digits
        const otpDigits = pastedData.replace(/[^0-9]/g, "").split("");

        if (otpDigits.length === 0) return;

        const next = [...digits];
        let currentIndex = index;

        // Fill digits starting from current position
        for (const digit of otpDigits) {
            if (currentIndex >= length) break;
            next[currentIndex] = digit;
            currentIndex++;
        }

        setDigits(next);
        emitChange(next);

        // Focus the next empty input or the last one
        const nextEmptyIndex = next.findIndex((d, i) => i >= index && d === "");
        if (nextEmptyIndex !== -1) {
            focusInput(nextEmptyIndex);
        } else {
            focusInput(length - 1);
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !digits[index] && index > 0) {
            focusInput(index - 1);
        }
        if (e.key === "Enter") {
            e.preventDefault();
            onEnter(digits.join(""));
        }
    };

    const handleResendClick = () => {
        if (!canResend) return;

        const cleared = Array.from({ length }, () => "");
        setDigits(cleared);
        emitChange(cleared); // correct: user-triggered

        setTimeLeft(initialSeconds);
        setCanResend(false);
        onResend();
        focusInput(0);
    };

    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const seconds = String(timeLeft % 60).padStart(2, "0");

    return (
        <div className={`cst-otp-container ${className}`}>
            <div className="cst-otp-inputs">
                {Array.from({ length }).map((_, index) => (
                    <input
                        key={index}
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoComplete="one-time-code"
                        maxLength={1}
                        value={digits[index]}
                        className={`cst-otp-input ${inputClassName}`}
                        ref={(el) => (inputsRef.current[index] = el)}
                        onInput={(e) => handleInput(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={(e) => handlePaste(e, index)}
                    />
                ))}
            </div>

            <div className="cst-otp-meta">
                <p className="cst-otp-description">
                    {description}{" "}
                    <span
                        className={`cst-otp-resend-text ${!canResend ? "disabled" : ""}`}
                        onClick={canResend ? handleResendClick : undefined}
                    >
                        {resendLabel}
                    </span>
                </p>

                <p className="cst-otp-timer">
                    {timerPrefix} {minutes}:{seconds}
                </p>
            </div>
        </div>
    );
}

export default OtpInputBase;
