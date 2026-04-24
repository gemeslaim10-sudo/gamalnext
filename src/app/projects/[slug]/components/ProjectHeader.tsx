import Link from "next/link";
import { ArrowLeft, Sparkles, ExternalLink } from "lucide-react";
import type { ProjectData } from "../types";

interface ProjectHeaderProps {
    project: ProjectData;
}

export default function ProjectHeader({ project }: ProjectHeaderProps) {
    return (
        <section className="relative z-10 pt-32 pb-16 lg:pt-48 lg:pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
            <Link 
                href="/projects"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-all mb-12 group bg-slate-900/50 border border-white/5 hover:border-white/10 rounded-full px-5 py-2 text-sm backdrop-blur-md"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Portfolio
            </Link>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black tracking-widest uppercase mb-8 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                <Sparkles className="w-4 h-4" />
                {project.category || 'CASE STUDY'}
            </div>
            
            <h1 className="text-5xl sm:text-7xl lg:text-[6rem] font-black tracking-tighter leading-[1.1] mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-400 drop-shadow-sm max-w-5xl">
                {project.title || project.name}
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-slate-400 leading-relaxed max-w-3xl font-light mb-12">
                {project.description}
            </p>

            {project.link && (
                <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center justify-center gap-3 bg-white text-slate-950 px-8 py-4 rounded-full font-black text-sm lg:text-base tracking-wide uppercase overflow-hidden transition-transform hover:scale-105"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative z-10 flex items-center gap-2">
                        Launch Project <ExternalLink className="w-5 h-5" />
                    </span>
                </a>
            )}
        </section>
    );
}
