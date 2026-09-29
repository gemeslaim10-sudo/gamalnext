"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { fetchPricing, savePricing } from "@/lib/pricing/client";
import { refreshSite } from "@/lib/refreshSite";
import { DEFAULT_PRICING } from "@/lib/pricing/defaults";
import type { PricingContent } from "@/lib/pricing/types";
import type { UpdateContent } from "./components/types";

/**
 * - loading: first read in progress
 * - error:   the read failed; the editor stays closed so defaults can never overwrite real content
 * - missing: no document yet; the draft starts from the defaults and Save creates it
 * - ready:   editing saved content
 */
export type PricingEditorStatus = "loading" | "error" | "missing" | "ready";

export function usePricingEditor() {
    const [status, setStatus] = useState<PricingEditorStatus>("loading");
    const [saved, setSaved] = useState<PricingContent | null>(null);
    const [draft, setDraft] = useState<PricingContent | null>(null);
    const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
    const [saving, setSaving] = useState(false);
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        let cancelled = false;
        fetchPricing().then(
            (result) => {
                if (cancelled) return;
                const content = result.exists ? result.content : structuredClone(DEFAULT_PRICING);
                setSaved(content);
                setDraft(content);
                setUpdatedAt(result.exists ? result.updatedAt : null);
                setStatus(result.exists ? "ready" : "missing");
            },
            (error) => {
                if (cancelled) return;
                console.error("Failed to load pricing content:", error);
                setStatus("error");
            }
        );
        return () => {
            cancelled = true;
        };
    }, [attempt]);

    const retry = useCallback(() => {
        setStatus("loading");
        setAttempt((n) => n + 1);
    }, []);

    const update = useCallback<UpdateContent>((fn) => setDraft((current) => (current ? fn(current) : current)), []);

    const dirty = useMemo(
        () => draft !== null && saved !== null && draft !== saved && JSON.stringify(draft) !== JSON.stringify(saved),
        [draft, saved]
    );

    const save = useCallback(async () => {
        if (!draft) return;
        setSaving(true);
        try {
            await savePricing(draft);
            setSaved(draft);
            setUpdatedAt(new Date());
            setStatus("ready");
            await refreshSite();
            toast.success("تم حفظ صفحة الأسعار.");
        } catch (error) {
            console.error("Failed to save pricing content:", error);
            toast.error("تعذر الحفظ. تأكد أنك مسجل الدخول بحساب الأدمن وحاول مرة أخرى.");
        } finally {
            setSaving(false);
        }
    }, [draft]);

    const discard = useCallback(() => {
        if (saved) setDraft(saved);
    }, [saved]);

    // Warn before closing the tab with unsaved edits
    useEffect(() => {
        if (!dirty) return undefined;
        const warn = (event: BeforeUnloadEvent) => event.preventDefault();
        window.addEventListener("beforeunload", warn);
        return () => window.removeEventListener("beforeunload", warn);
    }, [dirty]);

    return { status, draft, update, dirty, saving, save, discard, retry, updatedAt };
}
