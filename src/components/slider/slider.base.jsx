import { forwardRef, useCallback, useEffect, useRef } from "react";
import "./slider.css";

const isDev =
    typeof process !== "undefined" &&
    process.env &&
    process.env.NODE_ENV !== "production";

function useMergedRef(externalRef) {
    const innerRef = useRef(null);
    const callbackRef = useCallback(
        (node) => {
            innerRef.current = node;
            if (typeof externalRef === "function") externalRef(node);
            else if (externalRef) externalRef.current = node;
        },
        [externalRef]
    );
    return [innerRef, callbackRef];
}

/**
 * Cloudstry Slider — presentational layer.
 *
 * Wraps MWC md-slider with controlled/uncontrolled support, range mode,
 * continuous (onInput) and committed (onChange) callbacks, and optional
 * value label formatting via formatValue.
 *
 * Single mode controlled:
 *   <Slider value={volume} onChange={setVolume} aria-label="Volume" />
 *
 * Single mode with live label:
 *   <Slider value={v} onChange={setV} labeled formatValue={(n) => `${n}%`} aria-label="Brightness" />
 *
 * Range mode:
 *   <Slider range valueStart={20} valueEnd={80}
 *     onChange={({ start, end }) => setRange({ start, end })}
 *     aria-label="Price range" />
 *
 * Uncontrolled:
 *   <Slider defaultValue={50} aria-label="Volume" onInput={(v) => console.log(v)} />
 */
