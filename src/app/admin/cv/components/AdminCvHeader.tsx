"use client";

import { Save, RefreshCw, Loader2, ExternalLink, FileText } from "lucide-react";
import Link from "next/link";

interface AdminCvHeaderProps {
    saving: boolean;
    onResetDefault: () => void;
}

export function AdminCvHeader({ saving, onResetDefault }: AdminCvHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    <FileText className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">إدارة السيرة الذاتية (CV Editor)</h1>
                    <p className="text-slate-400 text-sm mt-0.5">
                        تعديل وإدارة كافة أقسام الـ CV والمهارات والخبرات وحفظها فوراً
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <Link
                    href="/gamal-cv"
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm rounded-xl transition-all"
                >
                    <ExternalLink className="w-4 h-4 text-blue-400" />
                    معاينة الـ CV
                </Link>

                <button
                    type="button"
                    onClick={onResetDefault}
                    className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold text-sm rounded-xl transition-all"
                >
                    <RefreshCw className="w-4 h-4" />
                    الافتراضي
                </button>

                <button
                    type="submit"
                    form="cv-admin-form"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    حفظ السيرة الذاتية
                </button>
            </div>
        </div>
    );
}
