import { useId } from "react";
import "./input.css";

function InputBase({
    label = "",
    placeholder = "",
    type = "text",
    value = "",
    onChange = () => { },
    className = "",
    id: customId,
    ...rest
}) {
    const reactId = useId();
    const id = customId || `cst-input-${reactId}`;

    return (
        <div className="cst-input-wrapper">
            {label && (
                <label htmlFor={id} className="cst-input-label">
                    {label}
                </label>
            )}

            {/* Wrapper FIXES your layout */}
            <div className="cst-input-field-container">
                <md-outlined-text-field
                    id={id}
                    placeholder={placeholder}
                    type={type}
                    value={value}
                    class={className}
                    onInput={(e) => onChange(e.target.value)}
                    {...rest}
                ></md-outlined-text-field>
            </div>
        </div>
    );
}

export default InputBase;
