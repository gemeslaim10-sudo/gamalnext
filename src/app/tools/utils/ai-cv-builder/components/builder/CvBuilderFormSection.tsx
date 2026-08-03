"use client";

import { User, Briefcase, GraduationCap, Code2, Globe, Sparkles, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { CVData } from "../CvTemplate";

interface CvBuilderFormSectionProps {
    data: CVData;
    setData: React.Dispatch<React.SetStateAction<CVData>>;
    aiPrompt: string;
    setAiPrompt: (val: string) => void;
    generating: boolean;
    onGenerate: () => void;
}

export function CvBuilderFormSection({
    data,
    setData,
    aiPrompt,
    setAiPrompt,
    generating,
    onGenerate,
}: CvBuilderFormSectionProps) {
    const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            personalInfo: { ...data.personalInfo, [e.target.name]: e.target.value },
        });
    };

    const handleArrayChange = (field: "skills" | "languages", value: string) => {
        setData({
            ...data,
            [field]: value.split(",").map((item) => item.trim()).filter(Boolean),
        });
    };

    const updateExperience = (index: number, field: "title" | "company" | "date" | "description", value: string) => {
        const newExp = [...data.experience];
        const item = newExp[index];
        if (!item) return;

        if (field === "description") {
            item.description = value.split("\n").filter((l) => l.trim() !== "");
        } else {
            item[field] = value;
        }
        setData({ ...data, experience: newExp });
    };

    const addExperience = () => {
        setData({
            ...data,
            experience: [...data.experience, { title: "New Job", company: "Company", date: "Present", description: ["Task 1"] }],
        });
    };

    const removeExperience = (index: number) => {
        const newExp = [...data.experience];
        newExp.splice(index, 1);
        setData({ ...data, experience: newExp });
    };

    const updateEducation = (index: number, field: "degree" | "institution" | "date", value: string) => {
        const newEdu = [...data.education];
        const item = newEdu[index];
        if (!item) return;
        item[field] = value;
        setData({ ...data, education: newEdu });
    };

    const addEducation = () => {
        setData({
            ...data,
            education: [...data.education, { degree: "Degree", institution: "University", date: "2024" }],
        });
    };

    const removeEducation = (index: number) => {
        const newEdu = [...data.education];
        newEdu.splice(index, 1);
        setData({ ...data, education: newEdu });
    };

    return (
        <div className="space-y-6">
            {/* AI Generator Box */}
            <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-2xl p-5 space-y-3">
                <label className="text-sm font-bold text-purple-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" /> Auto-Fill with AI Prompt
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="e.g. Senior Frontend Developer with 5 years exp in Next.js & Tailwind..."
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 placeholder:text-slate-600"
                    />
                    <button
                        onClick={onGenerate}
                        disabled={generating || !aiPrompt.trim()}
                        className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 shrink-0"
                    >
                        {generating ? "Generating..." : "Generate"}
                    </button>
                </div>
            </div>

            {/* Personal Info */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="font-bold text-white flex items-center gap-2 text-sm border-b border-slate-800 pb-3">
                    <User className="w-4 h-4 text-blue-400" /> Personal Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs text-slate-400 block mb-1">Full Name</label>
                        <input type="text" name="fullName" value={data.personalInfo.fullName} onChange={handlePersonalInfoChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none" />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 block mb-1">Job Title</label>
                        <input type="text" name="jobTitle" value={data.personalInfo.jobTitle} onChange={handlePersonalInfoChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none" />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 block mb-1">Email</label>
                        <input type="email" name="email" value={data.personalInfo.email} onChange={handlePersonalInfoChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none" />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 block mb-1">Phone</label>
                        <input type="text" name="phone" value={data.personalInfo.phone} onChange={handlePersonalInfoChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none" />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 block mb-1">Location</label>
                        <input type="text" name="location" value={data.personalInfo.location} onChange={handlePersonalInfoChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none" />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 block mb-1">Website (Optional)</label>
                        <input type="text" name="website" value={data.personalInfo.website || ""} onChange={handlePersonalInfoChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none" />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="text-xs text-slate-400 block mb-1">Photo URL (Optional)</label>
                        <div className="flex gap-2 items-center">
                            <ImageIcon className="w-4 h-4 text-slate-500" />
                            <input type="text" name="image" value={data.personalInfo.image || ""} onChange={handlePersonalInfoChange} placeholder="https://..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Work Experience */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                        <Briefcase className="w-4 h-4 text-emerald-400" /> Experience
                    </h3>
                    <button onClick={addExperience} className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold">
                        <Plus className="w-3.5 h-3.5" /> Add Job
                    </button>
                </div>
                <div className="space-y-4">
                    {data.experience.map((exp, idx) => (
                        <div key={idx} className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2 relative">
                            <button onClick={() => removeExperience(idx)} className="absolute top-3 right-3 text-red-400 hover:text-red-300">
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <input type="text" value={exp.title} onChange={(e) => updateExperience(idx, "title", e.target.value)} placeholder="Title" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm text-white font-bold" />
                            <div className="grid grid-cols-2 gap-2">
                                <input type="text" value={exp.company} onChange={(e) => updateExperience(idx, "company", e.target.value)} placeholder="Company" className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300" />
                                <input type="text" value={exp.date} onChange={(e) => updateExperience(idx, "date", e.target.value)} placeholder="Date" className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300" />
                            </div>
                            <textarea value={exp.description.join("\n")} onChange={(e) => updateExperience(idx, "description", e.target.value)} rows={3} placeholder="Bullet points (one per line)" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-300" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Education */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                        <GraduationCap className="w-4 h-4 text-purple-400" /> Education
                    </h3>
                    <button onClick={addEducation} className="text-xs text-purple-400 hover:underline flex items-center gap-1 font-semibold">
                        <Plus className="w-3.5 h-3.5" /> Add Degree
                    </button>
                </div>
                <div className="space-y-3">
                    {data.education.map((edu, idx) => (
                        <div key={idx} className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center gap-2 relative">
                            <div className="grid grid-cols-3 gap-2 flex-1">
                                <input type="text" value={edu.degree} onChange={(e) => updateEducation(idx, "degree", e.target.value)} placeholder="Degree" className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white" />
                                <input type="text" value={edu.institution} onChange={(e) => updateEducation(idx, "institution", e.target.value)} placeholder="Institution" className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300" />
                                <input type="text" value={edu.date} onChange={(e) => updateEducation(idx, "date", e.target.value)} placeholder="Date" className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-400" />
                            </div>
                            <button onClick={() => removeEducation(idx)} className="text-red-400 hover:text-red-300 p-1">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Skills & Languages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <h3 className="font-bold text-white flex items-center gap-2 text-sm border-b border-slate-800 pb-3">
                        <Code2 className="w-4 h-4 text-amber-400" /> Skills (Comma-separated)
                    </h3>
                    <textarea value={data.skills.join(", ")} onChange={(e) => handleArrayChange("skills", e.target.value)} rows={3} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none" />
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <h3 className="font-bold text-white flex items-center gap-2 text-sm border-b border-slate-800 pb-3">
                        <Globe className="w-4 h-4 text-cyan-400" /> Languages (Comma-separated)
                    </h3>
                    <textarea value={data.languages.join(", ")} onChange={(e) => handleArrayChange("languages", e.target.value)} rows={3} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none" />
                </div>
            </div>
        </div>
    );
}
