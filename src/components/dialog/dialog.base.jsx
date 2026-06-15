import { forwardRef, useCallback, useEffect, useRef } from "react";
import "./dialog.css";

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
 * Cloudstry Dialog — presentational layer.
 *
 * Controlled only. `open` drives show()/close() imperatively via ref because
 * md-dialog.open is a getter/setter (not a plain attribute) that manages
 * animation state internally. React attribute passthrough alone does not work.
 *
 * Controlled:
 *   <Dialog open={open} onClose={() => setOpen(false)}>…</Dialog>
 *
 * Slot API:
 *   headline → slot="headline"
 *   children → slot="content"
 *   actions  → slot="actions"
 *
 * Consumers should never manually assign MWC slot names.
 *
 * onClose(returnValue) fires after the close animation completes.
 * onCancel(event) fires on Escape or scrim click; call event.preventDefault()
 * to block the close (unsaved-changes guard).
 */
const DialogBase = forwardRef(function DialogBase(
    {
        open = false,
        headline,
        actions,
        children,
        type,               // "alert" → role="alertdialog"
        quick = false,      // skip open/close animations
        onOpen,             // () => void — after open animation completes
        onClose,            // (returnValue: string) => void — after close animation
        onCancel,           // (event: Event) => void — Escape / scrim click
        className = "",
        dialogClassName = "",
        style,
        ...rest
    },
    ref
) {
    const [innerRef, callbackRef] = useMergedRef(ref);

    const onOpenRef = useRef(onOpen);
    onOpenRef.current = onOpen;
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;
    const onCancelRef = useRef(onCancel);
    onCancelRef.current = onCancel;

    // Sync open state → show()/close() imperative calls.
    // md-dialog.open is a getter/setter; calling show()/close() is the only
    // reliable way to open/close with correct animation in MWC v1.x.
    useEffect(() => {
        const el = innerRef.current;
        if (!el) return;
        if (open) {
            el.show();
        } else {
            el.close();
        }
    }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

    // Event wiring — attached once on mount; callbacks stay current via refs.
    useEffect(() => {
        const el = innerRef.current;
        if (!el) return;

        // "opened" fires after the open animation finishes (focus trap is active)
        const handleOpened = () => onOpenRef.current?.();
        // "closed" fires after close animation; el.returnValue carries the value
        const handleClosed = () => onCloseRef.current?.(el.returnValue);
        // "cancel" fires on Escape or scrim click; preventDefault() blocks close
        const handleCancel = (event) => onCancelRef.current?.(event);

        el.addEventListener("opened", handleOpened);
        el.addEventListener("closed", handleClosed);
        el.addEventListener("cancel", handleCancel);

        return () => {
            el.removeEventListener("opened", handleOpened);
            el.removeEventListener("closed", handleClosed);
            el.removeEventListener("cancel", handleCancel);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const mdAttrs = {};
    if (quick) mdAttrs.quick = true;
    if (type) mdAttrs.type = type;

    const classes = ["cst-dialog", dialogClassName, className].filter(Boolean).join(" ");

    return (
        <md-dialog
            ref={callbackRef}
            className={classes}
            style={style}
            {...mdAttrs}
            {...rest}
        >
            {headline != null && (
                <span slot="headline">{headline}</span>
            )}
            {children != null && (
                <div slot="content" className="cst-dialog__content">
                    {children}
                </div>
            )}
            {actions != null && (
                <div slot="actions" className="cst-dialog__actions">
                    {actions}
                </div>
            )}
        </md-dialog>
    );
});

export default DialogBase;
