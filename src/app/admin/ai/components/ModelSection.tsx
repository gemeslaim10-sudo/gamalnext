import { useState } from "react";
import { Field, Input, Select } from "@/components/ui";
import { SectionCard } from "@/components/admin/SectionCard";
import { GEMINI_FALLBACK_MODELS, GEMINI_MODEL_OPTIONS } from "@/lib/ai/assistant/shared";
import type { SectionProps } from "./types";

const CUSTOM = "__custom__";

export function ModelSection({ formData, update }: SectionProps) {
    const isListed = GEMINI_MODEL_OPTIONS.some((m) => m.id === formData.modelName);
    const [custom, setCustom] = useState(!isListed);
    const chain = GEMINI_FALLBACK_MODELS.filter((m) => m !== formData.modelName);

    return (
        <SectionCard title="الموديل" description="موديل Gemini اللي بيرد على الزوار.">
            <div className="space-y-4">
                <Field label="الموديل الأساسي" htmlFor="ai-model">
                    <Select
                        id="ai-model"
                        dir="ltr"
                        value={custom ? CUSTOM : formData.modelName}
                        onChange={(e) => {
                            if (e.target.value === CUSTOM) {
                                setCustom(true);
                                return;
                            }
                            setCustom(false);
                            update("modelName", e.target.value);
                        }}
                    >
                        {GEMINI_MODEL_OPTIONS.map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.label}
                            </option>
                        ))}
                        <option value={CUSTOM}>Custom model id…</option>
                    </Select>
                </Field>

                {custom && (
                    <Field label="اسم الموديل" htmlFor="ai-model-custom" hint="أي موديل Gemini متاح على المفتاح، مثل gemini-3.6-flash.">
                        <Input
                            id="ai-model-custom"
                            dir="ltr"
                            className="font-mono"
                            placeholder="gemini-…"
                            value={formData.modelName}
                            onChange={(e) => update("modelName", e.target.value.trim())}
                        />
                    </Field>
                )}

                <p className="text-sm leading-relaxed text-muted">
                    لو الموديل ده مشغول أو خلصت حصته المجانية، المساعد بيجرّب تلقائيًا بالترتيب:{" "}
                    <span dir="ltr" className="font-mono text-xs text-foreground">
                        {chain.join(" → ")}
                    </span>
                    ، وبعدها Groq و OpenRouter لو مفاتيحهم موجودة. الزائر مش بيحس بأي حاجة.
                </p>
            </div>
        </SectionCard>
    );
}
