"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { BookOpen, KeyRound, Plus, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { SectionCard } from "@/components/admin/SectionCard";
import type { AdminDoc } from "@/components/admin/kit";
import { Alert, Button, ButtonLink, Field, Input, Label, Switch } from "@/components/ui";
import { loadFirestore } from "@/lib/firebase-app";
import { NOTIFICATIONS_SECRET_DOC, isEmail, keyHint, type NotificationSettings } from "@/lib/notifications/settings";
import { NotificationsEditor, useNotificationsPart } from "../components/NotificationsEditor";

/** What happens to the saved API key on "Save". */
type KeyChange = { mode: "keep" } | { mode: "replace"; value: string } | { mode: "clear" };

interface ProviderDraft {
    enabled: boolean;
    recipients: string[];
    fromName: string;
    fromEmail: string;
    key: KeyChange;
}

const pick = (settings: NotificationSettings): ProviderDraft => ({
    enabled: settings.enabled,
    recipients: settings.recipients,
    fromName: settings.fromName,
    fromEmail: settings.fromEmail,
    key: { mode: "keep" },
});

async function write(draft: ProviderDraft, doc: AdminDoc<NotificationSettings>) {
    let apiKeyHint: string | undefined;
    if (draft.key.mode !== "keep") {
        // The key goes to its own admin-only document, which the dashboard never reads back
        const key = draft.key.mode === "replace" ? draft.key.value.trim() : "";
        const { db, doc: docRef, setDoc } = await loadFirestore();
        await setDoc(docRef(db, NOTIFICATIONS_SECRET_DOC.collection, NOTIFICATIONS_SECRET_DOC.id), { resendApiKey: key }, { merge: true });
        apiKeyHint = keyHint(key);
    }
    await doc.save(
        {
            enabled: draft.enabled,
            provider: "resend",
            recipients: draft.recipients,
            fromName: draft.fromName.trim(),
            fromEmail: draft.fromEmail.trim(),
            ...(apiKeyHint !== undefined ? { apiKeyHint } : {}),
        },
        { refresh: false }
    );
}

