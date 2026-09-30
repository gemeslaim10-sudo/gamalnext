"use client";

import { useEffect } from "react";

const MESSAGE = "فيه تعديلات لسه ما اتحفظتش. تخرج من غير ما تحفظ؟";

/**
 * While `dirty`, asks before leaving the page — closing the tab, reloading, or following any link in
 * the dashboard (sidebar, breadcrumbs…), which the browser's own warning doesn't cover.
 */
export function useUnsavedChangesGuard(dirty: boolean) {
    useEffect(() => {
        if (!dirty) return undefined;

        const onBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
        };

        const onClick = (event: MouseEvent) => {
            if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            const anchor = (event.target as Element | null)?.closest?.("a[href]");
            if (!(anchor instanceof HTMLAnchorElement) || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
            const url = new URL(anchor.href, window.location.href);
            if (url.origin !== window.location.origin) return;
            if (url.pathname === window.location.pathname && url.search === window.location.search) return;
            if (!window.confirm(MESSAGE)) {
                event.preventDefault();
                event.stopPropagation();
            }
        };

        window.addEventListener("beforeunload", onBeforeUnload);
        // Capture phase: runs before Next.js handles the link
        document.addEventListener("click", onClick, true);
        return () => {
            window.removeEventListener("beforeunload", onBeforeUnload);
            document.removeEventListener("click", onClick, true);
        };
    }, [dirty]);
}
