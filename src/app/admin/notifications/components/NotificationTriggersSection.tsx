"use client";

import { AlertCircle } from "lucide-react";
import { EmailNotificationConfig } from "@/lib/email/config";

interface NotificationTriggersSectionProps {
    config: EmailNotificationConfig;
    setConfig: React.Dispatch<React.SetStateAction<EmailNotificationConfig>>;
}

export function NotificationTriggersSection({ config, setConfig }: NotificationTriggersSectionProps) {
    return (
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
    );
}
