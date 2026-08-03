"use client";

import { Plus, MessageSquare } from "lucide-react";
import { useAdsManagement } from "./useAdsManagement";
import { AdForm } from "./components/AdForm";
import { AdCard } from "./components/AdCard";

export default function AdminAdsPage() {
    const {
        ads,
        loading,
        saving,
        form,
        setForm,
        showForm,
        setShowForm,
        editingId,
        openEdit,
        closeForm,
        handleSave,
        handleToggle,
        handleDelete
    } = useAdsManagement();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">إدارة الإعلانات</h1>
                    <p className="text-slate-400 text-sm mt-1">إعلانات تظهر في Sidebar أو وسط منشورات Explore</p>
                </div>
                <button
                    onClick={() => { closeForm(); setShowForm(v => !v); }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors font-medium"
                >
                    <Plus className="w-4 h-4" />
                    إعلان جديد
                </button>
            </div>

            {/* Create Form */}
            {showForm && (
                <AdForm
                    form={form}
                    setForm={setForm}
                    editingId={editingId}
                    saving={saving}
                    closeForm={closeForm}
                    handleSave={handleSave}
                />
            )}

            {/* Ads List */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin" />
                </div>
            ) : ads.length === 0 ? (
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
                    <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">لا توجد إعلانات حتى الآن</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {ads.map(ad => (
                        <AdCard
                            key={ad.id}
                            ad={ad}
                            openEdit={openEdit}
                            handleToggle={handleToggle}
                            handleDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
