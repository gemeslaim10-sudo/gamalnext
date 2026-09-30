"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Badge, Button, Field, Input } from "@/components/ui";
import { KEY_FIELDS, type KeyField } from "../settings";
import { useAiEditor } from "../useAiEditor";
import { AiEditorPage, FieldGroup } from "../components/AiEditorPage";

const KEYS: { field: KeyField; label: string; placeholder: string }[] = [
    { field: "geminiKey", label: "Google Gemini (الأساسي)", placeholder: "AIzaSy…" },
    { field: "groqKey", label: "Groq (احتياطي)", placeholder: "gsk_…" },
    { field: "openRouterKey", label: "OpenRouter (احتياطي)", placeholder: "sk-or-v1-…" },
    { field: "openaiKey", label: "OpenAI (احتياطي)", placeholder: "sk-…" },
];

export default function AiKeysPage() {
    const editor = useAiEditor(KEY_FIELDS);
    const [visible, setVisible] = useState<KeyField | null>(null);

    return (
        <AiEditorPage
            title="مفاتيح الـ API"
            description="المفتاح اللي بتحفظه هنا بيتقدّم على المفتاح اللي في ملف البيئة (.env.local). سيب الخانة فاضية عشان يستخدم مفتاح البيئة."
            editor={editor}
            onSave={(draft) =>
                editor.save({
                    geminiKey: draft.geminiKey.trim(),
                    groqKey: draft.groqKey.trim(),
                    openRouterKey: draft.openRouterKey.trim(),
                    openaiKey: draft.openaiKey.trim(),
                })
            }
        >
            {(draft) => (
                <FieldGroup>
                    {KEYS.map(({ field, label, placeholder }) => {
                        const stored = Boolean(editor.doc.data?.[field].trim());
                        const shown = visible === field;
                        return (
                            <Field
                                key={field}
                                label={
                                    <span className="flex flex-wrap items-center gap-2">
                                        {label}
                                        <Badge variant={stored ? "success" : "outline"}>{stored ? "محفوظ هنا" : "من ملف البيئة"}</Badge>
                                    </span>
                                }
                                htmlFor={`ai-${field}`}
                            >
                                <div className="flex gap-2">
                                    <Input
                                        id={`ai-${field}`}
                                        type={shown ? "text" : "password"}
                                        dir="ltr"
                                        autoComplete="off"
                                        spellCheck={false}
                                        value={draft[field]}
                                        onChange={(e) => editor.update(field, e.target.value)}
                                        className="min-w-0 flex-1 font-mono"
                                        placeholder={placeholder}
                                    />
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        onClick={() => setVisible(shown ? null : field)}
                                        aria-label={shown ? "إخفاء المفتاح" : "إظهار المفتاح"}
                                        aria-pressed={shown}
                                        title={shown ? "إخفاء" : "إظهار"}
                                    >
                                        {shown ? <EyeOff /> : <Eye />}
                                    </Button>
                                </div>
                            </Field>
                        );
                    })}
                </FieldGroup>
            )}
        </AiEditorPage>
    );
}
