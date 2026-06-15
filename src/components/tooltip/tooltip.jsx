"use client";
import "./tooltip.css";
import { Children, cloneElement, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
    useFloating,
    autoUpdate,
    offset,
    flip,
    shift,
    useHover,
    useFocus,
    useDismiss,
    useRole,
    useInteractions,
} from "@floating-ui/react";
import TooltipContent from "./tooltip-content.jsx";

export function Tooltip({
    children,
    content,
    placement = "top",
    delay = 300,
    showOnTouch = false,
    disabled = false,
    className = "",
    style,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => { setIsMounted(true); }, []);

    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        placement,
        middleware: [
            offset(8),
            flip({ padding: 8 }),
            shift({ padding: 8 }),
        ],
        whileElementsMounted: autoUpdate,
    });

    const hover = useHover(context, {
        delay: { open: delay, close: 0 },
        mouseOnly: !showOnTouch,
        enabled: !disabled,
    });
    const focus = useFocus(context, { enabled: !disabled });
    const dismiss = useDismiss(context);
    const role = useRole(context, { role: "tooltip" });

    const { getReferenceProps, getFloatingProps } = useInteractions([
        hover,
        focus,
        dismiss,
        role,
    ]);

    if (!children) return null;
    const child = Children.only(children);

    const tooltipNode = isMounted && isOpen && content != null ? (
        <TooltipContent
            ref={refs.setFloating}
            style={{ ...floatingStyles, ...style }}
            className={className}
            floatingProps={getFloatingProps()}
        >
            {content}
        </TooltipContent>
    ) : null;

    return (
        <>
            {cloneElement(child, {
                ref: refs.setReference,
                ...getReferenceProps(),
            })}
            {tooltipNode && createPortal(tooltipNode, document.body)}
        </>
    );
}

export default Tooltip;
