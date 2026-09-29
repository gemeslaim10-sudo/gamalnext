import { useEffect, useMemo, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "@/lib/firebase";
import { AI_SETTINGS_DOC, PROFILE_FIELDS, resolveProfile, type AssistantProfile } from "@/lib/ai/assistant/shared";

export const KEY_FIELDS = ["geminiKey", "groqKey", "openRouterKey", "openaiKey"] as const;
export type KeyField = (typeof KEY_FIELDS)[number];

export type AiSettingsData = AssistantProfile & Record<KeyField, string>;

function fromFirestore(data: Record<string, unknown> | undefined): AiSettingsData {
    const keys = Object.fromEntries(KEY_FIELDS.map((k) => [k, typeof data?.[k] === "string" ? (data[k] as string) : ""])) as Record<KeyField, string>;
    // resolveProfile maps the old systemRole / prompt / stylePrompt texts into the new fields
    return { ...resolveProfile(data), ...keys };
}

/**
 * Loads and saves `settings/ai`. Only the fields on this page are written (merge), so older
 * fields such as `prompt` or `stylePrompt` stay untouched in the document.
 */
export function useAiSettings() {
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState<AiSettingsData | null>(null);
    const [formData, setFormData] = useState<AiSettingsData>(() => fromFirestore(undefined));

    useEffect(() => {
        let cancelled = false;
        getDoc(doc(db, AI_SETTINGS_DOC.collection, AI_SETTINGS_DOC.id))
            .then((snap) => {
                if (cancelled) return;
                const data = fromFirestore(snap.exists() ? snap.data() : undefined);
                setFormData(data);
                setSaved(data);
            })
            .catch((error) => {
                console.error("Error fetching AI settings:", error);
                if (!cancelled) setLoadError(true);
            })
            .finally(() => !cancelled && setLoading(false));
        return () => {
            cancelled = true;
        };
    }, []);

    const dirty = useMemo(() => !!saved && JSON.stringify(saved) !== JSON.stringify(formData), [saved, formData]);

    const update = <K extends keyof AiSettingsData>(key: K, value: AiSettingsData[K]) => setFormData((prev) => ({ ...prev, [key]: value }));

    const handleSave = async () => {
        if (loadError) {
            toast.error("تعذّر تحميل الإعدادات، أعد تحميل الصفحة قبل الحفظ");
            return;
        }
        const clean: AiSettingsData = { ...formData, modelName: formData.modelName.trim() || saved?.modelName || "" };
        if (!clean.modelName) {
            toast.error("اختر موديل أو اكتب اسمه");
            return;
        }
        setSaving(true);
        try {
            const payload: Record<string, unknown> = { updatedAt: new Date().toISOString() };
            for (const field of PROFILE_FIELDS) payload[field] = clean[field];
            for (const field of KEY_FIELDS) payload[field] = clean[field].trim();
            await setDoc(doc(db, AI_SETTINGS_DOC.collection, AI_SETTINGS_DOC.id), payload, { merge: true });
            setFormData(clean);
            setSaved(clean);
            toast.success("تم الحفظ. المساعد هيستخدم الإعدادات الجديدة خلال دقيقة");
        } catch (error) {
            console.error("Error saving AI settings:", error);
            toast.error("حدث خطأ أثناء الحفظ");
        } finally {
            setSaving(false);
        }
    };

    return { loading, loadError, saving, dirty, formData, update, setFormData, handleSave };
}
