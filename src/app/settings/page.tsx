"use client";

import Navbar from "@/components/layout/Navbar";
import { Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";

import { useSettings } from "./useSettings";
import { ProfileAvatar } from "./components/ProfileAvatar";
import { SettingsForm } from "./components/SettingsForm";
import { DangerZone } from "./components/DangerZone";

export default function SettingsPage() {
    const {
        user,
        loading,
        saving,
        formData,
        setFormData,
        handlePhotoUpload,
        handleSubmit,
        handleDeleteAccount
    } = useSettings();

    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white"><Loader2 className="animate-spin" /></div>;

    if (!user) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Please login first.</div>;

    return (
        <div className="min-h-screen pb-20">
            <Navbar />

            <div className="pt-32 px-4 max-w-2xl mx-auto">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
                    <h1 className="text-3xl font-bold text-white mb-8 text-center border-b border-slate-800 pb-4">إعدادات الملف الشخصي</h1>

                    <ProfileAvatar
                        photoURL={formData.photoURL}
                        name={formData.name}
                        handlePhotoUpload={handlePhotoUpload}
                    />

                    <SettingsForm
                        formData={formData}
                        setFormData={setFormData}
                        saving={saving}
                        handleSubmit={handleSubmit}
                    />

                    <DangerZone handleDeleteAccount={handleDeleteAccount} />
                </div>
            </div>
            <Toaster />
        </div>
    );
}