const SliderBase = forwardRef(function SliderBase(
    {
        // Single mode
        value,
        defaultValue,
        // Range mode
        valueStart,
        defaultValueStart,
        valueEnd,
        defaultValueEnd,
        range = false,
        // Bounds
        min = 0,
        max = 100,
        step = 1,
        // Display
        disabled = false,
        labeled = false,
        ticks = false,
        // (value: number) => string — drives valueLabel / valueLabelStart / valueLabelEnd
        formatValue,
        // Range handle a11y (hyphenated Lit attrs → must sync via DOM property)
        ariaLabelStart,
        ariaLabelEnd,
        // Styling
        className = "",
        sliderClassName = "",
        style,
        // Callbacks
        onInput,    // (value | { start, end }) => void — continuous while dragging
        onChange,   // (value | { start, end }) => void — fired on release
        // Passthrough (aria-label, aria-labelledby, data-*, id, …)
        ...rest
    },
    ref
) {
    const [innerRef, callbackRef] = useMergedRef(ref);

    // ---- Mode flags -----------------------------------------------------------
    const isControlled = !range
        ? value !== undefined
        : (valueStart !== undefined || valueEnd !== undefined);

    // ---- Dev warnings ---------------------------------------------------------
    if (isDev) {
        if (!rest["aria-label"] && !rest["aria-labelledby"]) {
            // eslint-disable-next-line no-console
            console.warn(
                "[Cloudstry Slider] Sliders require an accessible name. " +
                "Add an `aria-label` or `aria-labelledby` prop."
            );
        }
    }

    // ---- Keep callbacks in refs so mount-only listeners stay current ----------
    const onInputRef    = useRef(onInput);
    onInputRef.current  = onInput;
    const onChangeRef   = useRef(onChange);
    onChangeRef.current = onChange;
    const formatValueRef    = useRef(formatValue);
    formatValueRef.current  = formatValue;

    // Mirror props that event handlers need without causing re-registration
    const rangeRef    = useRef(range);
    rangeRef.current  = range;
    const labeledRef  = useRef(labeled);
    labeledRef.current = labeled;

    // ---- Seed uncontrolled + initial labels on mount -------------------------
    useEffect(() => {
        const el = innerRef.current;
        if (!el) return;
        if (!range) {
            if (value === undefined && defaultValue !== undefined) el.value = defaultValue;
        } else {
            if (valueStart === undefined && defaultValueStart !== undefined) el.valueStart = defaultValueStart;
            if (valueEnd === undefined && defaultValueEnd !== undefined)     el.valueEnd   = defaultValueEnd;
        }
        // Seed initial labels
        const fmt = formatValueRef.current;
        if (fmt && (labeled || fmt)) {
            if (!range) {
                const v = el.value !== undefined ? Number(el.value) : (defaultValue ?? (min + max) / 2);
                el.valueLabel = fmt(v);
            } else {
                const s = el.valueStart !== undefined ? Number(el.valueStart) : (defaultValueStart ?? min);
                const e = el.valueEnd   !== undefined ? Number(el.valueEnd)   : (defaultValueEnd   ?? max);
                el.valueLabelStart = fmt(s);
                el.valueLabelEnd   = fmt(e);
            }
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ---- Sync controlled value — single mode ---------------------------------
    // valueStart/valueEnd have Lit attributes `value-start` / `value-end`
    // (hyphenated) which React 18 cannot set from camelCase JSX. Use DOM property.
    useEffect(() => {
        const el = innerRef.current;
        if (!el || range || value === undefined) return;
        el.value = value;
        const fmt = formatValueRef.current;
        if (fmt) el.valueLabel = fmt(value);
    }, [value, range]); // eslint-disable-line react-hooks/exhaustive-deps

    // ---- Sync controlled values — range mode ---------------------------------
    useEffect(() => {
        const el = innerRef.current;
        if (!el || !range) return;
        if (valueStart !== undefined) {
            el.valueStart = valueStart;
            const fmt = formatValueRef.current;
            if (fmt) el.valueLabelStart = fmt(valueStart);
        }
        if (valueEnd !== undefined) {
            el.valueEnd = valueEnd;
            const fmt = formatValueRef.current;
            if (fmt) el.valueLabelEnd = fmt(valueEnd);
        }
    }, [valueStart, valueEnd, range]); // eslint-disable-line react-hooks/exhaustive-deps

    // ---- Sync ariaLabelStart / ariaLabelEnd (hyphenated Lit attrs) -----------
    useEffect(() => {
        const el = innerRef.current;
        if (!el) return;
        if (ariaLabelStart !== undefined) el.ariaLabelStart = ariaLabelStart;
        if (ariaLabelEnd   !== undefined) el.ariaLabelEnd   = ariaLabelEnd;
    }, [ariaLabelStart, ariaLabelEnd]);

    // ---- Attach input / change listeners on mount ----------------------------
    // Labels are synced here directly (not through React state) for smooth
    // drag UX — avoids a React render cycle on every pointer move.
    useEffect(() => {
        const el = innerRef.current;
        if (!el) return;

        const syncLabel = () => {
            const fmt = formatValueRef.current;
            if (!fmt) return;
            const isR = rangeRef.current;
            if (!isR) {
                if (el.value !== undefined) el.valueLabel = fmt(Number(el.value));
            } else {
                if (el.valueStart !== undefined) el.valueLabelStart = fmt(Number(el.valueStart));
                if (el.valueEnd   !== undefined) el.valueLabelEnd   = fmt(Number(el.valueEnd));
            }
        };

        const handleInput = () => {
            syncLabel();
            const isR = rangeRef.current;
            const v   = isR ? { start: el.valueStart, end: el.valueEnd } : el.value;
            onInputRef.current?.(v);
        };

        const handleChange = () => {
            syncLabel();
            const isR = rangeRef.current;
            const v   = isR ? { start: el.valueStart, end: el.valueEnd } : el.value;
            onChangeRef.current?.(v);
        };

        el.addEventListener("input",  handleInput);
        el.addEventListener("change", handleChange);
        return () => {
            el.removeEventListener("input",  handleInput);
            el.removeEventListener("change", handleChange);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ---- Build md-slider element ---------------------------------------------
    const wrapperClasses = ["cst-slider-wrapper", className].filter(Boolean).join(" ");
    const sliderClasses  = ["cst-slider", sliderClassName].filter(Boolean).join(" ");

    const mdAttrs = { min, max, step };
    if (disabled) mdAttrs.disabled = true;
    if (range)    mdAttrs.range    = true;
    if (labeled || formatValue) mdAttrs.labeled = true;
    if (ticks)    mdAttrs.ticks    = true;

    return (
        <div className={wrapperClasses} style={style}>
            <md-slider
                ref={callbackRef}
                className={sliderClasses}
                {...mdAttrs}
                {...rest}
            />
        </div>
    );
});

export default SliderBase;
