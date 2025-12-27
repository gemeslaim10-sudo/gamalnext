"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useForm } from "react-hook-form";
import { Save } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

interface ContentForm {
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    whatsappNumber: string;
    resumeLink: string;
}

export default function ContentPage() {
    const { register, handleSubmit, setValue, formState: { isSubmitting } } = useForm<ContentForm>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const docRef = doc(db, "site_content", "hero");
                const snap = await getDoc(docRef);
                if (snap.exists()) {
                    const data = snap.data() as ContentForm;
                    setValue("heroTitle", data.heroTitle);
                    setValue("heroSubtitle", data.heroSubtitle || "محلل بيانات & مطور ويب مدعوم بالذكاء الاصطناعي");
                    setValue("heroDescription", data.heroDescription || "");
                    setValue("whatsappNumber", data.whatsappNumber || "201024531452");
                    setValue("resumeLink", data.resumeLink || "#projects");
                } else {
                    // Set Defaults if nothing in DB
                    setValue("heroTitle", "جمال عبد العاطي");
                    setValue("heroSubtitle", "محلل بيانات & مطور ويب مدعوم بالذكاء الاصطناعي");
                    setValue("heroDescription", "أحول البيانات المعقدة إلى رؤى واضحة، وأبني مواقع ويب ديناميكية تتحدث مع قواعد البيانات وتفهم العملاء باستخدام أحدث تقنيات Gemini AI.");
                    setValue("whatsappNumber", "201024531452");
                    setValue("resumeLink", "#projects");
                }
            } catch (err) {
                console.error(err);
                toast.error("Error loading content");
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [setValue]);

    const onSubmit = async (data: ContentForm) => {
        try {
            await setDoc(doc(db, "site_content", "hero"), data);
            toast.success("Content updated successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update content");
        }
    };

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <Toaster />
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">General Content</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Hero Section */}
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Hero Section</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Main Title (Name)</label>
                            <input
                                {...register("heroTitle")}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Subtitle</label>
                            <input
                                {...register("heroSubtitle")}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Lead Paragraph</label>
                        <textarea
                            {...register("heroDescription")}
                            rows={4}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">WhatsApp Number (No +)</label>
                            <input
                                {...register("whatsappNumber")}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all"
                >
                    <Save className="w-5 h-5" />
                    {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
}
