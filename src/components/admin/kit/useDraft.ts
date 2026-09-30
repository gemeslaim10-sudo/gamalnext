"use client";

import { useMemo, useState } from "react";

/**
 * Editable copy of saved data for a dashboard form: `draft` is what the fields show, `dirty` says
 * whether it differs from what's saved, `reset()` goes back. When the saved data changes (loaded,
 * or saved from this form) the draft follows it.
 */
export function useDraft<T>(saved: T | null) {
    const [base, setBase] = useState<T | null>(saved);
    const [draft, setDraft] = useState<T | null>(saved);

    // Adjusted during render (not in an effect) so the fields never show stale values
    if (saved !== base) {
        setBase(saved);
        setDraft(saved);
    }

    const dirty = useMemo(() => draft !== null && base !== null && JSON.stringify(draft) !== JSON.stringify(base), [draft, base]);

    /** Changes one field: `update("title", "…")` */
    const update = <K extends keyof T>(key: K, value: T[K]) => setDraft((current) => (current ? { ...current, [key]: value } : current));

    return { draft, setDraft, update, dirty, reset: () => setDraft(base) };
}
