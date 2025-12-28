import "./button.css";

function ButtonBase({
    label = "Click Me",
    icon = null,
    variant = "filled", // "filled" | "outlined" | "text"
    disabled = false,
    onClick = () => { },
    className = "",
    style = {},
    type = "button",
}) {
    const ButtonTag =
        variant === "filled"
            ? "md-filled-button"
            : variant === "outlined"
                ? "md-outlined-button"
                : "md-text-button";

    return (
        <ButtonTag
            disabled={disabled}
            onClick={onClick}
            type={type}
            class={className}
            style={style}
        >
            {icon && <md-icon>{icon}</md-icon>}
            {label}
        </ButtonTag>
    );
}

export default ButtonBase;
