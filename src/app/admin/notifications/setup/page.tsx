import type { ReactNode } from "react";
import { ExternalLink, Mail, Send } from "lucide-react";
import { AdminPage } from "@/components/admin/kit";
import { Alert, ButtonLink, Card } from "@/components/ui";

const STEPS: { title: string; body: ReactNode; action?: ReactNode }[] = [
    {
        title: "اعمل حساب على Resend",
        body: (
            <>
                اعمل حساب على <bdi dir="ltr">resend.com</bdi> بنفس الإيميل اللي عايز الإشعارات توصله. ده بيخلّيك تبعت من غير ما تعمل أي إعداد
                للدومين.
            </>
        ),
        action: (
            <ButtonLink href="https://resend.com" external variant="secondary" size="sm">
                <ExternalLink />
                فتح Resend
            </ButtonLink>
        ),
    },
    {
        title: "اعمل مفتاح API",
        body: (
            <>
                من <bdi dir="ltr">API Keys</bdi> اختار <bdi dir="ltr">Create API Key</bdi>، سمّيه مثلًا «GTech site» واختار الصلاحية{" "}
                <bdi dir="ltr">Sending access</bdi>، وانسخ المفتاح (بيبدأ بـ <bdi dir="ltr">re_</bdi> وبيظهر مرة واحدة بس).
            </>
        ),
        action: (
            <ButtonLink href="https://resend.com/api-keys" external variant="secondary" size="sm">
                <ExternalLink />
                API Keys
            </ButtonLink>
        ),
    },
    {
        title: "حط المفتاح والمستلمين هنا",
        body: "حطه في «مزوّد الإيميل والمستلمين»، وحط إيميلك في المستلمين، واحفظ.",
        action: (
            <ButtonLink href="/admin/notifications/provider" variant="secondary" size="sm">
                <Mail />
                مزوّد الإيميل والمستلمين
            </ButtonLink>
        ),
    },
    {
        title: "جرّب",
        body: "افتح «إرسال إيميل تجريبي» وجرّب.",
        action: (
            <ButtonLink href="/admin/notifications/test" variant="secondary" size="sm">
                <Send />
                إرسال إيميل تجريبي
            </ButtonLink>
        ),
    },
    {
        title: "اختياري: الإرسال من إيميل على دومينك",
        body: (
            <>
                عشان تبعت من إيميل على دومينك (زي <bdi dir="ltr">notifications@gamaltech.info</bdi>) أو لأكتر من مستلم: <bdi dir="ltr">Domains</bdi> ←{" "}
                <bdi dir="ltr">Add Domain</bdi> ← ضيف سجلات الـ DNS اللي هيدّيهالك في مكان الدومين ← <bdi dir="ltr">Verify</bdi>، وبعدين غيّر «إيميل
                الإرسال».
            </>
        ),
        action: (
            <ButtonLink href="https://resend.com/domains" external variant="secondary" size="sm">
                <ExternalLink />
                Domains
            </ButtonLink>
        ),
    },
];

/** Step-by-step Resend setup for the owner. Static: reads nothing. */
export default function NotificationsSetupPage() {
    return (
        <AdminPage
            title="طريقة الإعداد"
            description="الإيميلات بتتبعت عن طريق Resend. الإعداد بياخد كام دقيقة ومرة واحدة بس."
            breadcrumbs={[{ label: "الإشعارات", href: "/admin/notifications" }]}
        >
            <div className="space-y-6">
                <Card padding="none">
                    <ol className="divide-y divide-border">
                        {STEPS.map((step, index) => (
                            <li key={step.title} className="flex gap-4 px-4 py-5 sm:px-5">
                                <span
                                    aria-hidden
                                    className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-surface-hover text-sm font-semibold tabular-nums text-foreground"
                                >
                                    {index + 1}
                                </span>
                                <div className="min-w-0 flex-1 space-y-2">
                                    <h2 className="text-sm font-semibold text-foreground">{step.title}</h2>
                                    <p className="text-sm leading-relaxed text-muted">{step.body}</p>
                                    {step.action && <div className="pt-1">{step.action}</div>}
                                </div>
                            </li>
                        ))}
                    </ol>
                </Card>

                <Alert variant="warning">
                    لو المفتاح القديم كان مكشوف (اتبعت في رسالة أو اتحط في مكان عام)، امسحه من Resend واعمل واحد جديد، وحط الجديد هنا.
                </Alert>
            </div>
        </AdminPage>
    );
}
