"use client";

import { Mail, Send, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";

interface NotificationHeaderProps {
    testing: boolean;
    saving: boolean;
    onTestEmail: () => void;
}

export function NotificationHeader({ testing, saving, onTestEmail }: NotificationHeaderProps) {
    return (
        <div className="space-y-6">
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
                        onClick={onTestEmail}
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

            <div className="bg-slate-900/60 border border-blue-500/20 p-5 rounded-2xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <strong className="text-white block mb-1">كيف تحصل على خدمة مجانية 100% لإرسال الرسائل إلى الجيميل؟</strong>
                    1. قم بإنشاء حساب مجاني في خدمة <a href="https://resend.com" target="_blank" rel="noreferrer" className="text-blue-400 underline">Resend.com</a>.<br />
                    2. احصل على الـ <strong>API Key</strong> الخاص بك وضعه في الحقل أدناه.<br />
                    3. اكتب بريدك الجيميل في خانة "البريد المستلم" واضغط <strong>اختبار الإرسال</strong> لتبدأ باستلام التنبيهات فوراً!
                </div>
            </div>
        </div>
    );
}
