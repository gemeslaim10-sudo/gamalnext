import { Plus, Trash2 } from "lucide-react";
import { UseFormRegister } from "react-hook-form";
import { SkillsForm } from "../types";
import { SectionCard } from "@/components/admin/SectionCard";
import { Button, Input } from "@/components/ui";

interface TechStackSectionProps {
    techFields: Record<"id", string>[];
    appendTech: (value: { name: string; val: string }) => void;
    removeTech: (index: number) => void;
    register: UseFormRegister<SkillsForm>;
}

export function TechStackSection({ techFields, appendTech, removeTech, register }: TechStackSectionProps) {
    return (
        <SectionCard
            title="Technical Skills (Progress)"
            description="Name and level, e.g. React · 90%."
            action={
                <Button variant="secondary" size="sm" onClick={() => appendTech({ name: "", val: "50%" })}>
                    <Plus /> Add Skill
                </Button>
            }
        >
            {techFields.length === 0 ? (
                <p className="text-sm text-subtle">No skills yet.</p>
            ) : (
                <div className="grid gap-3 md:grid-cols-2">
                    {techFields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2">
                            <Input
                                {...register(`techStack.${index}.name`)}
                                placeholder="Name (e.g React)"
                                aria-label={`Skill ${index + 1} name`}
                                className="min-w-0 flex-1"
                            />
                            <Input
                                {...register(`techStack.${index}.val`)}
                                placeholder="90%"
                                aria-label={`Skill ${index + 1} level`}
                                className="w-20 shrink-0"
                            />
                            <Button
                                variant="danger"
                                size="icon-sm"
                                onClick={() => removeTech(index)}
                                aria-label={`Remove skill ${index + 1}`}
                                title="Remove"
                                className="shrink-0"
                            >
                                <Trash2 />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </SectionCard>
    );
}
