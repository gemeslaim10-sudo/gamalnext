"use client";

import { Field, Textarea } from "@/components/ui";
import ChatMessage from "@/components/chat/ChatMessage";
import { fillWelcome } from "@/lib/ai/assistant/shared";
import { useAiEditor } from "../useAiEditor";
import { AiEditorPage, FieldGroup } from "../components/AiEditorPage";

const FIELDS = ["welcomeMessage"] as const;

export default function AiWelcomePage() {
    const editor = useAiEditor(FIELDS);

    return (
        <AiEditorPage
            title="رسالة الترحيب"
            description="أول رسالة الزائر بيشوفها لما يفتح الشات."
            editor={editor}
            onSave={(draft) => editor.save({ welcomeMessage: draft.welcomeMessage.trim() })}
        >
            {(draft) => {
                const previews = [
                    { label: "زائر", text: fillWelcome(draft.welcomeMessage, null) },
                    { label: "عضو مسجّل (مثال: أحمد)", text: fillWelcome(draft.welcomeMessage, "أحمد") },
                ];
                // The two only differ when the message uses {name}
                const shown = previews[0].text === previews[1].text ? previews.slice(0, 1) : previews;
                return (
                    <>
                        <FieldGroup>
                            <Field
                                label="الرسالة"
                                htmlFor="ai-welcome"
                                hint="اكتب {name} في أي مكان يتبدّل باسم الزائر لو عامل تسجيل دخول، ويختفي لو مش عامل. سيبها فاضية عشان تلغي رسالة الترحيب."
                            >
                                <Textarea
                                    id="ai-welcome"
                                    dir="auto"
                                    rows={4}
                                    className="field-sizing-content max-h-72"
                                    value={draft.welcomeMessage}
                                    onChange={(e) => editor.update("welcomeMessage", e.target.value)}
                                />
                            </Field>
                        </FieldGroup>

                        {draft.welcomeMessage.trim() ? (
                            <div className={shown.length > 1 ? "grid gap-3 sm:grid-cols-2" : undefined}>
                                {shown.map((preview) => (
                                    <div key={preview.label} className="min-w-0 space-y-2 rounded-card border border-border p-4">
                                        <p className="text-xs text-subtle">{shown.length > 1 ? `معاينة — ${preview.label}` : "معاينة"}</p>
                                        <ChatMessage role="model" text={preview.text} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-subtle">مفيش رسالة ترحيب — الشات هيفتح فاضي لحد ما الزائر يكتب.</p>
                        )}
                    </>
                );
            }}
        </AiEditorPage>
    );
}
