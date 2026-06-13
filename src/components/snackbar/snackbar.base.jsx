import "./snackbar.css";

/**
 * Cloudstry SnackbarBase — purely presentational snackbar box.
 *
 * No state, no effects, no portal. Renders the visible notification container
 * with message text, optional action button, and optional dismiss button.
 *
 * ARIA announcements are handled separately by persistent live-region elements
 * in the container layer (SnackbarContainer / Snackbar declarative). The
 * message span carries aria-hidden so screen readers don't double-announce.
 */
function SnackbarBase({
    message,
    type = "info",
    action,
    dismissible = false,
    isExiting = false,
    onDismiss,
    onActionClick,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    className = "",
    style,
}) {
    const classes = [
        "cst-snackbar",
        `cst-snackbar--${type}`,
        isExiting ? "cst-snackbar--exiting" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div
            className={classes}
            style={style}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onFocus={onFocus}
            onBlur={onBlur}
        >
            {/* aria-hidden: live regions announce the message; visual text is decorative */}
            <span className="cst-snackbar-message" aria-hidden="true">
                {message}
            </span>

            {action && (
                <button
                    type="button"
                    className="cst-snackbar-action"
                    onClick={onActionClick}
                >
                    {action.label}
                </button>
            )}

            {dismissible && (
                <button
                    type="button"
                    className="cst-snackbar-dismiss"
                    onClick={onDismiss}
                    aria-label="Dismiss notification"
                >
                    ×
                </button>
            )}
        </div>
    );
}

export default SnackbarBase;
