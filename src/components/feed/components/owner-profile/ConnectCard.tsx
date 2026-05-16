import { Github, Linkedin, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface ConnectCardProps {
    github: string;
    linkedin: string;
}

export function ConnectCard({ github, linkedin }: ConnectCardProps) {
    if (!github && !linkedin) return null;

    return (
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
            <h3 className="font-bold text-white text-sm mb-4">Connect With Me</h3>
            <div className="flex flex-col gap-3">
                {github && (
                    <Link href={github} target="_blank" className="group flex items-center justify-between p-3 bg-slate-950/50 hover:bg-slate-800 rounded-xl transition-all border border-slate-800/80 hover:border-slate-600 shadow-inner">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-slate-800 rounded-md group-hover:bg-slate-700 transition-colors">
                                <Github className="w-4 h-4 text-slate-300 group-hover:text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-white leading-none">GitHub</span>
                                <span className="text-[10px] text-slate-500 mt-1">Open Source Projects</span>
                            </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                )}
                {linkedin && (
                    <Link href={linkedin} target="_blank" className="group flex items-center justify-between p-3 bg-slate-950/50 hover:bg-[#0A66C2]/10 rounded-xl transition-all border border-slate-800/80 hover:border-[#0A66C2]/30 shadow-inner">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-slate-800 rounded-md group-hover:bg-[#0A66C2] transition-colors">
                                <Linkedin className="w-4 h-4 text-slate-300 group-hover:text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-white leading-none">LinkedIn</span>
                                <span className="text-[10px] text-slate-500 mt-1 group-hover:text-blue-200/70">Professional Network</span>
                            </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-[#0A66C2] transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                )}
            </div>
        </div>
    );
}
