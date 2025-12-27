"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useForm, useFieldArray } from "react-hook-form";
import { Save, Plus, Trash, Code, Database, BarChart, FileText } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

// Icon mapping for selection
const iconOptions = [
    { value: 'Code', label: 'Code (Web)', icon: Code },
    { value: 'Database', label: 'Database', icon: Database },
    { value: 'BarChart', label: 'Analysis', icon: BarChart },
    { value: 'FileText', label: 'Content', icon: FileText },
];

type SkillCard = {
    title: string;
    description: string;
    tags: string; // Comma separated for editing
    icon: string;
}

type TechItem = {
    name: string;
    val: string; // "90%"
}

type SoftwareItem = {
    name: string;
    level: string; // "Professional"
    color: string; // "text-green-400"
}

interface SkillsForm {
    mainSkills: SkillCard[];
    techStack: TechItem[];
    software: SoftwareItem[];
}

const defaultSkillsData: SkillsForm = {
    mainSkills: [
        { title: "تطوير الويب والـ AI", description: "بناء مواقع Full Stack باستخدام Next.js...", tags: "Next.js, React, Gemini API, Tailwind", icon: "Code" },
        { title: "تحليل البيانات", description: "إدارة قواعد بيانات معقدة...", tags: "MySQL, PostgreSQL, Data Entry", icon: "Database" }
    ],
    techStack: [
        { name: "React.js", val: "95%" },
        { name: "Next.js", val: "85%" }
    ],
    software: [
        { name: "VS Code", level: "احترافي", color: "text-green-400" }
    ]
};

export default function SkillsPage() {
    const { register, control, handleSubmit, setValue, formState: { isSubmitting } } = useForm<SkillsForm>({
        defaultValues: defaultSkillsData
    });

    const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({ control, name: "mainSkills" });
    const { fields: techFields, append: appendTech, remove: removeTech } = useFieldArray({ control, name: "techStack" });
    const { fields: softFields, append: appendSoft, remove: removeSoft } = useFieldArray({ control, name: "software" });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const snap = await getDoc(doc(db, "site_content", "skills"));
                if (snap.exists()) {
                    const data = snap.data() as SkillsForm;
                    setValue("mainSkills", data.mainSkills || []);
                    setValue("techStack", data.techStack || []);
                    setValue("software", data.software || []);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [setValue]);

    const onSubmit = async (data: SkillsForm) => {
        try {
            await setDoc(doc(db, "site_content", "skills"), data);
            toast.success("Skills updated!");
        } catch (e) {
            toast.error("Error saving.");
        }
    };

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Toaster />
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Manage Skills</h1>
                <button onClick={handleSubmit(onSubmit)} className="px-6 py-2 bg-blue-600 rounded-lg text-white font-bold flex gap-2">
                    <Save className="w-5 h-5" /> Save Changes
                </button>
            </div>

            {/* Section 1: Main Skill Cards */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Main Services Items</h2>
                    <button type="button" onClick={() => appendSkill({ title: "", description: "", tags: "", icon: "Code" })} className="text-blue-400 flex gap-1 text-sm items-center"><Plus className="w-4 h-4" /> Add Item</button>
                </div>
                <div className="space-y-6">
                    {skillFields.map((field, index) => (
                        <div key={field.id} className="p-4 bg-slate-950 rounded-lg border border-slate-800 grid gap-4">
                            <div className="flex justify-between">
                                <span className="text-slate-500 text-sm">Item #{index + 1}</span>
                                <button type="button" onClick={() => removeSkill(index)} className="text-red-400"><Trash className="w-4 h-4" /></button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input {...register(`mainSkills.${index}.title`)} placeholder="Title" className="bg-slate-900 border border-slate-700 p-2 rounded text-white" />
                                <select {...register(`mainSkills.${index}.icon`)} className="bg-slate-900 border border-slate-700 p-2 rounded text-white">
                                    {iconOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                            </div>
                            <textarea {...register(`mainSkills.${index}.description`)} placeholder="Description" className="bg-slate-900 border border-slate-700 p-2 rounded text-white w-full" rows={2} />
                            <input {...register(`mainSkills.${index}.tags`)} placeholder="Tags (comma separated)" className="bg-slate-900 border border-slate-700 p-2 rounded text-white w-full" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Section 2: Tech Stack */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Technical Skills (Progress)</h2>
                    <button type="button" onClick={() => appendTech({ name: "", val: "50%" })} className="text-blue-400 flex gap-1 text-sm items-center"><Plus className="w-4 h-4" /> Add Skill</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {techFields.map((field, index) => (
                        <div key={field.id} className="flex gap-2 items-center">
                            <input {...register(`techStack.${index}.name`)} placeholder="Name (e.g React)" className="bg-slate-950 border border-slate-700 p-2 rounded text-white flex-1" />
                            <input {...register(`techStack.${index}.val`)} placeholder="90%" className="bg-slate-950 border border-slate-700 p-2 rounded text-white w-20" />
                            <button type="button" onClick={() => removeTech(index)} className="text-red-400"><Trash className="w-4 h-4" /></button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Section 3: Software Levels */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Software Proficiency</h2>
                    <button type="button" onClick={() => appendSoft({ name: "", level: "متقدم", color: "text-green-400" })} className="text-blue-400 flex gap-1 text-sm items-center"><Plus className="w-4 h-4" /> Add Tool</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {softFields.map((field, index) => (
                        <div key={field.id} className="bg-slate-950 p-3 rounded border border-slate-700 space-y-2 relative">
                            <button type="button" onClick={() => removeSoft(index)} className="absolute top-2 right-2 text-red-400"><Trash className="w-3 h-3" /></button>
                            <input {...register(`software.${index}.name`)} placeholder="Tool Name" className="bg-slate-900 border border-slate-700 p-1 rounded text-white w-full text-sm" />
                            <input {...register(`software.${index}.level`)} placeholder="Level (Arabic)" className="bg-slate-900 border border-slate-700 p-1 rounded text-white w-full text-sm" />
                            <select {...register(`software.${index}.color`)} className="bg-slate-900 border border-slate-700 p-1 rounded text-white w-full text-sm">
                                <option value="text-green-400">Green (Professional)</option>
                                <option value="text-yellow-400">Yellow (Medium)</option>
                                <option value="text-slate-400">Gray (Beginner)</option>
                            </select>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
