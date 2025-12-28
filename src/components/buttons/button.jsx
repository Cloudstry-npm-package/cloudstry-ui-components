import "@material/web/button/filled-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/button/text-button.js";
import "@material/web/icon/icon.js";
import ButtonBase from "./button.base.jsx";

function Button(props) {
    return <ButtonBase {...props} />;
}

export default Button;
export { Button };
