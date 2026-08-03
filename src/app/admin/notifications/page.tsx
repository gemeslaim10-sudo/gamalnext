"use client";

import React, { useEffect, useState } from "react";
import { getEmailConfig, saveEmailConfig, EmailNotificationConfig } from "@/lib/email/config";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

import { NotificationHeader } from "./components/NotificationHeader";
import { NotificationStatusSection } from "./components/NotificationStatusSection";
import { NotificationCredentialsSection } from "./components/NotificationCredentialsSection";
import { NotificationTriggersSection } from "./components/NotificationTriggersSection";

export default function EmailNotificationsSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);

    const [config, setConfig] = useState<EmailNotificationConfig>({
        enabled: true,
        provider: "resend",
        recipientEmail: "",
        resendApiKey: "",
        resendFromEmail: "Gamal Tech Notifications <onboarding@resend.dev>",
        notifyOnNewLead: true,
        notifyOnNewPost: true,
        notifyOnNewReview: true,
    });

    useEffect(() => {
        async function load() {
            try {
                const data = await getEmailConfig();
                setConfig(data);
            } catch (e) {
                console.error(e);
                toast.error("حدث خطأ أثناء تحميل إعدادات الإشعارات");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const success = await saveEmailConfig(config);
            if (success) {
                toast.success("تم حفظ إعدادات إشعارات البريد الإلكتروني بنجاح");
            } else {
                toast.error("فشل حفظ الإعدادات في قاعدة البيانات");
            }
        } catch {
            toast.error("حدث خطأ في الاتصال");
        } finally {
            setSaving(false);
        }
    };

    const handleTestEmail = async () => {
        if (!config.recipientEmail) {
            toast.error("يرجى كتابة البريد الإلكتروني المستلم (الجيميل) أولاً");
            return;
        }

        if (config.provider === "resend" && !config.resendApiKey) {
            toast.error("يرجى كتابة Resend API Key لاختبار الإرسال");
            return;
        }

        setTesting(true);
        toast.loading("جاري إرسال إيميل تجريبي...", { id: "test-email" });

        try {
            const res = await fetch("/api/admin/test-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ config }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                toast.success(`تم إرسال الإيميل التجريبي بنجاح إلى ${config.recipientEmail}! تحقق من صندوق الوارد أو الـ Spam.`, { id: "test-email", duration: 6000 });
            } else {
                toast.error(`فشل الاختبار: ${data.error || "تأكد من صحة الـ API Key وإعدادات الإرسال"}`, { id: "test-email", duration: 6000 });
            }
        } catch {
            toast.error("حدث خطأ أثناء محاولة الاتصال بالسيرفر", { id: "test-email" });
        } finally {
            setTesting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] text-white">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            <NotificationHeader testing={testing} saving={saving} onTestEmail={handleTestEmail} />

            <form id="email-config-form" onSubmit={handleSave} className="space-y-6">
                <NotificationStatusSection config={config} setConfig={setConfig} />
                <NotificationCredentialsSection config={config} setConfig={setConfig} />
                <NotificationTriggersSection config={config} setConfig={setConfig} />
            </form>
        </div>
    );
}
