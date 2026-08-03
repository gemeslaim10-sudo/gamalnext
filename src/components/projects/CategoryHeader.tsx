import { MoveRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface CategoryHeaderProps {
    icon: LucideIcon;
    title: string;
    subtitle: string;
}

export function CategoryHeader({ icon: Icon, title, subtitle }: CategoryHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-10 border-b border-slate-800/50 pb-6">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                    <Icon className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                    <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">{title}</h3>
                    <p className="text-slate-500 text-sm mt-1">{subtitle}</p>
                </div>
            </div>
            <div className="hidden md:flex gap-2">
                <div className={`swiper-button-prev-${title.replace(/\s+/g, '')} w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-all cursor-pointer`}>
                    <MoveRight className="w-5 h-5 rotate-180" />
                </div>
                <div className={`swiper-button-next-${title.replace(/\s+/g, '')} w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-all cursor-pointer`}>
                    <MoveRight className="w-5 h-5" />
                </div>
            </div>
        </div>
    );
}
