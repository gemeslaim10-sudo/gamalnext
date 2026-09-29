import { Field, Input } from "@/components/ui";
import { SectionCard } from "@/components/admin/SectionCard";
import type { SectionProps } from "./types";

export function IdentitySection({ formData, update }: SectionProps) {
    return (
        <SectionCard title="هوية المساعد" description="الاسم والنصوص اللي بتظهر للزائر في نافذة المحادثة.">
            <div className="grid gap-4 sm:grid-cols-2">
                <Field label="اسم المساعد" htmlFor="ai-assistant-name" hint="يظهر أعلى نافذة المحادثة.">
                    <Input
                        id="ai-assistant-name"
                        dir="auto"
                        value={formData.assistantName}
                        onChange={(e) => update("assistantName", e.target.value)}
                    />
                </Field>
                <Field label="اسم البراند" htmlFor="ai-brand-name" hint="اسم الشركة اللي المساعد بيتكلم باسمها.">
                    <Input id="ai-brand-name" dir="auto" value={formData.brandName} onChange={(e) => update("brandName", e.target.value)} />
                </Field>
                <Field label="السطر الفرعي" htmlFor="ai-assistant-subtitle" hint="تحت الاسم. اتركه فارغًا لإخفائه." className="sm:col-span-2">
                    <Input
                        id="ai-assistant-subtitle"
                        dir="auto"
                        value={formData.assistantSubtitle}
                        onChange={(e) => update("assistantSubtitle", e.target.value)}
                    />
                </Field>
                <Field label="نص خانة الكتابة" htmlFor="ai-input-placeholder" hint="النص الباهت داخل خانة كتابة الرسالة." className="sm:col-span-2">
                    <Input
                        id="ai-input-placeholder"
                        dir="auto"
                        value={formData.inputPlaceholder}
                        onChange={(e) => update("inputPlaceholder", e.target.value)}
                    />
                </Field>
            </div>
        </SectionCard>
    );
}
