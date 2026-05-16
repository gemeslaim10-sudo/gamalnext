import Image from "next/image";
import { User, CheckCircle2, Code2, Cpu, Zap } from "lucide-react";

interface OwnerDetailsCardProps {
    name: string;
    avatar: string;
    title: string;
    bio: string;
}

export function OwnerDetailsCard({ name, avatar, title, bio }: OwnerDetailsCardProps) {
    return (
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-5 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5 pointer-events-none" />
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transform group-hover:scale-110 transition-transform duration-700">
                <User className="w-32 h-32" />
            </div>
            
            <div className="flex items-center gap-4 mb-5 relative z-10">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-slate-700 shrink-0 shadow-xl group-hover:border-emerald-500/50 transition-colors bg-black flex items-center justify-center">
                    {avatar ? (
                        <Image
                            src={avatar}
                            alt={name}
                            fill
                            sizes="56px"
                            className="object-contain"
                        />
                    ) : (
                        <User className="w-7 h-7 text-slate-400" />
                    )}
                </div>
                <div>
                    <div className="flex items-center gap-1.5">
                        <h2 className="text-base font-black text-white leading-tight">{name}</h2>
                        <CheckCircle2 className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider mt-1 bg-emerald-500/10 inline-block px-2 py-0.5 rounded-md border border-emerald-500/20">
                        {title}
                    </p>
                </div>
            </div>
            
            <p className="text-slate-300 text-xs leading-relaxed relative z-10 mb-4 font-medium">
                {bio}
            </p>

            {/* Tech Stack Badges */}
            <div className="flex flex-wrap gap-1.5 relative z-10">
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-300 bg-slate-800 px-2 py-1 rounded-md border border-slate-700">
                    <Code2 className="w-3 h-3 text-blue-400" /> React & Next.js
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-300 bg-slate-800 px-2 py-1 rounded-md border border-slate-700">
                    <Cpu className="w-3 h-3 text-purple-400" /> AI Integration
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-300 bg-slate-800 px-2 py-1 rounded-md border border-slate-700">
                    <Zap className="w-3 h-3 text-amber-400" /> Performance
                </span>
            </div>
        </div>
    );
}
