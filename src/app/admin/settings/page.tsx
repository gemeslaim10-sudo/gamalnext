"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useForm } from "react-hook-form";
import { Save } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface SettingsForm {
    siteName: string;
    siteLogo: string;
    // We can add more settings here in the future
}

export default function SettingsPage() {
    const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm<SettingsForm>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                // Fetch from the new settings document
                const docRef = doc(db, "site_content", "settings");
                const snap = await getDoc(docRef);
                if (snap.exists()) {
                    const data = snap.data() as SettingsForm;
                    setValue("siteName", data.siteName || "GAMALTECH");
                    setValue("siteLogo", data.siteLogo || "");
                } else {
                    // Fetch fallback from hero document in case they already set it there
                    const oldRef = doc(db, "site_content", "hero");
                    const oldSnap = await getDoc(oldRef);
                    if (oldSnap.exists()) {
                        const oldData = oldSnap.data() as any;
                        setValue("siteName", oldData.siteName || "GAMALTECH");
                        setValue("siteLogo", oldData.siteLogo || "");
                    } else {
                        setValue("siteName", "GAMALTECH");
                        setValue("siteLogo", "");
                    }
                }
            } catch (err) {
                console.error(err);
                toast.error("Error loading settings");
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [setValue]);

    const onSubmit = async (data: SettingsForm) => {
        try {
            await setDoc(doc(db, "site_content", "settings"), data, { merge: true });
            toast.success("Settings updated successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update settings");
        }
    };

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <Toaster />
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">إعدادات الموقع</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Branding Section */}
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Branding & Identity</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Site Name</label>
                            <input
                                {...register("siteName")}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Site Logo (Optional)</label>
                            <ImageUpload
                                value={watch("siteLogo")}
                                onChange={(url) => setValue("siteLogo", url)}
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
