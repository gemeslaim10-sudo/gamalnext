"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useForm, useFieldArray } from "react-hook-form";
import { Save, Plus, Trash } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { ImageUpload } from "@/components/admin/ImageUpload";

type ProjectItem = {
    title: string;
    image: string;
    tags: string;
    link: string;
}

interface ProjectsForm {
    items: ProjectItem[];
}

const defaultProjectsData: ProjectsForm = {
    items: [
        {
            title: 'Art Vision Portfolio',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
            tags: 'React, Netlify, Dashboard',
            link: 'https://artvisionviewportfolio.netlify.app/'
        },
        {
            title: 'Noorva Store',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
            tags: 'E-commerce, Supabase, React',
            link: 'https://noorvastore.netlify.app/'
        },
        {
            title: 'Zakaryia Law Firm',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
            tags: 'Corporate, CMS, Dynamic',
            link: 'https://zakaryialawfirm.netlify.app/'
        },
        {
            title: 'Framez Vision',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
            tags: 'Cloudflare, Media, Animation',
            link: 'https://framezvision.pages.dev/'
        }
    ]
};

export default function ProjectsPage() {
    const { register, control, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm<ProjectsForm>({
        defaultValues: defaultProjectsData
    });

    const { fields, append, remove } = useFieldArray({ control, name: "items" });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const snap = await getDoc(doc(db, "site_content", "projects"));
                if (snap.exists()) {
                    const data = snap.data() as ProjectsForm;
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

    const onSubmit = async (data: ProjectsForm) => {
        try {
            await setDoc(doc(db, "site_content", "projects"), data);
            toast.success("Projects updated!");
        } catch (e) {
            toast.error("Error saving.");
        }
    };

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Toaster />
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Manage Projects</h1>
                <button onClick={handleSubmit(onSubmit)} className="px-6 py-2 bg-purple-600 rounded-lg text-white font-bold flex gap-2">
                    <Save className="w-5 h-5" /> Save Changes
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Projects List</h2>
                    <button type="button" onClick={() => append({ title: "", image: "", tags: "", link: "" })} className="text-purple-400 flex gap-1 text-sm items-center"><Plus className="w-4 h-4" /> Add Project</button>
                </div>

                <div className="space-y-6">
                    {fields.map((field, index) => (
                        <div key={field.id} className="p-4 bg-slate-950 rounded-lg border border-slate-800 relative grid grid-cols-1 md:grid-cols-3 gap-6">
                            <button type="button" onClick={() => remove(index)} className="absolute top-2 right-2 text-red-400 p-2 hover:bg-red-500/10 rounded"><Trash className="w-5 h-5" /></button>

                            {/* Image Column */}
                            <div>
                                <ImageUpload
                                    value={watch(`items.${index}.image`)}
                                    onChange={(val) => setValue(`items.${index}.image`, val)}
                                    label="Project Thumbnail"
                                />
                            </div>

                            {/* Details Column */}
                            <div className="md:col-span-2 space-y-4 pt-2">
                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">Project Title</label>
                                    <input {...register(`items.${index}.title`)} className="bg-slate-900 border border-slate-700 p-2 rounded text-white w-full" />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">Tags (comma separated)</label>
                                    <input {...register(`items.${index}.tags`)} className="bg-slate-900 border border-slate-700 p-2 rounded text-white w-full" />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">Link</label>
                                    <input {...register(`items.${index}.link`)} className="bg-slate-900 border border-slate-700 p-2 rounded text-white w-full" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
