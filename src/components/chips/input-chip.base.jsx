import { forwardRef, useCallback, useEffect, useRef, isValidElement, cloneElement } from "react";
import "./chips.css";

/**
 * Merges external forwarded ref with an internal ref needed for the remove
 * event listener.
 */
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
 * Cloudstry InputChip — presentational layer.
 *
 * A removable chip representing a user-created token (email tag, search token,
 * etc.). The parent manages the chip list; `onRemove` signals removal.
 *
 *   <InputChip label="jane@example.com" onRemove={() => removeChip(id)} />
 *
 * Avatar mode — shows a circular image as the leading element:
 *   <InputChip
 *     label="Jane Smith"
 *     avatar={<img src={avatarUrl} alt="" />}
 *     onRemove={fn}
 *   />
 *
 * The `avatar` prop also activates MWC's circular-crop styling on the icon
 * slot. When `avatar` is provided, `icon` is ignored.
 *
 * `onRemove` receives no arguments.
 */
const InputChipBase = forwardRef(function InputChipBase(
    {
        label,
        avatar,         // ReactElement — avatar image (circular clip); activates avatar mode
        icon,           // ReactElement — generic leading icon (ignored when avatar is set)
        href,
        target,
        rel,
        disabled = false,
        size = "md",    // "sm" | "md"
        onRemove,       // () => void
        onClick,
        className = "",
        style,
        ...rest
    },
    ref
) {
    const [innerRef, callbackRef] = useMergedRef(ref);
    const onRemoveRef = useRef(onRemove);
    onRemoveRef.current = onRemove;

    // MWC fires a `remove` event when the user clicks the trailing remove button.
    useEffect(() => {
        const el = innerRef.current;
        if (!el) return;
        const handler = () => onRemoveRef.current?.();
        el.addEventListener("remove", handler);
        return () => el.removeEventListener("remove", handler);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const classes = ["cst-chip", "cst-chip--input", `cst-chip--${size}`, className].filter(Boolean).join(" ");

    const attrs = {};
    if (disabled) attrs.disabled = true;
    if (href) attrs.href = href;
    if (target) attrs.target = target;
    if (rel) attrs.rel = rel;
    if (onClick) attrs.onClick = onClick;

    // `avatar` prop: boolean activates MWC's circular-clip CSS on the icon slot.
    const hasAvatar = isValidElement(avatar);
    if (hasAvatar) attrs.avatar = true;

    // Resolve the slot content: avatar takes precedence over icon.
    const slotSource = hasAvatar ? avatar : isValidElement(icon) ? icon : null;
    const iconNode = slotSource ? cloneElement(slotSource, { slot: "icon" }) : null;

    return (
        <md-input-chip
            ref={callbackRef}
            label={label}
            className={classes}
            style={style}
            {...attrs}
            {...rest}
        >
            {iconNode}
        </md-input-chip>
    );
});

export default InputChipBase;
