"use client";

import { Bot } from "lucide-react";
import { Field, Input } from "@/components/ui";
import { toPublicConfig } from "@/lib/ai/assistant/shared";
import { useAiEditor } from "../useAiEditor";
import { AiEditorPage, FieldGroup } from "../components/AiEditorPage";

const FIELDS = ["assistantName", "brandName", "ownerNameArabic", "assistantSubtitle", "inputPlaceholder"] as const;

export default function AiIdentityPage() {
    const editor = useAiEditor(FIELDS);
    const { update } = editor;

    return (
        <AiEditorPage
            title="الهوية"
            description="اسم المساعد والنصوص اللي الزائر بيشوفها في نافذة الشات."
            editor={editor}
            onSave={(draft) =>
                editor.save({
                    assistantName: draft.assistantName.trim(),
                    brandName: draft.brandName.trim(),
                    ownerNameArabic: draft.ownerNameArabic.trim(),
                    assistantSubtitle: draft.assistantSubtitle.trim(),
                    inputPlaceholder: draft.inputPlaceholder.trim(),
                })
            }
        >
            {(draft) => {
                // What the chat widget will show, with the same fallbacks for blank fields
                const preview = editor.doc.data ? toPublicConfig({ ...editor.doc.data, ...draft }) : null;
                return (
                    <>
                        <FieldGroup>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field label="اسم المساعد" htmlFor="ai-assistant-name" hint="بيظهر فوق نافذة الشات.">
                                    <Input
                                        id="ai-assistant-name"
                                        dir="auto"
                                        value={draft.assistantName}
                                        onChange={(e) => update("assistantName", e.target.value)}
                                    />
                                </Field>
                                <Field label="اسم البراند" htmlFor="ai-brand-name" hint="اسم الشركة اللي المساعد بيتكلم باسمها.">
                                    <Input id="ai-brand-name" dir="auto" value={draft.brandName} onChange={(e) => update("brandName", e.target.value)} />
                                </Field>
                            </div>
                            <Field
                                label="اسمك بالعربي"
                                htmlFor="ai-owner-name-ar"
                                hint="المساعد بيكتب اسمك كده بالظبط في الردود العربي (عشان ميكتبهوش «غمال»)."
                            >
                                <Input
                                    id="ai-owner-name-ar"
                                    dir="rtl"
                                    value={draft.ownerNameArabic}
                                    onChange={(e) => update("ownerNameArabic", e.target.value)}
                                    className="sm:max-w-xs"
                                />
                            </Field>
                            <Field label="السطر الفرعي" htmlFor="ai-assistant-subtitle" hint="تحت الاسم. سيبه فاضي عشان يختفي.">
                                <Input
                                    id="ai-assistant-subtitle"
                                    dir="auto"
                                    value={draft.assistantSubtitle}
                                    onChange={(e) => update("assistantSubtitle", e.target.value)}
                                />
                            </Field>
                            <Field label="نص خانة الكتابة" htmlFor="ai-input-placeholder" hint="الكلام الباهت جوه خانة كتابة الرسالة.">
                                <Input
                                    id="ai-input-placeholder"
                                    dir="auto"
                                    value={draft.inputPlaceholder}
                                    onChange={(e) => update("inputPlaceholder", e.target.value)}
                                />
                            </Field>
                        </FieldGroup>

                        {preview && (
                            <div className="space-y-2">
                                <p className="text-xs text-subtle">معاينة</p>
                                <div className="max-w-sm overflow-hidden rounded-card border border-border bg-surface">
                                    <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface-hover text-muted">
                                            <Bot className="size-4" />
                                        </span>
                                        <span className="min-w-0">
                                            <span dir="auto" className="block truncate text-sm font-semibold text-foreground">
                                                {preview.assistantName}
                                            </span>
                                            {preview.subtitle && (
                                                <span dir="auto" className="block truncate text-xs text-subtle">
                                                    {preview.subtitle}
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                    <div className="p-3">
                                        <div dir="auto" className="flex h-10 items-center truncate rounded-control border border-border px-3 text-sm text-subtle">
                                            {preview.placeholder}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                );
            }}
        </AiEditorPage>
    );
}
