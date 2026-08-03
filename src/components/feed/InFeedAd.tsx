"use client";

import Image from "next/image";
import { MessageCircle, Zap } from "lucide-react";
import { textDirStyle } from "@/lib/utils";

interface InFeedAdProps {
    title: string;
    description: string;
    imageUrl: string;
    whatsappMessage: string;
    whatsappNumber: string;
}

export default function InFeedAd({ title, description, imageUrl, whatsappMessage, whatsappNumber }: InFeedAdProps) {
    const waUrl = `https://wa.me/${whatsappNumber || "201024531452"}?text=${encodeURIComponent(whatsappMessage || "")}`;

    return (
        <div className="relative bg-gradient-to-br from-slate-900/80 to-purple-900/20 border border-purple-500/20 rounded-[2rem] overflow-hidden shadow-2xl">
            {/* Sponsored label */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur-md text-amber-400 text-[10px] font-bold px-3 py-1 rounded-full border border-amber-500/20 uppercase tracking-widest">
                <Zap className="w-3 h-3" />
                Sponsored
            </div>

            {/* Image */}
            {imageUrl && (
                <div className="relative aspect-[16/7] w-full overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 672px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                </div>
            )}

            <div className="p-5 space-y-3">
                <h3
                    className="font-black text-white text-xl leading-snug"
                    style={textDirStyle(title)}
                >
                    {title}
                </h3>
                <p
                    className="text-slate-300 text-sm leading-relaxed"
                    style={textDirStyle(description)}
                >
                    {description}
                </p>
                <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-green-900/30"
                >
                    <MessageCircle className="w-5 h-5" />
                    تواصل معنا الآن
                </a>
            </div>
        </div>
    );
}
