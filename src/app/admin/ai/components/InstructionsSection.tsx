import Link from "next/link";
import { Field, Select, Textarea } from "@/components/ui";
import { SectionCard } from "@/components/admin/SectionCard";
import { REPLY_LANGUAGE_OPTIONS, type ReplyLanguage } from "@/lib/ai/assistant/shared";
import type { SectionProps } from "./types";

const FIELDS = [
    {
        key: "persona",
        label: "الدور والشخصية",
        hint: "مين المساعد وبيقدّم نفسه إزاي.",
        rows: 3,
    },
    {
        key: "goals",
        label: "الأهداف",
        hint: "عايز المساعد يوصل لإيه في المحادثة.",
        rows: 3,
    },
    {
        key: "tone",
        label: "النبرة والأسلوب",
        hint: "اللهجة، طول الردود، الإيموجي…",
        rows: 2,
    },
] as const;

export function InstructionsSection({ formData, update }: SectionProps) {
    const ruleCount = formData.rules.split("\n").filter((r) => r.trim()).length;

    return (
        <SectionCard
            title="التعليمات"
            description="المساعد بيقرأ التعليمات دي مع كل رسالة، ومعاها بطاقات المعرفة وبيانات الموقع (الأسعار، المشاريع، التواصل). اكتب بالعربي أو بالإنجليزي."
        >
            <div className="space-y-4">
                {FIELDS.map(({ key, label, hint, rows }) => (
                    <Field key={key} label={label} htmlFor={`ai-${key}`} hint={hint}>
                        <Textarea id={`ai-${key}`} dir="auto" rows={rows} value={formData[key]} onChange={(e) => update(key, e.target.value)} />
                    </Field>
                ))}

                <Field label="لغة الرد" htmlFor="ai-reply-language" hint="الإعداد ده بيتقدّم على أي كلام عن اللغة في التعليمات.">
                    <Select
                        id="ai-reply-language"
                        value={formData.replyLanguage}
                        onChange={(e) => update("replyLanguage", e.target.value as ReplyLanguage)}
                    >
                        {REPLY_LANGUAGE_OPTIONS.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.label}
                            </option>
                        ))}
                    </Select>
                </Field>

                <Field
                    label="القواعد"
                    htmlFor="ai-rules"
                    hint={`قاعدة في كل سطر${ruleCount ? ` — ${ruleCount} ${ruleCount === 1 ? "قاعدة" : "قواعد"}` : ""}.`}
                >
                    <Textarea id="ai-rules" dir="auto" rows={5} value={formData.rules} onChange={(e) => update("rules", e.target.value)} />
                </Field>

                <Field label="لو المساعد مش عارف الإجابة" htmlFor="ai-unsure" hint="يعمل إيه لما السؤال مش موجود في المعلومات اللي عنده.">
                    <Textarea
                        id="ai-unsure"
                        dir="auto"
                        rows={2}
                        value={formData.unsureBehavior}
                        onChange={(e) => update("unsureBehavior", e.target.value)}
                    />
                </Field>

                <Field
                    label="طلب بيانات التواصل"
                    htmlFor="ai-lead-guidance"
                    hint={
                        <>
                            امتى وإزاي يطلب الاسم ورقم الموبايل. البيانات بتتسجل تلقائيًا في{" "}
                            <Link href="/admin/leads" className="underline underline-offset-4 hover:text-foreground">
                                العملاء المحتملين
                            </Link>
                            .
                        </>
                    }
                >
                    <Textarea
                        id="ai-lead-guidance"
                        dir="auto"
                        rows={3}
                        value={formData.leadGuidance}
                        onChange={(e) => update("leadGuidance", e.target.value)}
                    />
                </Field>
            </div>
        </SectionCard>
    );
}
