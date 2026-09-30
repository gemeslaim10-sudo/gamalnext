"use client";

import { useState } from "react";
import Link from "next/link";
import { Field, Input, Select } from "@/components/ui";
import { GEMINI_FALLBACK_MODELS, GEMINI_MODEL_OPTIONS } from "@/lib/ai/assistant/shared";
import { useAiEditor } from "../useAiEditor";
import { AiEditorPage, FieldGroup } from "../components/AiEditorPage";

const FIELDS = ["modelName"] as const;
const CUSTOM = "__custom__";

export default function AiModelPage() {
    const editor = useAiEditor(FIELDS);
    // "Custom model id…" picked while the current value is still one of the listed models
    const [customMode, setCustomMode] = useState(false);
    const modelName = editor.draft?.modelName.trim() ?? "";

    return (
        <AiEditorPage
            title="الموديل"
            description="موديل Gemini اللي بيرد على الزوار."
            editor={editor}
            invalid={!modelName}
            onSave={() => editor.save({ modelName })}
            onReset={() => setCustomMode(false)}
        >
            {(draft) => {
                const custom = customMode || !GEMINI_MODEL_OPTIONS.some((option) => option.id === draft.modelName);
                const chain = GEMINI_FALLBACK_MODELS.filter((model) => model !== modelName);
                return (
                    <FieldGroup>
                        <Field label="الموديل الأساسي" htmlFor="ai-model">
                            <Select
                                id="ai-model"
                                dir="ltr"
                                value={custom ? CUSTOM : draft.modelName}
                                onChange={(e) => {
                                    if (e.target.value === CUSTOM) {
                                        setCustomMode(true);
                                        return;
                                    }
                                    setCustomMode(false);
                                    editor.update("modelName", e.target.value);
                                }}
                            >
                                {GEMINI_MODEL_OPTIONS.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.label}
                                    </option>
                                ))}
                                <option value={CUSTOM}>موديل تاني (اكتب اسمه)…</option>
                            </Select>
                        </Field>

                        {custom && (
                            <Field
                                label="اسم الموديل"
                                htmlFor="ai-model-custom"
                                error={modelName ? undefined : "اكتب اسم الموديل."}
                                hint="أي موديل Gemini متاح على المفتاح، زي gemini-3.6-flash."
                            >
                                <Input
                                    id="ai-model-custom"
                                    dir="ltr"
                                    className="font-mono"
                                    placeholder="gemini-…"
                                    value={draft.modelName}
                                    onChange={(e) => editor.update("modelName", e.target.value.trim())}
                                />
                            </Field>
                        )}

                        <p className="text-sm leading-relaxed text-muted">
                            لو الموديل ده مشغول أو حصته المجانية خلصت، المساعد بيجرّب لوحده بالترتيب:{" "}
                            <span dir="ltr" className="font-mono text-xs text-foreground">
                                {chain.join(" → ")}
                            </span>
                            ، وبعدها Groq وOpenRouter لو{" "}
                            <Link href="/admin/ai/keys" className="underline underline-offset-4 transition-colors hover:text-foreground">
                                مفاتيحهم
                            </Link>{" "}
                            موجودة. الزائر مش بيحس بحاجة.
                        </p>
                    </FieldGroup>
                );
            }}
        </AiEditorPage>
    );
}
