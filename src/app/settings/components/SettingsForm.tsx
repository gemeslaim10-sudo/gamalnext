import { User, Briefcase, MapPin, Heart, Loader2, Save } from "lucide-react";
import type { SettingsFormData } from "../useSettings";

interface SettingsFormProps {
    formData: SettingsFormData;
    setFormData: React.Dispatch<React.SetStateAction<SettingsFormData>>;
    saving: boolean;
    handleSubmit: (e: React.FormEvent) => void;
}

export function SettingsForm({
    formData,
    setFormData,
    saving,
    handleSubmit
}: SettingsFormProps) {
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="text-slate-400 text-sm font-medium flex items-center gap-2">
                    <User className="w-4 h-4" /> الاسم الكامل
                </label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
            </div>

            <div className="space-y-2">
                <label className="text-slate-400 text-sm font-medium flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> المسمى الوظيفي
                </label>
                <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
                    placeholder="مثال: مطور ويب, مصمم جرافيك"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
            </div>

            <div className="space-y-2">
                <label className="text-slate-400 text-sm font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> الموقع / الإقامة
                </label>
                <input
                    type="text"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    placeholder="القاهرة، مصر"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
            </div>

            <div className="space-y-2">
                <label className="text-slate-400 text-sm font-medium flex items-center gap-2">
                    <Heart className="w-4 h-4" /> الحالة الاجتماعية
                </label>
                <div className="grid grid-cols-2 gap-4">
                    <select
                        value={formData.socialStatus}
                        onChange={e => setFormData({ ...formData, socialStatus: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    >
                        <option value="Single">أعزب/عزباء</option>
                        <option value="Engaged">مخطوب/ة</option>
                        <option value="Married">متزوج/ة</option>
                        <option value="Complicated">وضع معقد😅</option>
                    </select>
                    <select
                        value={formData.gender}
                        onChange={e => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    >
                        <option value="Male">ذكر</option>
                        <option value="Female">أنثى</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-slate-400 text-sm font-medium">نبذة شخصية (Bio)</label>
                <textarea
                    value={formData.bio}
                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    placeholder="اكتب نبذة مختصرة عن نفسك..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                />
            </div>

            <button
                type="submit"
                disabled={saving}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> حفظ التغييرات</>}
            </button>
        </form>
    );
}
