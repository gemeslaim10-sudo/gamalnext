import { X, Plus, Pencil, Loader2 } from "lucide-react";
import { MultiImageUpload } from "@/components/admin/MultiImageUpload";
import type { Ad } from "../types";

interface AdFormProps {
    form: Omit<Ad, "id" | "createdAt">;
    setForm: React.Dispatch<React.SetStateAction<Omit<Ad, "id" | "createdAt">>>;
    editingId: string | null;
    saving: boolean;
    closeForm: () => void;
    handleSave: () => void;
}

export function AdForm({
    form,
    setForm,
    editingId,
    saving,
    closeForm,
    handleSave
}: AdFormProps) {
    return (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">
                    {editingId ? "✏️ تعديل الإعلان" : "إعلان جديد"}
                </h2>
                <button onClick={closeForm} className="text-slate-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Image Upload */}
            <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">صورة الإعلان</label>
                <MultiImageUpload
                    value={form.imageUrl ? [form.imageUrl] : []}
                    onChange={(urls) => setForm(f => ({ ...f, imageUrl: urls[0] || "" }))}
                    label="صورة الإعلان"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">العنوان *</label>
                    <input
                        value={form.title}
                        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                        placeholder="عنوان الإعلان..."
                        className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
                        dir="auto"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">رقم الواتساب (بدون +)</label>
                    <input
                        value={form.whatsappNumber}
                        onChange={e => setForm(f => ({ ...f, whatsappNumber: e.target.value }))}
                        placeholder="201024531452"
                        className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
                        dir="ltr"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">وصف الإعلان *</label>
                <textarea
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="اكتب تفاصيل العرض..."
                    rows={3}
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 resize-none"
                    dir="auto"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">رسالة الواتساب الجاهزة</label>
                <textarea
                    value={form.whatsappMessage}
                    onChange={e => setForm(f => ({ ...f, whatsappMessage: e.target.value }))}
                    placeholder="مرحباً، رأيت إعلانكم عن ... وأريد الاستفسار"
                    rows={2}
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 resize-none"
                    dir="auto"
                />
            </div>

            {/* Placement Checkboxes */}
            <div>
                <label className="block text-sm font-medium text-slate-400 mb-3">📍 مكان ظهور الإعلان *</label>
                <div className="flex flex-col sm:flex-row gap-3">
                    <label className={`flex items-center gap-3 flex-1 p-4 rounded-xl border cursor-pointer transition-all ${
                        form.showInSidebar
                            ? 'bg-blue-500/10 border-blue-500/50 text-blue-300'
                            : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}>
                        <input
                            type="checkbox"
                            checked={form.showInSidebar}
                            onChange={e => setForm(f => ({ ...f, showInSidebar: e.target.checked }))}
                            className="w-4 h-4 accent-blue-500"
                        />
                        <div>
                            <p className="font-semibold text-sm">📌 السايد بار</p>
                            <p className="text-xs opacity-70 mt-0.5">يظهر في العمود الجانبي بصفحة Explore</p>
                        </div>
                    </label>

                    <label className={`flex items-center gap-3 flex-1 p-4 rounded-xl border cursor-pointer transition-all ${
                        form.showInFeed
                            ? 'bg-purple-500/10 border-purple-500/50 text-purple-300'
                            : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}>
                        <input
                            type="checkbox"
                            checked={form.showInFeed}
                            onChange={e => setForm(f => ({ ...f, showInFeed: e.target.checked }))}
                            className="w-4 h-4 accent-purple-500"
                        />
                        <div>
                            <p className="font-semibold text-sm">📰 وسط المنشورات</p>
                            <p className="text-xs opacity-70 mt-0.5">يظهر بين المنشورات في الفيد</p>
                        </div>
                    </label>
                </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editingId ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {editingId ? "تحديث الإعلان" : "حفظ الإعلان"}
                </button>
                <button
                    onClick={closeForm}
                    className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors"
                >
                    إلغاء
                </button>
            </div>
        </div>
    );
}
