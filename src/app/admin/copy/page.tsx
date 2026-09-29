"use client";

import { useEffect, useMemo, useState } from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { RotateCcw, Save, Search } from "lucide-react";
import { db } from "@/lib/firebase";
import { COPY_DEFAULTS, COPY_SECTIONS, mergeCopy } from "@/config/copy";
import type { CopyValues } from "@/lib/copy/types";
import { refreshSite } from "@/lib/refreshSite";
import { SectionCard } from "@/components/admin/SectionCard";
import { Alert, Button, EmptyState, Field, Input, LoadingBlock, PageHeader, Textarea } from "@/components/ui";

/** Every fixed text on the public site, grouped by page. Saved to site_content/copy. */
export default function SiteCopyPage() {
    const [values, setValues] = useState<CopyValues>(COPY_DEFAULTS);
    const [saved, setSaved] = useState<CopyValues>(COPY_DEFAULTS);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [saving, setSaving] = useState(false);
    const [query, setQuery] = useState("");

    useEffect(() => {
        getDoc(doc(db, "site_content", "copy"))
            .then((snap) => {
                const merged = mergeCopy(snap.exists() ? (snap.data().values as Record<string, unknown>) : null);
                setValues(merged);
                setSaved(merged);
            })
            .catch((error) => {
                console.error(error);
                setLoadError(true);
            })
            .finally(() => setLoading(false));
    }, []);

    const dirty = useMemo(() => Object.keys(values).some((key) => values[key] !== saved[key]), [values, saved]);

    const sections = useMemo(() => {
        const q = query.trim().toLowerCase();
        return COPY_SECTIONS.map((section) => ({
            ...section,
            fields: section.fields.filter((field) => {
                if (!q) return true;
                const key = `${section.id}.${field.key}`;
                return [field.label, key, values[key] ?? ""].some((text) => text.toLowerCase().includes(q));
            }),
        })).filter((section) => section.fields.length > 0);
    }, [query, values]);

    const save = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, "site_content", "copy"), { values, updatedAt: serverTimestamp() }, { merge: true });
            setSaved(values);
            await refreshSite();
            toast.success("تم حفظ النصوص وتحديث الموقع");
        } catch (error) {
            console.error(error);
            toast.error("تعذّر الحفظ، حاول مرة تانية");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-content">
            <PageHeader
                title="نصوص الموقع"
                description="كل النصوص الثابتة في الموقع: العناوين والأزرار والرسائل وعناوين جوجل. التعديل هنا بيظهر في الموقع كله."
                actions={
                    <Button onClick={save} disabled={!dirty || saving || loading}>
                        <Save />
                        {saving ? "جارِ الحفظ…" : "حفظ التغييرات"}
                    </Button>
                }
            />

            {loadError && (
                <Alert variant="danger" className="mb-6">
                    تعذّر تحميل النصوص المحفوظة، والمعروض دلوقتي هو النصوص الافتراضية. الحفظ هيكتب فوق المحفوظ.
                </Alert>
            )}

            {loading ? (
                <LoadingBlock />
            ) : (
                <div className="space-y-6">
                    <div className="relative">
                        <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="ابحث في النصوص…"
                            aria-label="Search texts"
                            className="pl-9"
                        />
                    </div>

                    {sections.length === 0 && <EmptyState title="مفيش نصوص مطابقة للبحث" />}

                    {sections.map((section) => (
                        <SectionCard key={section.id} title={section.title} description={section.description}>
                            <div className="space-y-5">
                                {section.fields.map((field) => {
                                    const key = `${section.id}.${field.key}`;
                                    const id = `copy-${key}`;
                                    const changedFromDefault = values[key] !== COPY_DEFAULTS[key];
                                    const Control = field.type === "textarea" ? Textarea : Input;
                                    return (
                                        <Field key={key} label={field.label} htmlFor={id} hint={field.hint}>
                                            <div className="flex items-start gap-2">
                                                <Control
                                                    id={id}
                                                    dir="auto"
                                                    value={values[key] ?? ""}
                                                    onChange={(e) => setValues((prev) => ({ ...prev, [key]: e.target.value }))}
                                                    rows={field.type === "textarea" ? 3 : undefined}
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    disabled={!changedFromDefault}
                                                    onClick={() => setValues((prev) => ({ ...prev, [key]: COPY_DEFAULTS[key] }))}
                                                    aria-label="Reset to default"
                                                    title={`الافتراضي: ${COPY_DEFAULTS[key]}`}
                                                >
                                                    <RotateCcw />
                                                </Button>
                                            </div>
                                        </Field>
                                    );
                                })}
                            </div>
                        </SectionCard>
                    ))}

                    <div className="flex justify-end">
                        <Button onClick={save} disabled={!dirty || saving} className="w-full sm:w-auto">
                            <Save />
                            {saving ? "جارِ الحفظ…" : "حفظ التغييرات"}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
