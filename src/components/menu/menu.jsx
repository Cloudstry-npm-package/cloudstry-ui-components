"use client";
import "@material/web/menu/menu.js";
import "@material/web/menu/menu-item.js";
import { forwardRef } from "react";
import MenuBase from "./menu.base.jsx";
import MenuItemBase from "./menu-item.base.jsx";

export const Menu = forwardRef(function Menu(props, ref) {
    return <MenuBase ref={ref} {...props} />;
});

export const MenuItem = forwardRef(function MenuItem(props, ref) {
    return <MenuItemBase ref={ref} {...props} />;
});
