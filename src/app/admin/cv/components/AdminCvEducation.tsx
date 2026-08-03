"use client";

import { GraduationCap, Plus, Trash2, ArrowUp, ArrowDown, Copy } from "lucide-react";
import { CVData } from "@/app/tools/utils/ai-cv-builder/components/CvTemplate";

interface AdminCvEducationProps {
    cvData: CVData;
    setCvData: React.Dispatch<React.SetStateAction<CVData>>;
}

const MAX_EDUCATION = 3;

export function AdminCvEducation({ cvData, setCvData }: AdminCvEducationProps) {
    const updateEducation = (index: number, field: "degree" | "institution" | "date", value: string) => {
        const newEdu = [...cvData.education];
        if (!newEdu[index]) return;
        newEdu[index][field] = value;
        setCvData({ ...cvData, education: newEdu });
    };

    const addEducation = () => {
        if (cvData.education.length >= MAX_EDUCATION) return;
        setCvData({
            ...cvData,
            education: [...cvData.education, { degree: "المؤهل الدراسي", institution: "الجامعة/الأكاديمية", date: "2024" }]
        });
    };

    const removeEducation = (index: number) => {
        const newEdu = [...cvData.education];
        newEdu.splice(index, 1);
        setCvData({ ...cvData, education: newEdu });
    };

    const moveEducation = (index: number, direction: "up" | "down") => {
        const newEdu = [...cvData.education];
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newEdu.length) return;
        const [movedItem] = newEdu.splice(index, 1);
        if (movedItem) {
            newEdu.splice(targetIndex, 0, movedItem);
            setCvData({ ...cvData, education: newEdu });
        }
    };

    const duplicateEducation = (index: number) => {
        if (cvData.education.length >= MAX_EDUCATION) return;
        const newEdu = [...cvData.education];
        const itemToDuplicate = newEdu[index];
        if (!itemToDuplicate) return;
        const newItem = JSON.parse(JSON.stringify(itemToDuplicate));
        newEdu.splice(index + 1, 0, newItem);
        setCvData({ ...cvData, education: newEdu });
    };

    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-purple-400" />
                        التعليم والشهادات (Education)
                    </h2>
                    <span className="text-xs text-slate-400">الحد الأقصى {MAX_EDUCATION} مؤهلات</span>
                </div>
                <button
                    type="button"
                    onClick={addEducation}
                    disabled={cvData.education.length >= MAX_EDUCATION}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-semibold rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <Plus className="w-4 h-4" /> إضافة مؤهل ({cvData.education.length}/{MAX_EDUCATION})
                </button>
            </div>

            <div className="space-y-3">
                {cvData.education.map((edu, idx) => (
                    <div key={idx} className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3 relative">
                        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                            <span className="text-xs font-bold text-slate-400">مؤهل #{idx + 1}</span>
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => moveEducation(idx, "up")}
                                    disabled={idx === 0}
                                    className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed rounded transition-all"
                                    title="تحريك لأعلى"
                                >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => moveEducation(idx, "down")}
                                    disabled={idx === cvData.education.length - 1}
                                    className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed rounded transition-all"
                                    title="تحريك لأسفل"
                                >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => duplicateEducation(idx)}
                                    disabled={cvData.education.length >= MAX_EDUCATION}
                                    className="p-1.5 text-slate-400 hover:text-blue-400 disabled:opacity-30 disabled:cursor-not-allowed rounded transition-all"
                                    title="تكرار"
                                >
                                    <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => removeEducation(idx)}
                                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
                                    title="حذف هذا العنصر"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <input
                                type="text"
                                maxLength={60}
                                placeholder="الدرجة/المؤهل"
                                value={edu.degree}
                                onChange={(e) => updateEducation(idx, "degree", e.target.value)}
                                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-purple-500"
                            />
                            <input
                                type="text"
                                maxLength={60}
                                placeholder="الكلية/الجامعة/المؤسسة"
                                value={edu.institution}
                                onChange={(e) => updateEducation(idx, "institution", e.target.value)}
                                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-purple-500"
                            />
                            <input
                                type="text"
                                maxLength={25}
                                placeholder="التاريخ/السنة"
                                value={edu.date}
                                onChange={(e) => updateEducation(idx, "date", e.target.value)}
                                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-purple-500"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
