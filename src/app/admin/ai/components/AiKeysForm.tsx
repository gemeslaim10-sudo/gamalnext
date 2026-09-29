import { Field, Input } from "@/components/ui";
import { SectionCard } from "@/components/admin/SectionCard";
import type { KeyField } from "../useAiSettings";
import type { SectionProps } from "./types";

const KEYS: { field: KeyField; label: string; placeholder: string }[] = [
    { field: "geminiKey", label: "Google Gemini (أساسي)", placeholder: "AIzaSy..." },
    { field: "groqKey", label: "Groq (احتياطي)", placeholder: "gsk_..." },
    { field: "openRouterKey", label: "OpenRouter (احتياطي)", placeholder: "sk-or-v1-..." },
    { field: "openaiKey", label: "OpenAI (احتياطي)", placeholder: "sk-..." },
];

export function AiKeysForm({ formData, update }: SectionProps) {
    return (
        <SectionCard
            title="مفاتيح API"
            description="المفتاح المحفوظ هنا بيتقدّم على المفتاح الموجود في ملف البيئة (.env.local). سيب الخانة فاضية لاستخدام مفتاح البيئة."
        >
            <div className="grid gap-4 md:grid-cols-2">
                {KEYS.map(({ field, label, placeholder }) => (
                    <Field key={field} label={label} htmlFor={`ai-${field}`}>
                        <Input
                            id={`ai-${field}`}
                            type="password"
                            dir="ltr"
                            autoComplete="off"
                            value={formData[field]}
                            onChange={(e) => update(field, e.target.value)}
                            className="font-mono"
                            placeholder={placeholder}
                        />
                    </Field>
                ))}
            </div>
        </SectionCard>
    );
}
