import Image from "next/image";
import { User, Calendar } from "lucide-react";
import { getIconForType, getLabelForType } from "../helpers";
import type { FeedItem } from "../types";

interface FeedPostHeaderProps {
    item: FeedItem;
    siteLogo?: string;
    siteName?: string;
}

export function FeedPostHeader({ item, siteLogo, siteName }: FeedPostHeaderProps) {
    return (
        <div className="p-4 sm:p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 shrink-0 border-2 border-slate-700/50 relative flex items-center justify-center">
                    {siteLogo ? (
                        <Image src={siteLogo} alt={siteName || "Gamal Tech"} fill sizes="40px" className="object-cover" />
                    ) : (
                        <User className="w-6 h-6 text-slate-400" />
                    )}
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white">{item.author || "Gamal Abdelaty"}</h3>
                        <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800/50 border border-slate-700 text-[10px] font-semibold tracking-wider uppercase text-slate-300">
                            {getIconForType(item.type)}
                            {getLabelForType(item.type)}
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                </div>
            </div>
        </div>
    );
}
