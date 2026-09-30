"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useAdminDoc, useDraft, useUnsavedChangesGuard, type AdminDoc } from "@/components/admin/kit";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { SERVICES_PATH, normalizeServices } from "@/lib/services/content";
import type { ServiceItem, ServiceLang, ServicesContent } from "@/lib/services/types";

// Every services editor edits one part of the same document (site_content/services). The document
// is read once per visit and shared; each editor saves the part it owns.

export interface ServicesPart<P> {
    doc: AdminDoc<ServicesContent>;
    content: ServicesContent | null;
    /** null while loading, or when the part doesn't exist (e.g. an unknown service) */
    draft: P | null;
    change: (fn: (draft: P) => P) => void;
    dirty: boolean;
    reset: () => void;
    saving: boolean;
    save: () => Promise<void>;
}

/**
 * `pick` takes the part out of the document (null = not found) and `apply` turns the edited part
 * back into the fields to save (e.g. `{ items }`). Keep both stable (module level or memoized).
 */
export function useServicesPart<P>(
    pick: (content: ServicesContent) => P | null,
    apply: (content: ServicesContent, part: P) => Record<string, unknown>,
    /** Runs after a successful save, with what was saved (e.g. to follow a renamed service) */
    onSaved?: (part: P) => void
): ServicesPart<P> {
    const doc = useAdminDoc(SERVICES_PATH, normalizeServices);
    const saved = useMemo(() => (doc.data ? pick(doc.data) : null), [doc.data, pick]);
    const { draft, setDraft, dirty, reset } = useDraft(saved);
    const [saving, setSaving] = useState(false);
    useUnsavedChangesGuard(dirty);

    const change = useCallback((fn: (current: P) => P) => setDraft((current) => (current ? fn(current) : current)), [setDraft]);

    const save = async () => {
        if (!draft || !doc.data) return;
        setSaving(true);
        try {
            // The service pages, the home page links, the sitemap and llms.txt all read this document
            await doc.save(apply(doc.data, draft), { refresh: [CACHE_TAGS.services] });
            toast.success("اتحفظ، وصفحات الخدمات اتحدّثت.");
            onSaved?.(draft);
        } catch (error) {
            console.error("Saving the services failed:", error);
            toast.error("ما اتحفظش. اتأكد إنك داخل بحساب الأدمن وجرّب تاني.");
        } finally {
            setSaving(false);
        }
    };

    return { doc, content: doc.data, draft, change, dirty, reset, saving, save };
}

/** The document's items with one service replaced (matched by its slug before the edit). */
export function replaceService(content: ServicesContent, slug: string, next: ServiceItem) {
    return content.items.map((item) => (item.slug === slug ? next : item));
}

export const LANG_LABEL: Record<ServiceLang, string> = { en: "بالإنجليزي", ar: "بالعربي" };

export const SERVICES_CRUMBS = [{ label: "صفحات الخدمات", href: "/admin/services" }];
