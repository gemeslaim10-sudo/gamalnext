"use client";

import { useEffect, useState } from "react";
import { getEmailConfig, saveEmailConfig, EmailNotificationConfig } from "@/lib/email/config";
import { Mail, Send, CheckCircle2, AlertCircle, Loader2, Key, ShieldCheck, Bell } from "lucide-react";
import { toast } from "react-hot-toast";

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
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                        <Mail className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">إشعارات الجيميل والبريد الإلكتروني</h1>
                        <p className="text-slate-400 text-sm mt-0.5">
                            تفعيل وتلقي الإشعارات الفورية لكل العمليات المهمة على بريدك الشخصي
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleTestEmail}
                        disabled={testing}
                        className="flex items-center gap-2 px-5 py-2.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-semibold text-sm rounded-xl transition-all disabled:opacity-50"
                    >
                        {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        اختبار الإرسال (Test Email)
                    </button>

                    <button
                        type="submit"
                        form="email-config-form"
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        حفظ التغييرات
                    </button>
                </div>
            </div>

            {/* Quick guide alert */}
            <div className="bg-slate-900/60 border border-blue-500/20 p-5 rounded-2xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <strong className="text-white block mb-1">كيف تحصل على خدمة مجانية 100% لإرسال الرسائل إلى الجيميل؟</strong>
                    1. قم بإنشاء حساب مجاني في خدمة <a href="https://resend.com" target="_blank" rel="noreferrer" className="text-blue-400 underline">Resend.com</a>.<br />
                    2. احصل على الـ <strong>API Key</strong> الخاص بك وضعه في الحقل أدناه.<br />
                    3. اكتب بريدك الجيميل في خانة "البريد المستلم" واضغط <strong>اختبار الإرسال</strong> لتبدأ باستلام التنبيهات فوراً!
                </div>
            </div>

            <form id="email-config-form" onSubmit={handleSave} className="space-y-6">
                {/* General Status */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Bell className="w-5 h-5 text-blue-400" />
                        الحالة العامة للإشعارات
                    </h2>

                    <div className="flex items-center justify-between p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                        <div>
                            <span className="text-white font-medium block">تفعيل إرسال إشعارات البريد</span>
                            <span className="text-slate-400 text-xs">عند الإيقاف لن يتم إرسال أي إيميلات عند حدوث أي عملية بالمنصة</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={config.enabled}
                                onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            البريد الإلكتروني المستلم (حساب الجيميل الخاص بك) <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                            <input
                                type="email"
                                required
                                value={config.recipientEmail}
                                onChange={(e) => setConfig({ ...config, recipientEmail: e.target.value })}
                                placeholder="example@gmail.com"
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* API & Provider Credentials */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Key className="w-5 h-5 text-purple-400" />
                        إعدادات خدمة الإرسال (API Credentials)
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">مزود الخدمة (Service Provider)</label>
                            <select
                                value={config.provider}
                                onChange={(e) => setConfig({ ...config, provider: e.target.value as "resend" | "smtp" })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            >
                                <option value="resend">Resend API (مُوصى به - مجاني ومرتفع السرعة)</option>
                            </select>
                        </div>

                        {config.provider === "resend" && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Resend API Key <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={config.resendApiKey || ""}
                                        onChange={(e) => setConfig({ ...config, resendApiKey: e.target.value })}
                                        placeholder="re_123456789..."
                                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono"
                                    />
                                    <span className="text-slate-500 text-xs mt-1 block">
                                        يمكنك الحصول عليه مجاناً من <a href="https://resend.com/api-keys" target="_blank" rel="noreferrer" className="text-blue-400 underline">لوحة تحكم Resend</a>
                                    </span>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">اسم عنوان المرسل (Sender Email)</label>
                                    <input
                                        type="text"
                                        value={config.resendFromEmail || ""}
                                        onChange={(e) => setConfig({ ...config, resendFromEmail: e.target.value })}
                                        placeholder="Gamal Tech Notifications <onboarding@resend.dev>"
                                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    />
                                    <span className="text-slate-500 text-xs mt-1 block">
                                        يمكنك استخدام <code className="text-blue-400">onboarding@resend.dev</code> بدون إعداد دُومين خاص.
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Events to Trigger Email */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-emerald-400" />
                        الأحداث المحددة لتنبيه الجيميل (Notification Triggers)
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className="flex items-center gap-3 p-4 bg-slate-950/60 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition-all">
                            <input
                                type="checkbox"
                                checked={config.notifyOnNewLead ?? true}
                                onChange={(e) => setConfig({ ...config, notifyOnNewLead: e.target.checked })}
                                className="w-4 h-4 text-blue-600 rounded bg-slate-900 border-slate-700 focus:ring-blue-500"
                            />
                            <div>
                                <span className="text-white text-sm font-medium block">عميل محتمل جديد (Lead)</span>
                                <span className="text-slate-400 text-xs">عند إرسال النموذج أو التواصل</span>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 p-4 bg-slate-950/60 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition-all">
                            <input
                                type="checkbox"
                                checked={config.notifyOnNewPost ?? true}
                                onChange={(e) => setConfig({ ...config, notifyOnNewPost: e.target.checked })}
                                className="w-4 h-4 text-blue-600 rounded bg-slate-900 border-slate-700 focus:ring-blue-500"
                            />
                            <div>
                                <span className="text-white text-sm font-medium block">منشور يتطلب المراجعة</span>
                                <span className="text-slate-400 text-xs">عند نشر مشاركة جديدة</span>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 p-4 bg-slate-950/60 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition-all">
                            <input
                                type="checkbox"
                                checked={config.notifyOnNewReview ?? true}
                                onChange={(e) => setConfig({ ...config, notifyOnNewReview: e.target.checked })}
                                className="w-4 h-4 text-blue-600 rounded bg-slate-900 border-slate-700 focus:ring-blue-500"
                            />
                            <div>
                                <span className="text-white text-sm font-medium block">تقييم/رأي جديد (Review)</span>
                                <span className="text-slate-400 text-xs">عند إضافة رأي عميل</span>
                            </div>
                        </label>
                    </div>
                </div>
            </form>
        </div>
    );
}
