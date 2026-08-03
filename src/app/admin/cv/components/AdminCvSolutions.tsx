"use client";

import { useState } from "react";
import { FileText, Plus, Trash2, SlidersHorizontal, FileCode2 } from "lucide-react";
import { CVData } from "@/app/tools/utils/ai-cv-builder/components/CvTemplate";

interface AdminCvSolutionsProps {
    cvData: CVData;
    setCvData: React.Dispatch<React.SetStateAction<CVData>>;
}

const MAX_SOLUTIONS = 6;

export function AdminCvSolutions({ cvData, setCvData }: AdminCvSolutionsProps) {
    const [mode, setMode] = useState<"interactive" | "bulk">("interactive");
    const integrations = cvData.integrations || [];

    const addIntegration = () => {
        if (integrations.length >= MAX_SOLUTIONS) return;
        setCvData({
            ...cvData,
            integrations: [...integrations, "حل جديد: تفاصيل الحل والتكاملات الخاصة بك..."]
        });
    };

    const updateIntegration = (index: number, val: string) => {
        const newIntegrations = [...integrations];
        newIntegrations[index] = val;
        setCvData({ ...cvData, integrations: newIntegrations });
    };

    const removeIntegration = (index: number) => {
        const newIntegrations = [...integrations];
        newIntegrations.splice(index, 1);
        setCvData({ ...cvData, integrations: newIntegrations });
    };

    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-400" />
                        الحلول والتكاملات المتخصصة (Specialized Solutions & Integrations)
                    </h2>
                    <span className="text-xs text-slate-400">الحد الأقصى {MAX_SOLUTIONS} حلول وتكاملات</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setMode(mode === "interactive" ? "bulk" : "interactive")}
                        className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 border border-slate-700 rounded-lg text-xs flex items-center gap-1 transition-all"
                    >
                        {mode === "interactive" ? <FileCode2 className="w-3.5 h-3.5" /> : <SlidersHorizontal className="w-3.5 h-3.5" />}
                        <span>{mode === "interactive" ? "نصي" : "تفاعلي"}</span>
                    </button>
                    <button
                        type="button"
                        onClick={addIntegration}
                        disabled={integrations.length >= MAX_SOLUTIONS}
                        className="flex items-center gap-1 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-semibold rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Plus className="w-4 h-4" /> إضافة حل ({integrations.length}/{MAX_SOLUTIONS})
                    </button>
                </div>
            </div>

            {mode === "interactive" ? (
                <div className="space-y-3">
                    {integrations.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-slate-950/70 p-3 border border-slate-800 rounded-xl">
                            <span className="text-xs font-bold text-indigo-400 mt-2 shrink-0">#{idx + 1}</span>
                            <textarea
                                rows={2}
                                maxLength={140}
                                value={item}
                                onChange={(e) => updateIntegration(idx, e.target.value)}
                                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-sm outline-none focus:border-indigo-500 leading-relaxed"
                            />
                            <button
                                type="button"
                                onClick={() => removeIntegration(idx)}
                                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all shrink-0 mt-1"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">أدخل كل حل أو تكامل في سطر مستقل</label>
                    <textarea
                        rows={6}
                        value={integrations.join("\n")}
                        onChange={(e) =>
                            setCvData({
                                ...cvData,
                                integrations: e.target.value.split("\n").filter(Boolean).slice(0, MAX_SOLUTIONS)
                            })
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white text-sm outline-none leading-relaxed focus:border-indigo-500"
                    />
                </div>
            )}
        </div>
    );
}
