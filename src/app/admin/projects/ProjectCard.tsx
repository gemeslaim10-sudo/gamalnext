"use client";

import { UseFormRegister, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { cn } from "@/lib/utils";
import { usePresence } from "@/hooks/usePresence";
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
    className?: string;
}

/** One project: a clickable summary row that expands into its edit form. Sizes itself to its own width (container queries). */
export default function ProjectCard({
    field, index, item, isExpanded, onToggleExpand, onRemove,
    register, watch, setValue, className,
}: ProjectCardProps) {
    const form = usePresence(isExpanded);

    return (
        <div data-project-row={field.id} className={cn("@container", className)}>
            <ProjectRowHeader
                fieldId={field.id}
                index={index}
                item={item}
                isExpanded={isExpanded}
                onToggleExpand={onToggleExpand}
                onRemove={onRemove}
            />

            {/* Opens and closes to its natural height (grid rows 0fr ↔ 1fr) */}
            {form.mounted && (
                <div
                    data-state={form.state}
                    className="grid transition-[grid-template-rows,opacity] duration-(--motion-base) ease-out data-[state=closed]:grid-rows-[0fr] data-[state=closed]:opacity-0 data-[state=open]:grid-rows-[1fr]"
                >
                    <div className="overflow-hidden">
                        <ProjectExpandedForm
                            index={index}
                            item={item}
                            register={register}
                            watch={watch}
                            setValue={setValue}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
