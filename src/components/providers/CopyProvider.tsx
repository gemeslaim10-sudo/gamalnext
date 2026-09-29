"use client";

import { createContext, useCallback, useContext, type ReactNode } from "react";
import { COPY_DEFAULTS, type CopyKey } from "@/config/copy";
import { formatCopy, type CopyValues } from "@/lib/copy/types";

const CopyContext = createContext<CopyValues>(COPY_DEFAULTS);

/** Receives the texts the server already loaded, so client components render them on first paint. */
export function CopyProvider({ values, children }: { values: CopyValues; children: ReactNode }) {
    return <CopyContext.Provider value={values}>{children}</CopyContext.Provider>;
}

/** `const t = useCopy(); t("nav.home")` — texts edited in /admin/copy. */
export function useCopy() {
    const values = useContext(CopyContext);
    return useCallback(
        (key: CopyKey, vars?: Record<string, string | number>) => formatCopy(values[key] ?? COPY_DEFAULTS[key] ?? key, vars),
        [values]
    );
}