/** The master switch, who gets the emails, the sender, and the Resend API key (write-only). */
export default function NotificationsProviderEditor() {
    const part = useNotificationsPart(pick, write);
    const savedHint = part.doc.data?.apiKeyHint ?? "";
    const switchId = useId();
    const fromNameId = useId();
    const fromEmailId = useId();
    const keyId = useId();
    const [newRecipient, setNewRecipient] = useState("");

    const draft = part.draft;
    const fromEmailInvalid = draft !== null && !isEmail(draft.fromEmail);
    const keyEmpty = draft?.key.mode === "replace" && !draft.key.value.trim();

    const addRecipient = (recipients: string[]) => {
        const email = newRecipient.trim();
        if (!email) return;
        if (!isEmail(email)) {
            toast.error("الإيميل ده مش مكتوب صح.");
            return;
        }
        if (recipients.some((item) => item.toLowerCase() === email.toLowerCase())) {
            toast.error("الإيميل ده موجود في القايمة.");
            return;
        }
        part.set({ recipients: [...recipients, email] });
        setNewRecipient("");
    };

    return (
        <NotificationsEditor
            title="مزوّد الإيميل والمستلمين"
            description="الإيميلات بتتبعت عن طريق Resend. حط المفتاح والمستلمين هنا، وبعدين جرّب من «إرسال إيميل تجريبي»."
            part={part}
            saveDisabled={fromEmailInvalid || keyEmpty}
            actions={
                <ButtonLink href="/admin/notifications/setup" variant="secondary" size="sm">
                    <BookOpen />
                    طريقة الإعداد
                </ButtonLink>
            }
        >
            {({ enabled, recipients, fromName, fromEmail, key }) => {
                const willHaveKey = key.mode === "replace" ? key.value.trim() !== "" : key.mode === "keep" && savedHint !== "";
                const missing = [!willHaveKey && "مفتاح API", recipients.length === 0 && "مستلم واحد على الأقل"].filter(Boolean);
                const onRecipientKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
                    if (event.key === "Enter") {
                        event.preventDefault();
                        addRecipient(recipients);
                    }
                };

                return (
                    <>
                        <SectionCard title="التشغيل">
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <Label htmlFor={switchId} className="cursor-pointer">
                                        الإشعارات شغالة
                                    </Label>
                                    <p className="mt-1 text-xs leading-relaxed text-subtle">
                                        المفتاح الرئيسي: وهو مقفول مفيش أي إيميل بيتبعت، حتى لو الأحداث شغالة. الإيميل التجريبي بيشتغل في الحالتين.
                                    </p>
                                </div>
                                <Switch id={switchId} checked={enabled} onCheckedChange={(next) => part.set({ enabled: next })} />
                            </div>
                            {enabled && missing.length > 0 && (
                                <Alert variant="warning" className="mt-4">
                                    الإشعارات مش هتتبعت لحد ما تضيف {missing.join(" و")}.
                                </Alert>
                            )}
                        </SectionCard>

                        <SectionCard title="المستلمين" description="الإيميلات اللي هتوصلها الإشعارات.">
                            {recipients.length > 0 ? (
                                <ul className="divide-y divide-border rounded-control border border-border">
                                    {recipients.map((email) => (
                                        <li key={email} className="flex items-center gap-2 py-1 ps-3 pe-1">
                                            <bdi dir="ltr" className="min-w-0 flex-1 truncate text-sm text-foreground">
                                                {email}
                                            </bdi>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => part.set({ recipients: recipients.filter((item) => item !== email) })}
                                                aria-label={`شيل ${email}`}
                                                title="شيل"
                                            >
                                                <X />
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="rounded-control border border-border px-4 py-5 text-center text-sm text-subtle">مفيش مستلمين لسه.</p>
                            )}
                            <div className="mt-3 flex gap-2">
                                <Input
                                    type="email"
                                    inputMode="email"
                                    dir="ltr"
                                    value={newRecipient}
                                    onChange={(e) => setNewRecipient(e.target.value)}
                                    onKeyDown={onRecipientKeyDown}
                                    placeholder="you@example.com"
                                    aria-label="إيميل مستلم جديد"
                                    className="min-w-0"
                                />
                                <Button variant="secondary" onClick={() => addRecipient(recipients)} disabled={!newRecipient.trim()} className="shrink-0">
                                    <Plus />
                                    إضافة
                                </Button>
                            </div>
                            {newRecipient.trim() && <p className="mt-2 text-xs text-warning">لسه ما اتضافش — دوس «إضافة» الأول.</p>}
                            <p className="mt-2 text-xs leading-relaxed text-subtle">
                                طول ما إيميل الإرسال <bdi dir="ltr">onboarding@resend.dev</bdi>، الإشعارات بتوصل بس للإيميل اللي عملت بيه حساب
                                Resend.
                            </p>
                        </SectionCard>

                        <SectionCard title="المرسِل" description="اللي بيظهر في صندوق الوارد.">
                            <div className="space-y-4">
                                <Field label="اسم المرسِل" htmlFor={fromNameId}>
                                    <Input id={fromNameId} dir="auto" value={fromName} onChange={(e) => part.set({ fromName: e.target.value })} placeholder="GTech" />
                                </Field>
                                <Field
                                    label="إيميل الإرسال"
                                    htmlFor={fromEmailId}
                                    error={fromEmailInvalid ? "الإيميل مش مكتوب صح." : undefined}
                                    hint={
                                        <>
                                            <bdi dir="ltr">onboarding@resend.dev</bdi> شغال من غير أي إعداد، بس بيبعت للإيميل اللي عملت بيه حساب Resend
                                            بس. عشان تبعت لأي حد، اعمل verify لدومينك في Resend واستخدم إيميل عليه، زي{" "}
                                            <bdi dir="ltr">notifications@gamaltech.info</bdi>.
                                        </>
                                    }
                                >
                                    <Input
                                        id={fromEmailId}
                                        type="email"
                                        inputMode="email"
                                        dir="ltr"
                                        value={fromEmail}
                                        onChange={(e) => part.set({ fromEmail: e.target.value })}
                                        aria-invalid={fromEmailInvalid || undefined}
                                    />
                                </Field>
                            </div>
                        </SectionCard>

                        <SectionCard title="مفتاح Resend API" description="بيتحفظ في مكان مقفول ومش بيظهر هنا تاني؛ هتشوف آخر 4 حروف منه بس.">
                            {key.mode === "clear" ? (
                                <div className="flex flex-col gap-3 rounded-control border border-danger/30 bg-danger/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-sm text-danger">المفتاح هيتمسح لما تضغط «حفظ»، والإيميلات هتقف.</p>
                                    <Button variant="secondary" size="sm" onClick={() => part.set({ key: { mode: "keep" } })} className="shrink-0">
                                        إلغاء
                                    </Button>
                                </div>
                            ) : key.mode === "keep" && savedHint ? (
                                <div className="flex flex-col gap-3 rounded-control border border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="flex items-center gap-2 text-sm text-foreground">
                                        <KeyRound aria-hidden className="size-4 shrink-0 text-muted" />
                                        مفتاح محفوظ <bdi dir="ltr" className="tabular-nums">{savedHint}</bdi>
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <Button variant="secondary" size="sm" onClick={() => part.set({ key: { mode: "replace", value: "" } })}>
                                            تغيير المفتاح
                                        </Button>
                                        <Button variant="danger" size="sm" onClick={() => part.set({ key: { mode: "clear" } })}>
                                            مسح المفتاح
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <Field
                                    label={savedHint ? "المفتاح الجديد" : "المفتاح"}
                                    htmlFor={keyId}
                                    error={keyEmpty && savedHint ? "اكتب المفتاح الجديد، أو دوس «إلغاء»." : undefined}
                                    hint={
                                        key.mode === "replace" && key.value.trim() && !key.value.trim().startsWith("re_")
                                            ? "مفاتيح Resend بتبدأ بـ re_ — اتأكد إنك نسخته كله."
                                            : "من resend.com ← API Keys. بيبدأ بـ re_."
                                    }
                                >
                                    <div className="flex gap-2">
                                        <Input
                                            id={keyId}
                                            type="password"
                                            autoComplete="new-password"
                                            spellCheck={false}
                                            dir="ltr"
                                            placeholder="re_…"
                                            className="min-w-0"
                                            value={key.mode === "replace" ? key.value : ""}
                                            onChange={(e) =>
                                                // An emptied field on a fresh setup means "no change", so nothing is marked unsaved
                                                part.set({ key: e.target.value || savedHint ? { mode: "replace", value: e.target.value } : { mode: "keep" } })
                                            }
                                        />
                                        {savedHint && (
                                            <Button variant="secondary" onClick={() => part.set({ key: { mode: "keep" } })} className="shrink-0">
                                                إلغاء
                                            </Button>
                                        )}
                                    </div>
                                </Field>
                            )}
                        </SectionCard>
                    </>
                );
            }}
        </NotificationsEditor>
    );
}
