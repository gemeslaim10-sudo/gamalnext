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
        <div className="p-3 sm:p-6 flex items-start sm:items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-slate-800 shrink-0 border-2 border-slate-700/50 relative flex items-center justify-center">
                    {siteLogo ? (
                        <Image src={siteLogo} alt={siteName || "Gamal Tech"} fill sizes="(max-width: 640px) 40px, 48px" className="object-cover" />
                    ) : (
                        <User className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <h3 className="font-bold text-white text-sm sm:text-base leading-tight truncate max-w-[140px] sm:max-w-none">{item.author || "Gamal Abdelaty"}</h3>
                        <span className="hidden sm:block w-1 h-1 rounded-full bg-slate-600 shrink-0"></span>
                        <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-800/50 border border-slate-700 text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase text-slate-300 shrink-0 mt-0.5 sm:mt-0">
                            {getIconForType(item.type)}
                            <span className="hidden sm:inline">{getLabelForType(item.type)}</span>
                            <span className="sm:hidden text-[8px]">{getLabelForType(item.type).split(' ')[0]}</span>
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
