"use client";

import { useState } from "react";
import { BookOpen, Send } from "lucide-react";
import { SectionCard } from "@/components/admin/SectionCard";
import { AdminPage } from "@/components/admin/kit";
import { Alert, Button, ButtonLink, Skeleton, Spinner } from "@/components/ui";
import { auth } from "@/lib/firebase-app";
import type { NotificationSettings } from "@/lib/notifications/settings";
import { NOTIFICATIONS_CRUMBS } from "../components/NotificationsEditor";
import { useNotificationsDoc } from "../components/notificationsDoc";

interface TestResponse {
    ok?: boolean;
    error?: string;
    id?: string;
}

type Result = { ok: true; message: string } | { ok: false; message: string; sandbox: boolean };

/** Resend refuses other recipients until a domain is verified; the owner then needs the setup guide. */
const isSandboxError = (message: string) => /testing emails|own email|verify a domain|domain is not verified/i.test(message);

async function sendTest(): Promise<Result> {
    const token = await auth.currentUser?.getIdToken();
    if (!token) return { ok: false, message: "لازم تكون داخل بحساب الأدمن.", sandbox: false };

    const res = await fetch("/api/notifications/test", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: "{}",
    });
    // A missing route or a crash answers with an HTML page, so the body may not be JSON
    const data = (await res.json().catch(() => null)) as TestResponse | null;

    if (res.ok && data?.ok) return { ok: true, message: "اتبعت، بص على الإيميل (وشوف الـ Spam لو مش لاقيه)." };
    if (res.status === 401 || res.status === 403) return { ok: false, message: "لازم تكون داخل بحساب الأدمن.", sandbox: false };
    if (res.status === 404 && !data) return { ok: false, message: "خدمة الإرسال لسه مش جاهزة على السيرفر. جرّب تاني بعد شوية.", sandbox: false };
    if (data?.error) return { ok: false, message: data.error, sandbox: isSandboxError(data.error) };
    return { ok: false, message: `الإيميل ما اتبعتش (رد السيرفر ${res.status}). جرّب تاني بعد شوية.`, sandbox: false };
}

/** Sends one email with the saved settings, so the owner sees the whole setup works. */
export default function NotificationsTestPage() {
    const doc = useNotificationsDoc();
    const [sending, setSending] = useState(false);
    const [result, setResult] = useState<Result | null>(null);

    const send = async () => {
        setSending(true);
        setResult(null);
        try {
            setResult(await sendTest());
        } catch (error) {
            console.error("Sending the test email failed:", error);
            setResult({ ok: false, message: "تعذّر الاتصال بالسيرفر. اتأكد من النت وجرّب تاني.", sandbox: false });
        } finally {
            setSending(false);
        }
    };

    return (
        <AdminPage
            title="إرسال إيميل تجريبي"
            description="بيبعت إيميل واحد بالإعدادات المحفوظة، حتى لو الإشعارات مقفولة، عشان تتأكد إن كله شغال."
            breadcrumbs={NOTIFICATIONS_CRUMBS}
        >
            <div className="space-y-6">
                <SectionCard title="هيتبعت إزاي">
                    <SavedSetup settings={doc.data} loading={doc.loading} failed={doc.status === "error" && !doc.data} />
                </SectionCard>

                <div className="space-y-4">
                    <Button onClick={() => void send()} disabled={sending} className="w-full sm:w-auto">
                        {sending ? <Spinner className="size-4 text-primary-foreground" /> : <Send />}
                        {sending ? "بيتبعت…" : "ابعت إيميل تجريبي"}
                    </Button>

                    {result && (
                        <Alert variant={result.ok ? "success" : "danger"} className="space-y-3">
                            <p dir="auto" className="break-words">
                                {result.message}
                            </p>
                            {!result.ok && result.sandbox && (
                                <p>
                                    ده لأن إيميل الإرسال لسه <bdi dir="ltr">onboarding@resend.dev</bdi>: يا تبعت لإيميل حساب Resend بس، يا تعمل verify لدومينك.
                                </p>
                            )}
                            {!result.ok && (
                                <ButtonLink href="/admin/notifications/setup" variant="secondary" size="sm">
                                    <BookOpen />
                                    طريقة الإعداد
                                </ButtonLink>
                            )}
                        </Alert>
                    )}
                </div>
            </div>
        </AdminPage>
    );
}

function SavedSetup({ settings, loading, failed }: { settings: NotificationSettings | null; loading: boolean; failed: boolean }) {
    if (loading) {
        return (
            <div role="status" aria-label="جاري التحميل…" className="space-y-2">
                <Skeleton className="h-4 w-64 max-w-full" />
                <Skeleton className="h-4 w-48 max-w-full" />
            </div>
        );
    }
    if (failed || !settings) {
        return <p className="text-sm text-muted">مقدرناش نقرا الإعدادات دلوقتي، بس التجربة شغالة عادي.</p>;
    }

    const sender = settings.fromName.trim() ? `${settings.fromName.trim()} <${settings.fromEmail}>` : settings.fromEmail;
    return (
        <div className="space-y-3">
            <dl className="grid gap-y-1 text-sm sm:grid-cols-[6rem_1fr] sm:gap-x-4 sm:gap-y-2">
                <dt className="text-xs text-subtle sm:pt-0.5">لـ</dt>
                <dd className="mb-2 min-w-0 break-words text-foreground sm:mb-0">
                    {settings.recipients.length > 0 ? <bdi dir="ltr">{settings.recipients.join(", ")}</bdi> : <span className="text-subtle">مفيش مستلمين</span>}
                </dd>
                <dt className="text-xs text-subtle sm:pt-0.5">من</dt>
                <dd className="mb-2 min-w-0 break-words text-foreground sm:mb-0">
                    <bdi dir="ltr">{sender}</bdi>
                </dd>
                <dt className="text-xs text-subtle sm:pt-0.5">المفتاح</dt>
                <dd className="min-w-0 text-foreground">
                    {settings.apiKeyHint ? (
                        <>
                            محفوظ <bdi dir="ltr">{settings.apiKeyHint}</bdi>
                        </>
                    ) : (
                        <span className="text-subtle">مفيش مفتاح محفوظ</span>
                    )}
                </dd>
            </dl>
            {(!settings.apiKeyHint || settings.recipients.length === 0) && (
                <Alert variant="warning" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span>التجربة محتاجة مفتاح API ومستلم واحد على الأقل محفوظين.</span>
                    <ButtonLink href="/admin/notifications/provider" variant="secondary" size="sm" className="shrink-0">
                        مزوّد الإيميل والمستلمين
                    </ButtonLink>
                </Alert>
            )}
        </div>
    );
}
