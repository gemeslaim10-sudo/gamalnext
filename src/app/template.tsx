import type { ReactNode } from "react";

// Next.js re-mounts templates on navigation, so each new page settles in with a short fade
// while the navbar and footer (in the layout) stay put.
export default function Template({ children }: { children: ReactNode }) {
    return <div className="animate-page-in">{children}</div>;
}
