import { forwardRef } from "react";
import TagBase from "./tag.base.jsx";

// Tag is pure CSS over a <span> — no Material Web element to register and no
// client-only API — so this entry is a straight passthrough and Tag is NOT
// listed in CLIENT_ENTRY_SUFFIXES. It renders unchanged in a Server Component.
// (Same shape as Divider.)
const Tag = forwardRef(function Tag(props, ref) {
    return <TagBase ref={ref} {...props} />;
});

export default Tag;
export { Tag };
