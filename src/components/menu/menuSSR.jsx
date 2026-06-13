import { forwardRef, useEffect } from "react";
import MenuBase from "./menu.base.jsx";
import MenuItemBase from "./menu-item.base.jsx";

function useRegisterMenu() {
    useEffect(() => {
        import("@material/web/menu/menu.js");
        import("@material/web/menu/menu-item.js");
    }, []);
}

export const MenuSSR = forwardRef(function MenuSSR(props, ref) {
    useRegisterMenu();
    return <MenuBase ref={ref} {...props} />;
});

export const MenuItemSSR = forwardRef(function MenuItemSSR(props, ref) {
    useRegisterMenu();
    return <MenuItemBase ref={ref} {...props} />;
});
