import { UseFormRegister } from "react-hook-form";
import { SettingsForm } from "../types";

interface PersonalSectionProps {
    register: UseFormRegister<SettingsForm>;
}

export function PersonalSection({ register }: PersonalSectionProps) {
    return (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-6">
            <h2 className="text-xl font-semibold text-white mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Owner Name</label>
                    <input {...register("ownerName")} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Job Title / Tagline</label>
                    <input {...register("ownerTitle")} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-400 mb-2">Biography</label>
                    <textarea {...register("ownerBio")} rows={3} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Company Role</label>
                    <input {...register("ownerRole")} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Location</label>
                    <input {...register("ownerLocation")} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
            </div>
        </div>
    );
}
