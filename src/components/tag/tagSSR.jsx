import { forwardRef } from "react";
import TagBase from "./tag.base.jsx";

// SSR entry exists for structural consistency with the rest of the library.
// Tag has no custom-element registration to defer, so this is behaviourally
// identical to the client entry.
export const TagSSR = forwardRef(function TagSSR(props, ref) {
    return <TagBase ref={ref} {...props} />;
});

export default TagSSR;
