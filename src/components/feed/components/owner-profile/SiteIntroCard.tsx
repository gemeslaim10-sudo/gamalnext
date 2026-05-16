import { Globe, Terminal, Activity } from "lucide-react";

interface SiteIntroCardProps {
    siteName: string;
    siteDescription: string;
}

export function SiteIntroCard({ siteName, siteDescription }: SiteIntroCardProps) {
    return (
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none transition-all group-hover:bg-blue-500/20" />
            
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/20 shadow-inner">
                        <Globe className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="font-black text-white tracking-wide">{siteName}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">All Systems Operational</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <p className="text-slate-400 text-xs leading-relaxed mb-4 relative z-10 font-medium">
                {siteDescription}
            </p>

            <div className="grid grid-cols-2 gap-2 relative z-10">
                <div className="bg-slate-950/50 rounded-xl p-2.5 border border-slate-800/50 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-slate-500" />
                    <div className="flex flex-col">
                        <span className="text-white text-xs font-bold">15+</span>
                        <span className="text-slate-500 text-[9px] uppercase">Tools</span>
                    </div>
                </div>
                <div className="bg-slate-950/50 rounded-xl p-2.5 border border-slate-800/50 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-slate-500" />
                    <div className="flex flex-col">
                        <span className="text-white text-xs font-bold">24/7</span>
                        <span className="text-slate-500 text-[9px] uppercase">Uptime</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
