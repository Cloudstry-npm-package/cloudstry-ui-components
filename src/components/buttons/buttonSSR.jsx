import { useEffect } from "react";
import ButtonBase from "./button.base.jsx";

export function ButtonSSR(props) {
    useEffect(() => {
        // Only run on client
        import("@material/web/button/filled-button.js");
        import("@material/web/button/outlined-button.js");
        import("@material/web/button/text-button.js");
        import("@material/web/icon/icon.js");
    }, []);

    return <ButtonBase {...props} />;
}
