"use client";

import { Briefcase, Plus, Trash2, ArrowUp, ArrowDown, Copy } from "lucide-react";
import { CVData } from "@/app/tools/utils/ai-cv-builder/components/CvTemplate";

interface AdminCvExperienceProps {
    cvData: CVData;
    setCvData: React.Dispatch<React.SetStateAction<CVData>>;
}

const MAX_EXPERIENCES = 5;

export function AdminCvExperience({ cvData, setCvData }: AdminCvExperienceProps) {
    const updateExperience = (index: number, field: "title" | "company" | "date" | "description", value: string) => {
        const newExp = [...cvData.experience];
        if (!newExp[index]) return;
        if (field === "description") {
            const lines = value.split("\n").filter((l) => l.trim() !== "").slice(0, 5); // max 5 bullets
            newExp[index].description = lines;
        } else {
            newExp[index][field] = value;
        }
        setCvData({ ...cvData, experience: newExp });
    };

    const addExperience = () => {
        if (cvData.experience.length >= MAX_EXPERIENCES) return;
        setCvData({
            ...cvData,
            experience: [
                ...cvData.experience,
                { title: "وظيفة جديدة", company: "اسم الشركة", date: "Present", description: ["المهمة أو الإنجاز الرئيسي"] }
            ]
        });
    };

    const removeExperience = (index: number) => {
        const newExp = [...cvData.experience];
        newExp.splice(index, 1);
        setCvData({ ...cvData, experience: newExp });
    };

    const moveExperience = (index: number, direction: "up" | "down") => {
        const newExp = [...cvData.experience];
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newExp.length) return;
        const [movedItem] = newExp.splice(index, 1);
        if (movedItem) {
            newExp.splice(targetIndex, 0, movedItem);
            setCvData({ ...cvData, experience: newExp });
        }
    };

    const duplicateExperience = (index: number) => {
        if (cvData.experience.length >= MAX_EXPERIENCES) return;
        const newExp = [...cvData.experience];
        const itemToDuplicate = newExp[index];
        if (!itemToDuplicate) return;
        const newItem = JSON.parse(JSON.stringify(itemToDuplicate));
        newExp.splice(index + 1, 0, newItem);
        setCvData({ ...cvData, experience: newExp });
    };

    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-emerald-400" />
                        الخبرات العملية (Work Experience)
                    </h2>
                    <span className="text-xs text-slate-400">الحد الأقصى {MAX_EXPERIENCES} خبرات للحفاظ على صفحة A4 واحدة</span>
                </div>
                <button
                    type="button"
                    onClick={addExperience}
                    disabled={cvData.experience.length >= MAX_EXPERIENCES}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <Plus className="w-4 h-4" /> إضافة خبرة ({cvData.experience.length}/{MAX_EXPERIENCES})
                </button>
            </div>

            <div className="space-y-4">
                {cvData.experience.map((exp, idx) => (
                    <div key={idx} className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3 relative group">
                        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                            <span className="text-xs font-bold text-slate-400">خبرة #{idx + 1}</span>
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => moveExperience(idx, "up")}
                                    disabled={idx === 0}
                                    className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed rounded transition-all"
                                    title="تحريك لأعلى"
                                >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => moveExperience(idx, "down")}
                                    disabled={idx === cvData.experience.length - 1}
                                    className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed rounded transition-all"
                                    title="تحريك لأسفل"
                                >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => duplicateExperience(idx)}
                                    disabled={cvData.experience.length >= MAX_EXPERIENCES}
                                    className="p-1.5 text-slate-400 hover:text-blue-400 disabled:opacity-30 disabled:cursor-not-allowed rounded transition-all"
                                    title="تكرار"
                                >
                                    <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => removeExperience(idx)}
                                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
                                    title="حذف هذا العنصر"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">المسمى (Job Title)</label>
                                <input
                                    type="text"
                                    maxLength={60}
                                    value={exp.title}
                                    onChange={(e) => updateExperience(idx, "title", e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">الجهة (Company)</label>
                                <input
                                    type="text"
                                    maxLength={50}
                                    value={exp.company}
                                    onChange={(e) => updateExperience(idx, "company", e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">الفترة الزمنية (Date)</label>
                                <input
                                    type="text"
                                    maxLength={30}
                                    value={exp.date}
                                    onChange={(e) => updateExperience(idx, "date", e.target.value)}
                                    placeholder="2022 - Present"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-emerald-500"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-xs font-medium text-slate-400">المهام والإنجازات (كل سطر نقطة - الأقصى 5 نقاط)</label>
                                <span className="text-[10px] text-slate-500">{exp.description.length}/5 نقاط</span>
                            </div>
                            <textarea
                                rows={3}
                                value={exp.description.join("\n")}
                                onChange={(e) => updateExperience(idx, "description", e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm outline-none focus:border-emerald-500"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
