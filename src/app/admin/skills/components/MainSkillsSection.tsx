import { Plus, Trash, Code, Database, BarChart, FileText } from "lucide-react";
import { UseFormRegister } from "react-hook-form";
import { SkillsForm } from "../types";

export const iconOptions = [
    { value: 'Code', label: 'Code (Web)', icon: Code },
    { value: 'Database', label: 'Database', icon: Database },
    { value: 'BarChart', label: 'Analysis', icon: BarChart },
    { value: 'FileText', label: 'Content', icon: FileText },
];

interface MainSkillsSectionProps {
    skillFields: Record<"id", string>[];
    appendSkill: (value: any) => void;
    removeSkill: (index: number) => void;
    register: UseFormRegister<SkillsForm>;
}

export function MainSkillsSection({ skillFields, appendSkill, removeSkill, register }: MainSkillsSectionProps) {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Main Services Items</h2>
                <button type="button" onClick={() => appendSkill({ title: "", description: "", tags: "", icon: "Code" })} className="text-blue-400 flex gap-1 text-sm items-center"><Plus className="w-4 h-4" /> Add Item</button>
            </div>
            <div className="space-y-6">
                {skillFields.map((field, index) => (
                    <div key={field.id} className="p-4 bg-slate-950 rounded-lg border border-slate-800 grid gap-4">
                        <div className="flex justify-between">
                            <span className="text-slate-500 text-sm">Item #{index + 1}</span>
                            <button type="button" onClick={() => removeSkill(index)} className="text-red-400"><Trash className="w-4 h-4" /></button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input {...register(`mainSkills.${index}.title`)} placeholder="Title" className="bg-slate-900 border border-slate-700 p-2 rounded text-white" />
                            <select {...register(`mainSkills.${index}.icon`)} className="bg-slate-900 border border-slate-700 p-2 rounded text-white">
                                {iconOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                        </div>
                        <textarea {...register(`mainSkills.${index}.description`)} placeholder="Description" className="bg-slate-900 border border-slate-700 p-2 rounded text-white w-full" rows={2} />
                        <input {...register(`mainSkills.${index}.tags`)} placeholder="Tags (comma separated)" className="bg-slate-900 border border-slate-700 p-2 rounded text-white w-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}
