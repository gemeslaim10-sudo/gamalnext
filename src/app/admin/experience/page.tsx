"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useForm, useFieldArray } from "react-hook-form";
import { Save, Plus, Trash, Briefcase } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

type ExperienceItem = {
    title: string;
    period: string;
    description: string;
    active: boolean; // For highlight color
}

interface ExperienceForm {
    items: ExperienceItem[];
}

const defaultExperienceData: ExperienceForm = {
    items: [
        { title: "مطور ومصمم مواقع ويب", period: "شهران", description: "تطوير مواقع كاملة مع لوحات تحكم ديناميكية.", active: true },
        { title: "محلل بيانات", period: "شهر واحد", description: "تحليل الحملات الإعلانية وتقديم تقارير الأداء.", active: false },
        { title: "مدخل بيانات", period: "3 أشهر", description: "إدارة وتنظيم البيانات بدقة عالية.", active: false }
    ]
};

export default function ExperiencePage() {
    const { register, control, handleSubmit, setValue, formState: { isSubmitting } } = useForm<ExperienceForm>({
        defaultValues: defaultExperienceData
    });

    const { fields, append, remove } = useFieldArray({ control, name: "items" });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const snap = await getDoc(doc(db, "site_content", "experience"));
                if (snap.exists()) {
                    const data = snap.data() as ExperienceForm;
                    setValue("items", data.items || []);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [setValue]);

    const onSubmit = async (data: ExperienceForm) => {
        try {
            await setDoc(doc(db, "site_content", "experience"), data);
            toast.success("Experience updated!");
        } catch (e) {
            toast.error("Error saving.");
        }
    };

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Toaster />
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Manage Experience</h1>
                <button onClick={handleSubmit(onSubmit)} className="px-6 py-2 bg-green-600 rounded-lg text-white font-bold flex gap-2">
                    <Save className="w-5 h-5" /> Save Changes
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Experience Timeline</h2>
                    <button type="button" onClick={() => append({ title: "", period: "", description: "", active: false })} className="text-green-400 flex gap-1 text-sm items-center"><Plus className="w-4 h-4" /> Add Item</button>
                </div>

                <div className="space-y-4">
                    {fields.map((field, index) => (
                        <div key={field.id} className="p-4 bg-slate-950 rounded-lg border border-slate-800 relative">
                            <button type="button" onClick={() => remove(index)} className="absolute top-4 right-4 text-red-400 p-2 hover:bg-red-500/10 rounded"><Trash className="w-5 h-5" /></button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-10">
                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">Title</label>
                                    <input {...register(`items.${index}.title`)} className="bg-slate-900 border border-slate-700 p-2 rounded text-white w-full" />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">Period</label>
                                    <input {...register(`items.${index}.period`)} className="bg-slate-900 border border-slate-700 p-2 rounded text-white w-full" />
                                </div>
                            </div>

                            <div className="mt-4 pr-10">
                                <label className="block text-xs text-slate-500 mb-1">Description</label>
                                <textarea {...register(`items.${index}.description`)} rows={2} className="bg-slate-900 border border-slate-700 p-2 rounded text-white w-full" />
                            </div>

                            <div className="mt-4 flex items-center gap-2">
                                <input type="checkbox" {...register(`items.${index}.active`)} id={`active-${index}`} className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500" />
                                <label htmlFor={`active-${index}`} className="text-sm text-slate-400">Highlight (Active/Blue)</label>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
