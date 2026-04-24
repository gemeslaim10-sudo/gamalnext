import { Plus, Trash } from "lucide-react";
import { UseFormRegister } from "react-hook-form";
import { SkillsForm } from "../types";

interface TechStackSectionProps {
    techFields: Record<"id", string>[];
    appendTech: (value: any) => void;
    removeTech: (index: number) => void;
    register: UseFormRegister<SkillsForm>;
}

export function TechStackSection({ techFields, appendTech, removeTech, register }: TechStackSectionProps) {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Technical Skills (Progress)</h2>
                <button type="button" onClick={() => appendTech({ name: "", val: "50%" })} className="text-blue-400 flex gap-1 text-sm items-center"><Plus className="w-4 h-4" /> Add Skill</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {techFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-center">
                        <input {...register(`techStack.${index}.name`)} placeholder="Name (e.g React)" className="bg-slate-950 border border-slate-700 p-2 rounded text-white flex-1" />
                        <input {...register(`techStack.${index}.val`)} placeholder="90%" className="bg-slate-950 border border-slate-700 p-2 rounded text-white w-20" />
                        <button type="button" onClick={() => removeTech(index)} className="text-red-400"><Trash className="w-4 h-4" /></button>
                    </div>
                ))}
            </div>
        </div>
    );
}
