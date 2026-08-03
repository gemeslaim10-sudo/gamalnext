import { NextResponse } from "next/server";
import { sendEmailNotification } from "@/lib/email/service";
import { EmailNotificationConfig } from "@/lib/email/config";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { config, testEmail } = body as { config: EmailNotificationConfig; testEmail?: string };

        if (!config) {
            return NextResponse.json({ error: "Configuration object is required" }, { status: 400 });
        }

        const targetEmail = testEmail || config.recipientEmail;

        if (!targetEmail) {
            return NextResponse.json({ error: "الرجاء إدخال البريد الإلكتروني المستلم (Gmail)" }, { status: 400 });
        }

        const testConfig: EmailNotificationConfig = {
            ...config,
            recipientEmail: targetEmail,
            enabled: true,
        };

        const result = await sendEmailNotification(
            {
                subject: "اختبار نظام إشعارات البريد الإلكتروني",
                title: "نجح اختبار الإشعارات! 🎉",
                message: "هذا إيميل تجريبي لتأكيد وصول الإشعارات بنجاح إلى حساب الجيميل الخاص بك.",
                details: {
                    "وقت الاختبار": new Date().toLocaleString("ar-EG"),
                    "مزود الخدمة": config.provider.toUpperCase(),
                    "حالة الاتصال": "ناجح ومتصل 100%",
                },
            },
            testConfig
        );

        if (!result.success) {
            return NextResponse.json({ error: result.error || result.reason || "فشل إرسال البريد التجريبي" }, { status: 500 });
        }

        return NextResponse.json({ success: true, id: result.id });
    } catch (err: unknown) {
        console.error("Test Email Error:", err);
        const message = err instanceof Error ? err.message : "خطأ غير متوقع أثناء إرسال التجربة";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
