import { Plus, Trash2, Code, Database, BarChart, FileText } from "lucide-react";
import { UseFormRegister } from "react-hook-form";
import { SkillsForm } from "../types";
import { SectionCard } from "@/components/admin/SectionCard";
import { Button, Field, Input, Select, Textarea } from "@/components/ui";

export const iconOptions = [
    { value: 'Code', label: 'Code (Web)', icon: Code },
    { value: 'Database', label: 'Database', icon: Database },
    { value: 'BarChart', label: 'Analysis', icon: BarChart },
    { value: 'FileText', label: 'Content', icon: FileText },
];

interface MainSkillsSectionProps {
    skillFields: Record<"id", string>[];
    appendSkill: (value: { title: string; description: string; tags: string; icon: string }) => void;
    removeSkill: (index: number) => void;
    register: UseFormRegister<SkillsForm>;
}

export function MainSkillsSection({ skillFields, appendSkill, removeSkill, register }: MainSkillsSectionProps) {
    return (
        <SectionCard
            title="Main Services Items"
            action={
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => appendSkill({ title: "", description: "", tags: "", icon: "Code" })}
                >
                    <Plus /> Add Item
                </Button>
            }
        >
            {skillFields.length === 0 ? (
                <p className="text-sm text-subtle">No items yet.</p>
            ) : (
                <div className="divide-y divide-border">
                    {skillFields.map((field, index) => (
                        <div key={field.id} className="space-y-4 py-5 first:pt-0 last:pb-0">
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-xs text-subtle">Item #{index + 1}</span>
                                <Button
                                    variant="danger"
                                    size="icon-sm"
                                    onClick={() => removeSkill(index)}
                                    aria-label={`Remove item ${index + 1}`}
                                    title="Remove"
                                >
                                    <Trash2 />
                                </Button>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <Field label="Title" htmlFor={`skill-${field.id}-title`}>
                                    <Input id={`skill-${field.id}-title`} {...register(`mainSkills.${index}.title`)} placeholder="Title" />
                                </Field>
                                <Field label="Icon" htmlFor={`skill-${field.id}-icon`}>
                                    <Select id={`skill-${field.id}-icon`} {...register(`mainSkills.${index}.icon`)}>
                                        {iconOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                    </Select>
                                </Field>
                            </div>
                            <Field label="Description" htmlFor={`skill-${field.id}-description`}>
                                <Textarea id={`skill-${field.id}-description`} {...register(`mainSkills.${index}.description`)} placeholder="Description" rows={2} />
                            </Field>
                            <Field label="Tags" htmlFor={`skill-${field.id}-tags`}>
                                <Input id={`skill-${field.id}-tags`} {...register(`mainSkills.${index}.tags`)} placeholder="Tags (comma separated)" />
                            </Field>
                        </div>
                    ))}
                </div>
            )}
        </SectionCard>
    );
}
