"use client";
import "@material/web/list/list.js";
import "@material/web/list/list-item.js";
import { forwardRef } from "react";
import ListBase from "./list.base.jsx";
import ListItemBase from "./list-item.base.jsx";

// Client entry: registers md-list and md-list-item custom elements at module
// evaluation, then renders the presentational bases. Use inside client
// components — see README.

export const List = forwardRef(function List(props, ref) {
    return <ListBase ref={ref} {...props} />;
});

export const ListItem = forwardRef(function ListItem(props, ref) {
    return <ListItemBase ref={ref} {...props} />;
});
