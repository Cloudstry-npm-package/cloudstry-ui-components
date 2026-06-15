import { forwardRef } from "react";

const TooltipContent = forwardRef(function TooltipContent(
    { children, style, className, floatingProps },
    ref
) {
    return (
        <div
            ref={ref}
            className={`cst-tooltip${className ? ` ${className}` : ""}`}
            style={style}
            {...floatingProps}
        >
            {children}
        </div>
    );
});

export default TooltipContent;
