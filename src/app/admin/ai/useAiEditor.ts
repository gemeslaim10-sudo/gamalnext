"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useAdminDoc, useDraft, useUnsavedChangesGuard, type AdminDoc } from "@/components/admin/kit";
import { AI_SETTINGS_PATH, normalizeAiSettings, type AiSettings } from "./settings";

export interface AiEditor<K extends keyof AiSettings> {
    doc: AdminDoc<AiSettings>;
    /** The fields of this section as the form shows them (null until loaded) */
    draft: Pick<AiSettings, K> | null;
    update: <F extends K>(key: F, value: AiSettings[F]) => void;
    dirty: boolean;
    reset: () => void;
    saving: boolean;
    /** Writes only these fields (merged), then refreshes the assistant and the chat widget */
    save: (patch: Pick<AiSettings, K>) => Promise<boolean>;
}

/**
 * One section of the assistant settings (identity, instructions, welcome, model, keys). All
 * sections share one cached read of `settings/ai`; each edits and saves only its own `fields`.
 * Pass `fields` as a module-level constant.
 */
export function useAiEditor<K extends keyof AiSettings>(fields: readonly K[]): AiEditor<K> {
    const doc = useAdminDoc(AI_SETTINGS_PATH, normalizeAiSettings);
    const saved = useMemo(() => {
        if (!doc.data) return null;
        const data = doc.data;
        return Object.fromEntries(fields.map((field) => [field, data[field]])) as Pick<AiSettings, K>;
    }, [doc.data, fields]);
    const { draft, update, dirty, reset } = useDraft(saved);
    const [saving, setSaving] = useState(false);
    useUnsavedChangesGuard(dirty);

    const save = async (patch: Pick<AiSettings, K>) => {
        setSaving(true);
        try {
            // The assistant's settings and the chat widget's texts are cached with the "ai" tag
            await doc.save({ ...patch }, { refresh: ["ai"] });
            toast.success("اتحفظ — المساعد بيستخدم التعديل من دلوقتي");
            return true;
        } catch (error) {
            console.error("Saving settings/ai failed:", error);
            toast.error("ماقدرناش نحفظ. اتأكد من الاتصال وجرّب تاني.");
            return false;
        } finally {
            setSaving(false);
        }
    };

    return { doc, draft, update, dirty, reset, saving, save };
}
