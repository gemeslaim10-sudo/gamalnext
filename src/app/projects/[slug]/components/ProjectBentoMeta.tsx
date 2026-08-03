import { Layers, MonitorPlay, ChevronRight, LayoutGrid } from "lucide-react";
import type { ProjectData } from "../types";

interface ProjectBentoMetaProps {
    project: ProjectData;
    tags: string[];
}

export default function ProjectBentoMeta({ project, tags }: ProjectBentoMetaProps) {
    return (
        <section className="relative z-10 px-6 max-w-7xl mx-auto mb-24 lg:mb-40">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {/* Tech Stack Bento */}
                <div className="md:col-span-2 bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 lg:p-12 hover:bg-slate-900/80 transition-colors shadow-2xl">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                            <Layers className="w-6 h-6 text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white tracking-tight">Technologies Used</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {tags.map((tag: string) => (
                            <span key={tag} className="bg-slate-950 text-slate-300 border border-slate-800 px-5 py-2.5 rounded-xl text-sm font-semibold tracking-wide shadow-inner">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Quick Info / Video Bento */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 lg:p-12 flex flex-col justify-center items-center text-center hover:bg-slate-900/80 transition-colors shadow-2xl">
                    {project.category === 'video' && project.videoUrl ? (
                        <>
                            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 mb-6">
                                <MonitorPlay className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white tracking-tight mb-4">Video Overview</h3>
                            <a href={project.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 font-bold transition-colors">
                                Watch Full Video <ChevronRight className="w-4 h-4" />
                            </a>
                        </>
                    ) : (
                        <>
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-6">
                                <LayoutGrid className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white tracking-tight mb-2">{project.category?.toUpperCase() || 'PROJECT'}</h3>
                            <p className="text-slate-500 text-sm">Category Focus</p>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
