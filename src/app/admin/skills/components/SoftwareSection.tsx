import { Plus, Trash } from "lucide-react";
import { UseFormRegister } from "react-hook-form";
import { SkillsForm } from "../types";

interface SoftwareSectionProps {
    softFields: Record<"id", string>[];
    appendSoft: (value: any) => void;
    removeSoft: (index: number) => void;
    register: UseFormRegister<SkillsForm>;
}

export function SoftwareSection({ softFields, appendSoft, removeSoft, register }: SoftwareSectionProps) {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Software Proficiency</h2>
                <button type="button" onClick={() => appendSoft({ name: "", level: "متقدم", color: "text-green-400" })} className="text-blue-400 flex gap-1 text-sm items-center"><Plus className="w-4 h-4" /> Add Tool</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {softFields.map((field, index) => (
                    <div key={field.id} className="bg-slate-950 p-3 rounded border border-slate-700 space-y-2 relative">
                        <button type="button" onClick={() => removeSoft(index)} className="absolute top-2 right-2 text-red-400"><Trash className="w-3 h-3" /></button>
                        <input {...register(`software.${index}.name`)} placeholder="Tool Name" className="bg-slate-900 border border-slate-700 p-1 rounded text-white w-full text-sm" />
                        <input {...register(`software.${index}.level`)} placeholder="Level (Arabic)" className="bg-slate-900 border border-slate-700 p-1 rounded text-white w-full text-sm" />
                        <select {...register(`software.${index}.color`)} className="bg-slate-900 border border-slate-700 p-1 rounded text-white w-full text-sm">
                            <option value="text-green-400">Green (Professional)</option>
                            <option value="text-yellow-400">Yellow (Medium)</option>
                            <option value="text-slate-400">Gray (Beginner)</option>
                        </select>
                    </div>
                ))}
            </div>
        </div>
    );
}
