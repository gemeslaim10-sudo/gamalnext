"use client";

import { Save } from "lucide-react";
import { Button, LoadingBlock, PageHeader } from "@/components/ui";

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

    return (
        <div className="max-w-content">
            <PageHeader
                title="Manage Skills"
                description="Services, technical skills and tools shown on the skills page."
                actions={
                    !loading && (
                        <Button onClick={handleSubmit(onSubmit)} className="w-full sm:w-auto">
                            <Save /> Save Changes
                        </Button>
                    )
                }
            />

            {loading ? (
                <LoadingBlock />
            ) : (
                <div className="space-y-6">
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
            )}
        </div>
    );
}
