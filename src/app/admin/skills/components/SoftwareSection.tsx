import { Plus, Trash2 } from "lucide-react";
import { UseFormRegister } from "react-hook-form";
import { SkillsForm } from "../types";
import { SectionCard } from "@/components/admin/SectionCard";
import { Button, Input } from "@/components/ui";

interface SoftwareSectionProps {
    softFields: Record<"id", string>[];
    appendSoft: (value: { name: string; level: string; color: string }) => void;
    removeSoft: (index: number) => void;
    register: UseFormRegister<SkillsForm>;
}

export function SoftwareSection({ softFields, appendSoft, removeSoft, register }: SoftwareSectionProps) {
    return (
        <SectionCard
            title="Software Proficiency"
            description="Tools you use and your level with each."
            action={
                // `color` is kept in the saved data for compatibility; the monochrome design no longer uses it
                <Button variant="secondary" size="sm" onClick={() => appendSoft({ name: "", level: "متقدم", color: "" })}>
                    <Plus /> Add Tool
                </Button>
            }
        >
            {softFields.length === 0 ? (
                <p className="text-sm text-subtle">No tools yet.</p>
            ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                    {softFields.map((field, index) => (
                        <div key={field.id} className="flex items-start gap-2 rounded-control border border-border p-3">
                            <div className="min-w-0 flex-1 space-y-2">
                                <Input
                                    {...register(`software.${index}.name`)}
                                    placeholder="Tool Name"
                                    aria-label={`Tool ${index + 1} name`}
                                />
                                <Input
                                    {...register(`software.${index}.level`)}
                                    placeholder="Level (Arabic)"
                                    aria-label={`Tool ${index + 1} level`}
                                />
                            </div>
                            <Button
                                variant="danger"
                                size="icon-sm"
                                onClick={() => removeSoft(index)}
                                aria-label={`Remove tool ${index + 1}`}
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
