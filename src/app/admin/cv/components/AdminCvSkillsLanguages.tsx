"use client";

import { useState } from "react";
import { Code2, Globe, Plus, Trash2, SlidersHorizontal, FileCode2 } from "lucide-react";
import { CVData } from "@/app/tools/utils/ai-cv-builder/components/CvTemplate";

interface AdminCvSkillsLanguagesProps {
    cvData: CVData;
    setCvData: React.Dispatch<React.SetStateAction<CVData>>;
}

const MAX_SKILLS = 16;
const MAX_LANGUAGES = 4;

export function AdminCvSkillsLanguages({ cvData, setCvData }: AdminCvSkillsLanguagesProps) {
    const [mode, setMode] = useState<"interactive" | "bulk">("interactive");

    const parseSkillItem = (skillStr: string) => {
        const match = skillStr.match(/^(.*?)\s*\((\d+)%\)$/);
        if (match && match[1] && match[2]) {
            return { name: match[1].trim(), percent: parseInt(match[2], 10) };
        }
        return { name: skillStr.trim(), percent: 0 };
    };

    const parsedSkills = cvData.skills.map(parseSkillItem);

    const updateSkillName = (index: number, newName: string) => {
        const newSkills = [...cvData.skills];
        const item = parseSkillItem(newSkills[index] || "");
        item.name = newName;
        newSkills[index] = item.percent > 0 ? `${item.name} (${item.percent}%)` : item.name;
        setCvData({ ...cvData, skills: newSkills });
    };

    const updateSkillPercent = (index: number, newPercent: number) => {
        const newSkills = [...cvData.skills];
        const item = parseSkillItem(newSkills[index] || "");
        item.percent = newPercent;
        newSkills[index] = item.percent > 0 ? `${item.name} (${item.percent}%)` : item.name;
        setCvData({ ...cvData, skills: newSkills });
    };

    const addSkill = () => {
        if (cvData.skills.length >= MAX_SKILLS) return;
        setCvData({
            ...cvData,
            skills: [...cvData.skills, "مهارة جديدة (85%)"]
        });
    };

    const removeSkill = (index: number) => {
        const newSkills = [...cvData.skills];
        newSkills.splice(index, 1);
        setCvData({ ...cvData, skills: newSkills });
    };

    // Language handlers
    const addLanguage = () => {
        if (cvData.languages.length >= MAX_LANGUAGES) return;
        setCvData({
            ...cvData,
            languages: [...cvData.languages, "لغة جديدة (مستوى)"]
        });
    };

    const updateLanguage = (index: number, val: string) => {
        const newLangs = [...cvData.languages];
        newLangs[index] = val;
        setCvData({ ...cvData, languages: newLangs });
    };

    const removeLanguage = (index: number) => {
        const newLangs = [...cvData.languages];
        newLangs.splice(index, 1);
        setCvData({ ...cvData, languages: newLangs });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skills */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Code2 className="w-5 h-5 text-amber-400" />
                            المهارات التقنية (Skills)
                        </h2>
                        <span className="text-xs text-slate-400">الحد الأقصى {MAX_SKILLS} مهارات</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setMode(mode === "interactive" ? "bulk" : "interactive")}
                            className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 border border-slate-700 rounded-lg text-xs flex items-center gap-1 transition-all"
                            title={mode === "interactive" ? "تعديل نصي جماعي" : "تعديل تفاعلي"}
                        >
                            {mode === "interactive" ? <FileCode2 className="w-3.5 h-3.5" /> : <SlidersHorizontal className="w-3.5 h-3.5" />}
                            <span>{mode === "interactive" ? "نصي" : "تفاعلي"}</span>
                        </button>
                        <button
                            type="button"
                            onClick={addSkill}
                            disabled={cvData.skills.length >= MAX_SKILLS}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <Plus className="w-3.5 h-3.5" /> إضافة ({cvData.skills.length}/{MAX_SKILLS})
                        </button>
                    </div>
                </div>

                {mode === "interactive" ? (
                    <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                        {parsedSkills.map((skill, idx) => (
                            <div key={idx} className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                    <input
                                        type="text"
                                        maxLength={30}
                                        value={skill.name}
                                        onChange={(e) => updateSkillName(idx, e.target.value)}
                                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-sm outline-none focus:border-amber-500"
                                        placeholder="اسم المهارة"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeSkill(idx)}
                                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-3 pt-1">
                                    <label className="text-xs text-slate-400 min-w-[55px]">نسبة الإتقان:</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        step="5"
                                        value={skill.percent}
                                        onChange={(e) => updateSkillPercent(idx, parseInt(e.target.value, 10))}
                                        className="flex-1 accent-amber-400 cursor-pointer"
                                    />
                                    <span className="text-xs font-bold text-amber-400 min-w-[36px] text-right">
                                        {skill.percent > 0 ? `${skill.percent}%` : "بدون"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-2">
                            المهارات (مفصولة بفاصلة comma — يمكنك كتابة النسبة مثل React.js (95%))
                        </label>
                        <textarea
                            rows={8}
                            value={cvData.skills.join(", ")}
                            onChange={(e) =>
                                setCvData({
                                    ...cvData,
                                    skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean).slice(0, MAX_SKILLS)
                                })
                            }
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-sm outline-none leading-relaxed focus:border-amber-500"
                        />
                    </div>
                )}
            </div>

            {/* Languages */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Globe className="w-5 h-5 text-cyan-400" />
                            اللغات (Languages)
                        </h2>
                        <span className="text-xs text-slate-400">الحد الأقصى {MAX_LANGUAGES} لغات</span>
                    </div>
                    <button
                        type="button"
                        onClick={addLanguage}
                        disabled={cvData.languages.length >= MAX_LANGUAGES}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Plus className="w-3.5 h-3.5" /> إضافة ({cvData.languages.length}/{MAX_LANGUAGES})
                    </button>
                </div>

                <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                    {cvData.languages.map((lang, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <input
                                type="text"
                                maxLength={35}
                                value={lang}
                                onChange={(e) => updateLanguage(idx, e.target.value)}
                                placeholder="مثال: Arabic (Native)"
                                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-cyan-500"
                            />
                            <button
                                type="button"
                                onClick={() => removeLanguage(idx)}
                                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
