import SnackbarBase from "./snackbar.base.jsx";

/**
 * SnackbarContainer — renders the fixed positioner + persistent live regions.
 *
 * Live regions are ALWAYS present in the DOM (even when no snackbar is active).
 * This is required by ARIA: the live region must exist before content is injected
 * so assistive technology registers the observer and announces future changes.
 *
 * Two separate regions handle polite (info/success) and assertive (warning/error)
 * announcement roles — avoiding the race condition of changing role + content
 * simultaneously on a single element.
 */
function SnackbarContainer({
    active,         // current notification object | null
    isExiting,      // boolean — true while exit animation runs
    position,       // "bottom-center" | "bottom-start" | "bottom-end"
    onClose,
    onPause,
    onResume,
}) {
    const isUrgent  = active?.type === "warning" || active?.type === "error";
    // Clear the live region while exiting so the next notification triggers a
    // fresh announcement rather than a no-change event on identical messages.
    const announceMsg = active && !isExiting ? active.message : "";

    return (
        <>
            {/* Persistent polite live region (info / success) */}
            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="cst-snackbar-sr-region"
            >
                {!isUrgent ? announceMsg : ""}
            </div>

            {/* Persistent assertive live region (warning / error) */}
            <div
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
                className="cst-snackbar-sr-region"
            >
                {isUrgent ? announceMsg : ""}
            </div>

            {/* Visual positioner */}
            <div className={`cst-snackbar-positioner cst-snackbar-positioner--${position}`}>
                {active && (
                    <SnackbarBase
                        message={active.message}
                        type={active.type ?? "info"}
                        action={active.action}
                        dismissible={active.dismissible ?? false}
                        isExiting={isExiting}
                        onDismiss={onClose}
                        onActionClick={() => {
                            active.action?.onClick?.();
                            onClose();
                        }}
                        onMouseEnter={onPause}
                        onMouseLeave={onResume}
                        onFocus={onPause}
                        onBlur={onResume}
                    />
                )}
            </div>
        </>
    );
}

export default SnackbarContainer;
