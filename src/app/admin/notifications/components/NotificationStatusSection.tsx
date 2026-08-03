"use client";

import { Bell, Mail } from "lucide-react";
import { EmailNotificationConfig } from "@/lib/email/config";

interface NotificationStatusSectionProps {
    config: EmailNotificationConfig;
    setConfig: React.Dispatch<React.SetStateAction<EmailNotificationConfig>>;
}

export function NotificationStatusSection({ config, setConfig }: NotificationStatusSectionProps) {
    return (
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
    );
}
