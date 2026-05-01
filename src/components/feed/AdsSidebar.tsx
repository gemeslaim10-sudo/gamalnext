"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import { MessageCircle, Zap } from "lucide-react";
import { textDirStyle } from "@/lib/utils";

interface Ad {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    whatsappMessage: string;
    whatsappNumber: string;
    active: boolean;
    showInSidebar?: boolean;
}

export default function AdsSidebar() {
    const [ads, setAds] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAds = async () => {
            try {
                // Fetch all active ads, then filter showInSidebar client-side
                // (old ads without the field default to visible in sidebar)
                const snap = await getDocs(
                    query(collection(db, "ads"), where("active", "==", true))
                );
                const all = snap.docs.map(d => ({ id: d.id, ...d.data() } as Ad));
                // Show if showInSidebar is true OR field doesn't exist (old ads)
                const sidebarAds = all.filter(ad => ad.showInSidebar !== false);
                setAds(sidebarAds);
            } catch (e) {
                console.error("Failed to load ads", e);
            } finally {
                setLoading(false);
            }
        };
        fetchAds();
    }, []);

    if (loading) {
        return (
            <aside className="w-full space-y-4">
                {[1, 2].map(n => (
                    <div key={n} className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden animate-pulse">
                        <div className="h-36 bg-slate-800" />
                        <div className="p-4 space-y-2">
                            <div className="h-4 bg-slate-800 rounded w-3/4" />
                            <div className="h-3 bg-slate-800/60 rounded w-full" />
                            <div className="h-3 bg-slate-800/60 rounded w-2/3" />
                        </div>
                    </div>
                ))}
            </aside>
        );
    }

    if (ads.length === 0) return null;

    return (
        <aside className="w-full space-y-4">
            {/* Section Label */}
            <div className="flex items-center gap-2 px-1">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sponsored</span>
            </div>

            {ads.map((ad, index) => {
                const waUrl = `https://wa.me/${ad.whatsappNumber || "201024531452"}?text=${encodeURIComponent(ad.whatsappMessage || "")}`;

                return (
                    <div
                        key={ad.id}
                        className="group bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-xl hover:border-white/10 hover:shadow-blue-500/5 transition-all duration-300"
                    >
                        {/* Ad Image */}
                        {ad.imageUrl && (
                            <div className="relative aspect-video w-full overflow-hidden">
                                <Image
                                    src={ad.imageUrl}
                                    alt={ad.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    sizes="320px"
                                    priority={index === 0}
                                />
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                                {/* Sponsored badge */}
                                <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/10 tracking-wider uppercase">
                                    Ad
                                </span>
                            </div>
                        )}

                        <div className="p-4 space-y-3">
                            {/* Title */}
                            <h3
                                className="font-bold text-white text-sm leading-snug"
                                style={textDirStyle(ad.title)}
                            >
                                {ad.title}
                            </h3>

                            {/* Description */}
                            <p
                                className="text-slate-400 text-xs leading-relaxed line-clamp-3"
                                style={textDirStyle(ad.description)}
                            >
                                {ad.description}
                            </p>

                            {/* WhatsApp CTA Button */}
                            <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-green-900/30"
                            >
                                <MessageCircle className="w-4 h-4" />
                                تواصل معنا الآن
                            </a>
                        </div>
                    </div>
                );
            })}
        </aside>
    );
}
