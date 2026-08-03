"use client";

import { UseFormRegister, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { type ProjectsForm, type ProjectItem } from "./types";
import { ProjectRowHeader } from "./components/ProjectRowHeader";
import { ProjectExpandedForm } from "./components/ProjectExpandedForm";

interface ProjectCardProps {
    field: { id: string };
    index: number;
    item: ProjectItem | undefined;
    isExpanded: boolean;
    onToggleExpand: (id: string) => void;
    onRemove: (index: number) => void;
    register: UseFormRegister<ProjectsForm>;
    watch: UseFormWatch<ProjectsForm>;
    setValue: UseFormSetValue<ProjectsForm>;
}

export default function ProjectCard({
    field, index, item, isExpanded, onToggleExpand, onRemove,
    register, watch, setValue,
}: ProjectCardProps) {
    return (
        <div
            data-project-row={field.id}
            className={`bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden transition-all hover:border-slate-700 ${isExpanded ? 'ring-1 ring-blue-500/20' : ''}`}
        >
            <ProjectRowHeader
                fieldId={field.id}
                index={index}
                item={item}
                isExpanded={isExpanded}
                onToggleExpand={onToggleExpand}
                onRemove={onRemove}
            />

            {isExpanded && (
                <ProjectExpandedForm
                    index={index}
                    item={item}
                    register={register}
                    watch={watch}
                    setValue={setValue}
                />
            )}
        </div>
    );
}
