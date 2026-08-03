"use client";

import { Key } from "lucide-react";
import { EmailNotificationConfig } from "@/lib/email/config";

interface NotificationCredentialsSectionProps {
    config: EmailNotificationConfig;
    setConfig: React.Dispatch<React.SetStateAction<EmailNotificationConfig>>;
}

export function NotificationCredentialsSection({ config, setConfig }: NotificationCredentialsSectionProps) {
    return (
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
    );
}
