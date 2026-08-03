import { UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { SettingsForm } from "../types";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface BrandingSectionProps {
    register: UseFormRegister<SettingsForm>;
    watch: UseFormWatch<SettingsForm>;
    setValue: UseFormSetValue<SettingsForm>;
}

export function BrandingSection({ register, watch, setValue }: BrandingSectionProps) {
    const faviconUrl = watch("siteFavicon");

    return (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-6">
            <h2 className="text-xl font-semibold text-white mb-4">Branding & Identity</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Site Name</label>
                    <input
                        {...register("siteName")}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Site Logo (Optional)</label>
                    <ImageUpload
                        value={watch("siteLogo")}
                        onChange={(url) => setValue("siteLogo", url)}
                    />
                </div>

                {/* ── Favicon Field ───────────────────────────────────────── */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                        Site Favicon
                        <span className="ml-2 text-xs text-slate-500">(يظهر في تبويب المتصفح — يُنصح بصورة مربعة 32×32 أو 64×64)</span>
                    </label>
                    <div className="flex items-center gap-4">
                        {/* Live preview */}
                        <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                            {faviconUrl ? (
                                <img
                                    src={faviconUrl}
                                    alt="Favicon preview"
                                    className="w-8 h-8 object-contain"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                            ) : (
                                <span className="text-slate-600 text-xs text-center leading-tight">No<br/>Icon</span>
                            )}
                        </div>
                        <div className="flex-1">
                            <ImageUpload
                                value={faviconUrl}
                                onChange={(url) => setValue("siteFavicon", url)}
                            />
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-400 mb-2">Site Description</label>
                    <textarea
                        {...register("siteDescription")}
                        rows={2}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>
        </div>
    );
}
