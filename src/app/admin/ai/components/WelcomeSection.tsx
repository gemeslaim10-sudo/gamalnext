import { Field, Textarea } from "@/components/ui";
import { SectionCard } from "@/components/admin/SectionCard";
import ChatMessage from "@/components/chat/ChatMessage";
import { fillWelcome } from "@/lib/ai/assistant/shared";
import type { SectionProps } from "./types";

export function WelcomeSection({ formData, update }: SectionProps) {
    const previews = [
        { label: "زائر", text: fillWelcome(formData.welcomeMessage, null) },
        { label: "مستخدم مسجّل (مثال: أحمد)", text: fillWelcome(formData.welcomeMessage, "أحمد") },
    ];
    const differs = previews[0].text !== previews[1].text;

    return (
        <SectionCard title="رسالة الترحيب" description="أول رسالة يشوفها الزائر لما يفتح المحادثة.">
            <div className="space-y-4">
                <Field
                    label="الرسالة"
                    htmlFor="ai-welcome"
                    hint="اكتب {name} في أي مكان ليتبدل باسم الزائر لو مسجّل دخول، ويختفي لو مش مسجّل. اتركها فارغة لإلغاء رسالة الترحيب."
                >
                    <Textarea
                        id="ai-welcome"
                        dir="auto"
                        rows={4}
                        value={formData.welcomeMessage}
                        onChange={(e) => update("welcomeMessage", e.target.value)}
                    />
                </Field>

                {formData.welcomeMessage.trim() && (
                    <div className={differs ? "grid gap-3 sm:grid-cols-2" : ""}>
                        {(differs ? previews : previews.slice(0, 1)).map((preview) => (
                            <div key={preview.label} className="min-w-0 space-y-2 rounded-control border border-border p-3">
                                <p className="text-xs text-subtle">{differs ? `معاينة — ${preview.label}` : "معاينة"}</p>
                                <ChatMessage role="model" text={preview.text} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </SectionCard>
    );
}
