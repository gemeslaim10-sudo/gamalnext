import { UseFormRegister } from "react-hook-form";
import { SettingsForm } from "../types";

interface ContactSectionProps {
    register: UseFormRegister<SettingsForm>;
}

export function ContactSection({ register }: ContactSectionProps) {
    return (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-6">
            <h2 className="text-xl font-semibold text-white mb-4">Social Media & Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">GitHub URL</label>
                    <input {...register("githubUrl")} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">LinkedIn URL</label>
                    <input {...register("linkedinUrl")} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                    <input {...register("emailAddress")} type="email" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Phone Number</label>
                    <input {...register("phoneDisplay")} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">WhatsApp Number</label>
                    <input {...register("whatsappNumber")} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
            </div>
        </div>
    );
}
