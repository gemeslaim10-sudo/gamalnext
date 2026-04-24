import Image from "next/image";
import { ExternalLink, Pencil, ToggleRight, ToggleLeft, Trash2 } from "lucide-react";
import type { Ad } from "../types";

interface AdCardProps {
    ad: Ad;
    openEdit: (ad: Ad) => void;
    handleToggle: (id: string, current: boolean) => void;
    handleDelete: (id: string) => void;
}

export function AdCard({
    ad,
    openEdit,
    handleToggle,
    handleDelete
}: AdCardProps) {
    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden flex flex-col sm:flex-row gap-0">
            {/* Thumbnail */}
            {ad.imageUrl && (
                <div className="relative w-full sm:w-48 h-36 shrink-0 bg-slate-800">
                    <Image src={ad.imageUrl} alt={ad.title} fill className="object-cover" />
                </div>
            )}
            <div className="flex-1 p-5 flex flex-col justify-between gap-3">
                <div>
                    <div className="flex items-start justify-between gap-4">
                        <h3 className="font-bold text-white text-lg" dir="auto">{ad.title}</h3>
                        <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${ad.active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-700 text-slate-400'}`}>
                                {ad.active ? "Active" : "Inactive"}
                            </span>
                            {ad.showInSidebar && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">📌 Sidebar</span>
                            )}
                            {ad.showInFeed && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">📰 In-Feed</span>
                            )}
                        </div>
                    </div>
                    <p className="text-slate-400 text-sm mt-1 line-clamp-2" dir="auto">{ad.description}</p>
                    {ad.whatsappMessage && (
                        <div className="mt-2 flex items-start gap-2 text-xs text-slate-500 bg-slate-800/50 rounded-lg px-3 py-2">
                            <ExternalLink className="w-3 h-3 mt-0.5 shrink-0" />
                            <span dir="auto">{ad.whatsappMessage}</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        onClick={() => openEdit(ad)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-colors"
                    >
                        <Pencil className="w-4 h-4" /> تعديل
                    </button>
                    <button
                        onClick={() => handleToggle(ad.id, ad.active)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${ad.active ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'}`}
                    >
                        {ad.active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                        {ad.active ? "إيقاف" : "تفعيل"}
                    </button>
                    <button
                        onClick={() => handleDelete(ad.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" /> حذف
                    </button>
                </div>
            </div>
        </div>
    );
}
