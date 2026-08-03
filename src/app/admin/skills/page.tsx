"use client";

import { Save } from "lucide-react";
import { Toaster } from "react-hot-toast";

import { useSkillsAdmin } from "./useSkillsAdmin";
import { MainSkillsSection } from "./components/MainSkillsSection";
import { TechStackSection } from "./components/TechStackSection";
import { SoftwareSection } from "./components/SoftwareSection";

export default function SkillsPage() {
    const {
        register, handleSubmit, onSubmit, loading,
        skillFields, appendSkill, removeSkill,
        techFields, appendTech, removeTech,
        softFields, appendSoft, removeSoft
    } = useSkillsAdmin();

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

            <MainSkillsSection 
                skillFields={skillFields} 
                appendSkill={appendSkill} 
                removeSkill={removeSkill} 
                register={register} 
            />

            <TechStackSection 
                techFields={techFields} 
                appendTech={appendTech} 
                removeTech={removeTech} 
                register={register} 
            />

            <SoftwareSection 
                softFields={softFields} 
                appendSoft={appendSoft} 
                removeSoft={removeSoft} 
                register={register} 
            />
        </div>
    );
}
