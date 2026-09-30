"use client";

import Link from "next/link";
import { Field, Select, Textarea } from "@/components/ui";
import { REPLY_LANGUAGE_OPTIONS, type ReplyLanguage } from "@/lib/ai/assistant/shared";
import { useAiEditor } from "../useAiEditor";
import { AiEditorPage, FieldGroup } from "../components/AiEditorPage";

const FIELDS = ["persona", "goals", "tone", "replyLanguage", "rules", "unsureBehavior", "leadGuidance"] as const;

// Grows with its text up to a limit, then scrolls inside, so long instructions don't stretch the page
const GROWING = "field-sizing-content max-h-72";

export default function AiInstructionsPage() {
    const editor = useAiEditor(FIELDS);
    const { update } = editor;

    return (
        <AiEditorPage
            title="الشخصية والتعليمات"
            description="المساعد بيقرا التعليمات دي مع كل رسالة، ومعاها قاعدة المعرفة وبيانات الموقع (الأسعار والمشاريع والتواصل). اكتب بالعربي أو بالإنجليزي."
            editor={editor}
            onSave={(draft) =>
                editor.save({
                    persona: draft.persona.trim(),
                    goals: draft.goals.trim(),
                    tone: draft.tone.trim(),
                    replyLanguage: draft.replyLanguage,
                    rules: draft.rules.trim(),
                    unsureBehavior: draft.unsureBehavior.trim(),
                    leadGuidance: draft.leadGuidance.trim(),
                })
            }
        >
            {(draft) => {
                const ruleCount = draft.rules.split("\n").filter((rule) => rule.trim()).length;
                return (
                    <>
                        <FieldGroup title="مين المساعد">
                            <Field label="الدور والشخصية" htmlFor="ai-persona" hint="مين المساعد وبيقدّم نفسه إزاي.">
                                <Textarea
                                    id="ai-persona"
                                    dir="auto"
                                    rows={4}
                                    className={GROWING}
                                    value={draft.persona}
                                    onChange={(e) => update("persona", e.target.value)}
                                />
                            </Field>
                            <Field label="الأهداف" htmlFor="ai-goals" hint="عايز المساعد يوصل لإيه في المحادثة.">
                                <Textarea
                                    id="ai-goals"
                                    dir="auto"
                                    rows={3}
                                    className={GROWING}
                                    value={draft.goals}
                                    onChange={(e) => update("goals", e.target.value)}
                                />
                            </Field>
                            <Field label="النبرة والأسلوب" htmlFor="ai-tone" hint="اللهجة، طول الردود، الإيموجي…">
                                <Textarea
                                    id="ai-tone"
                                    dir="auto"
                                    rows={2}
                                    className={GROWING}
                                    value={draft.tone}
                                    onChange={(e) => update("tone", e.target.value)}
                                />
                            </Field>
                            <Field label="لغة الرد" htmlFor="ai-reply-language" hint="الاختيار ده بيتقدّم على أي كلام عن اللغة في التعليمات.">
                                <Select
                                    id="ai-reply-language"
                                    value={draft.replyLanguage}
                                    onChange={(e) => update("replyLanguage", e.target.value as ReplyLanguage)}
                                >
                                    {REPLY_LANGUAGE_OPTIONS.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.label}
                                        </option>
                                    ))}
                                </Select>
                            </Field>
                        </FieldGroup>

                        <FieldGroup title="بيتصرف إزاي">
                            <Field
                                label="القواعد"
                                htmlFor="ai-rules"
                                hint={`قاعدة في كل سطر${ruleCount ? ` — ${ruleCount} ${ruleCount === 1 ? "قاعدة" : "قواعد"}` : ""}.`}
                            >
                                <Textarea
                                    id="ai-rules"
                                    dir="auto"
                                    rows={5}
                                    className={GROWING}
                                    value={draft.rules}
                                    onChange={(e) => update("rules", e.target.value)}
                                />
                            </Field>
                            <Field label="لو مش عارف الإجابة" htmlFor="ai-unsure" hint="يعمل إيه لما السؤال مش موجود في المعلومات اللي عنده.">
                                <Textarea
                                    id="ai-unsure"
                                    dir="auto"
                                    rows={2}
                                    className={GROWING}
                                    value={draft.unsureBehavior}
                                    onChange={(e) => update("unsureBehavior", e.target.value)}
                                />
                            </Field>
                            <Field
                                label="طلب بيانات التواصل"
                                htmlFor="ai-lead-guidance"
                                hint={
                                    <>
                                        إمتى وإزاي يطلب الاسم ورقم الموبايل. البيانات بتتسجل لوحدها في{" "}
                                        <Link href="/admin/leads" className="underline underline-offset-4 transition-colors hover:text-foreground">
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
                                    className={GROWING}
                                    value={draft.leadGuidance}
                                    onChange={(e) => update("leadGuidance", e.target.value)}
                                />
                            </Field>
                        </FieldGroup>
                    </>
                );
            }}
        </AiEditorPage>
    );
}
