import { forwardRef, useCallback, useEffect, useRef } from "react";

const isDev =
    typeof process !== "undefined" &&
    process.env &&
    process.env.NODE_ENV !== "production";

function clamp0to100(v) {
    const n = Number(v);
    return isNaN(n) ? 0 : Math.max(0, Math.min(100, n));
}

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
 * Cloudstry LinearProgress — presentational layer.
 *
 * Wraps MWC md-linear-progress with a 0–100 value range (mapped to 0–1
 * internally), optional buffer bar, dev-mode a11y warning, and token contract.
 *
 * Determinate:
 *   <LinearProgress value={60} aria-label="Uploading file" />
 *
 * Buffer (e.g. video preload):
 *   <LinearProgress value={40} buffer={70} aria-label="Buffering video" />
 *
 * Indeterminate:
 *   <LinearProgress indeterminate aria-label="Loading" />
 *
 * Four-color indeterminate:
 *   <LinearProgress indeterminate fourColor aria-label="Loading" />
 *
 * Accessibility: an accessible name is required (aria-label or aria-labelledby).
 * A dev warning fires when both are absent.
 */
const LinearProgressBase = forwardRef(function LinearProgressBase(
    {
        value,                  // number 0–100; omit for indeterminate mode
        buffer,                 // number 0–100; secondary buffer bar
        indeterminate = false,
        fourColor = false,
        className = "",
        style,
        ...rest                 // aria-label, aria-labelledby, data-*, id, …
    },
    ref
) {
    const [innerRef, callbackRef] = useMergedRef(ref);

    if (isDev) {
        if (!rest["aria-label"] && !rest["aria-labelledby"]) {
            // eslint-disable-next-line no-console
            console.warn(
                "[Cloudstry LinearProgress] Progress indicators require an accessible name. " +
                "Add an `aria-label` or `aria-labelledby` prop."
            );
        }
    }

    // fourColor has Lit attribute name `four-color` (hyphenated). Set as DOM
    // property imperatively — same pattern as Menu's keepOpen.
    useEffect(() => {
        const el = innerRef.current;
        if (!el) return;
        el.fourColor = !!fourColor;
    }, [fourColor]); // eslint-disable-line react-hooks/exhaustive-deps

    const classes = ["cst-linear-progress", className].filter(Boolean).join(" ");

    const mdAttrs = {};
    if (indeterminate) {
        mdAttrs.indeterminate = true;
    } else if (value !== undefined) {
        mdAttrs.value = clamp0to100(value) / 100;
    }
    if (!indeterminate && buffer !== undefined) {
        mdAttrs.buffer = clamp0to100(buffer) / 100;
    }

    return (
        <md-linear-progress
            ref={callbackRef}
            className={classes}
            style={style}
            {...mdAttrs}
            {...rest}
        />
    );
});

export default LinearProgressBase;
