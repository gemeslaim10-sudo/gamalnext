"use client";

import React, { useEffect, useState } from "react";
import { getCvData, saveCvData, defaultCvData } from "@/lib/cv/service";
import { CVData } from "@/app/tools/utils/ai-cv-builder/components/CvTemplate";
import { Save, RefreshCw, Loader2, Plus, Trash2, ExternalLink, FileText, Upload, User, Briefcase, GraduationCap, Code2, Globe } from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { openCloudinaryWidget } from "@/lib/cloudinary";

export default function AdminCvPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [cvData, setCvData] = useState<CVData>(defaultCvData);

    useEffect(() => {
        async function load() {
            try {
                const data = await getCvData();
                setCvData(data);
            } catch (e) {
                console.error(e);
                toast.error("حدث خطأ أثناء تحميل بيانات السيرة الذاتية");
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
            const ok = await saveCvData(cvData);
            if (ok) {
                toast.success("تم حفظ السيرة الذاتية (CV) بنجاح ورؤيتها مباشرة على الموقع!");
            } else {
                toast.error("فشل حفظ البيانات");
            }
        } catch {
            toast.error("حدث خطأ في الاتصال");
        } finally {
            setSaving(false);
        }
    };

    const handleResetDefault = () => {
        if (confirm("هل أنت تأكد من إعادة تعيين البيانات إلى القيمة الافتراضية؟")) {
            setCvData(defaultCvData);
            toast.success("تمت الإعادة للقيم الافتراضية. لا تنس الضغط على حفظ التغييرات.");
        }
    };

    // --- Dynamic Arrays Handlers ---
    const updateExperience = (index: number, field: "title" | "company" | "date" | "description", value: string) => {
        const newExp = [...cvData.experience];
        if (!newExp[index]) return;
        if (field === "description") {
            newExp[index].description = value.split("\n").filter((l) => l.trim() !== "");
        } else {
            newExp[index][field] = value;
        }
        setCvData({ ...cvData, experience: newExp });
    };

    const addExperience = () => {
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

    const updateEducation = (index: number, field: "degree" | "institution" | "date", value: string) => {
        const newEdu = [...cvData.education];
        if (!newEdu[index]) return;
        newEdu[index][field] = value;
        setCvData({ ...cvData, education: newEdu });
    };

    const addEducation = () => {
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] text-white">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-16">
            {/* Header */}
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
                        onClick={handleResetDefault}
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

            <form id="cv-admin-form" onSubmit={handleSave} className="space-y-6">
                {/* Personal Information */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                        <User className="w-5 h-5 text-blue-400" />
                        المعلومات الشخصية (Personal Info)
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">الاسم الكامل (Full Name)</label>
                            <input
                                type="text"
                                required
                                value={cvData.personalInfo.fullName}
                                onChange={(e) => setCvData({ ...cvData, personalInfo: { ...cvData.personalInfo, fullName: e.target.value } })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">المسمى الوظيفي (Job Title)</label>
                            <input
                                type="text"
                                required
                                value={cvData.personalInfo.jobTitle}
                                onChange={(e) => setCvData({ ...cvData, personalInfo: { ...cvData.personalInfo, jobTitle: e.target.value } })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">البريد الإلكتروني (Email)</label>
                            <input
                                type="email"
                                required
                                value={cvData.personalInfo.email}
                                onChange={(e) => setCvData({ ...cvData, personalInfo: { ...cvData.personalInfo, email: e.target.value } })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">رقم الهاتف (Phone)</label>
                            <input
                                type="text"
                                required
                                value={cvData.personalInfo.phone}
                                onChange={(e) => setCvData({ ...cvData, personalInfo: { ...cvData.personalInfo, phone: e.target.value } })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">الموقع الجغرافي (Location)</label>
                            <input
                                type="text"
                                value={cvData.personalInfo.location}
                                onChange={(e) => setCvData({ ...cvData, personalInfo: { ...cvData.personalInfo, location: e.target.value } })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">الموقع الإلكتروني (Website)</label>
                            <input
                                type="text"
                                value={cvData.personalInfo.website || ""}
                                onChange={(e) => setCvData({ ...cvData, personalInfo: { ...cvData.personalInfo, website: e.target.value } })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">رابط الصورة الشخصية (Photo URL)</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={cvData.personalInfo.image || ""}
                                    onChange={(e) => setCvData({ ...cvData, personalInfo: { ...cvData.personalInfo, image: e.target.value } })}
                                    placeholder="https://..."
                                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        openCloudinaryWidget((url) => {
                                            const imageUrl = Array.isArray(url) ? url[0] : url;
                                            setCvData({ ...cvData, personalInfo: { ...cvData.personalInfo, image: imageUrl } });
                                        });
                                    }}
                                    className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl flex items-center gap-2 text-sm font-medium transition-all"
                                >
                                    <Upload className="w-4 h-4" /> رفع صورة
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Work Experience */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-emerald-400" />
                            الخبرات العملية (Work Experience)
                        </h2>
                        <button
                            type="button"
                            onClick={addExperience}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold rounded-lg transition-all"
                        >
                            <Plus className="w-4 h-4" /> إضافة خبرة
                        </button>
                    </div>

                    <div className="space-y-4">
                        {cvData.experience.map((exp, idx) => (
                            <div key={idx} className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3 relative group">
                                <button
                                    type="button"
                                    onClick={() => removeExperience(idx)}
                                    className="absolute top-4 left-4 p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                    title="حذف هذا العنصر"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pr-2">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">المسمى (Job Title)</label>
                                        <input
                                            type="text"
                                            value={exp.title}
                                            onChange={(e) => updateExperience(idx, "title", e.target.value)}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">الجهة (Company)</label>
                                        <input
                                            type="text"
                                            value={exp.company}
                                            onChange={(e) => updateExperience(idx, "company", e.target.value)}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">الفترة الزمنية (Date)</label>
                                        <input
                                            type="text"
                                            value={exp.date}
                                            onChange={(e) => updateExperience(idx, "date", e.target.value)}
                                            placeholder="2022 - Present"
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">المهام والإنجازات (كل سطر يعتبر نقطة مستقلة)</label>
                                    <textarea
                                        rows={3}
                                        value={exp.description.join("\n")}
                                        onChange={(e) => updateExperience(idx, "description", e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm outline-none"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Education */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-purple-400" />
                            التعليم والشهادات (Education)
                        </h2>
                        <button
                            type="button"
                            onClick={addEducation}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-semibold rounded-lg transition-all"
                        >
                            <Plus className="w-4 h-4" /> إضافة مؤهل
                        </button>
                    </div>

                    <div className="space-y-3">
                        {cvData.education.map((edu, idx) => (
                            <div key={idx} className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl flex flex-col md:flex-row items-center gap-3 relative">
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
                                    <input
                                        type="text"
                                        placeholder="الدرجة/المؤهل"
                                        value={edu.degree}
                                        onChange={(e) => updateEducation(idx, "degree", e.target.value)}
                                        className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm outline-none"
                                    />
                                    <input
                                        type="text"
                                        placeholder="الكلية/الجامعة/المؤسسة"
                                        value={edu.institution}
                                        onChange={(e) => updateEducation(idx, "institution", e.target.value)}
                                        className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm outline-none"
                                    />
                                    <input
                                        type="text"
                                        placeholder="التاريخ/السنة"
                                        value={edu.date}
                                        onChange={(e) => updateEducation(idx, "date", e.target.value)}
                                        className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm outline-none"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeEducation(idx)}
                                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all shrink-0"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Skills & Languages */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                            <Code2 className="w-5 h-5 text-amber-400" />
                            المهارات التقنية (Skills)
                        </h2>
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-2">
                                المهارات (مفصولة بفاصلة comma — يمكنك كتابة النسبة مثل React.js (95%))
                            </label>
                            <textarea
                                rows={6}
                                value={cvData.skills.join(", ")}
                                onChange={(e) =>
                                    setCvData({
                                        ...cvData,
                                        skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                                    })
                                }
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-sm outline-none leading-relaxed"
                            />
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                            <Globe className="w-5 h-5 text-cyan-400" />
                            اللغات (Languages)
                        </h2>
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-2">اللغات (مفصولة بفاصلة comma)</label>
                            <textarea
                                rows={6}
                                value={cvData.languages.join(", ")}
                                onChange={(e) =>
                                    setCvData({
                                        ...cvData,
                                        languages: e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                                    })
                                }
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-sm outline-none leading-relaxed"
                            />
                        </div>
                    </div>
                </div>

                {/* Specialized Solutions & Integrations */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                        <FileText className="w-5 h-5 text-indigo-400" />
                        الحلول والتكاملات المتخصصة (Specialized Solutions & Integrations)
                    </h2>
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-2">أدخل كل حل أو تكامل في سطر مستقل</label>
                        <textarea
                            rows={6}
                            value={cvData.integrations ? cvData.integrations.join("\n") : ""}
                            onChange={(e) =>
                                setCvData({
                                    ...cvData,
                                    integrations: e.target.value.split("\n").filter(Boolean)
                                })
                            }
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white text-sm outline-none leading-relaxed"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}
