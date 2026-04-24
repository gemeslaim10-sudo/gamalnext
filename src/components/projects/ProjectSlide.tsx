import Link from "next/link";
import Image from "next/image";
import { Code2, ExternalLink, MoveRight } from "lucide-react";
import { slugify } from "@/lib/utils";

interface ProjectSlideProps {
    project: any;
}

export function ProjectSlide({ project }: ProjectSlideProps) {
    const tags = project.tags?.split(',').map((t: string) => t.trim()) || [];
    const projectSlug = slugify(project.title || '');
    const detailsUrl = `/projects/${projectSlug}`;

    return (
        <div className="group h-full flex flex-col bg-[#0f172a]/60 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border border-slate-800/50 hover:border-blue-500/30 transition-all duration-500 shadow-2xl hover:shadow-blue-500/10 relative">
            {/* Full Card Clickable Link */}
            <Link href={detailsUrl} className="absolute inset-0 z-10" aria-label={`View details for ${project.title}`} />

            <div className="h-64 overflow-hidden relative shrink-0">
                {project.image ? (
                    <Image
                        src={project.image}
                        alt={project.title}
                        width={800}
                        height={600}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 grayscale-[40%] group-hover:grayscale-0"
                    />
                ) : (
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                        <Code2 className="w-16 h-16 text-slate-800" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/20 to-transparent"></div>
                <div className="absolute top-5 right-5">
                    <div className="bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-xl uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        FEATURED
                    </div>
                </div>
            </div>

            <div className="p-8 flex flex-col flex-grow text-left relative z-20 pointer-events-none">
                <div className="flex gap-2 flex-wrap mb-4">
                    {tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="text-[10px] font-bold text-blue-400/80 uppercase tracking-wider">{tag}</span>
                    ))}
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-1">{project.title}</h3>
                
                <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-8 opacity-80 group-hover:opacity-100 transition-opacity">
                    {project.description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-slate-800/50 mt-auto pointer-events-none">
                    {project.link ? (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-500 font-bold text-sm tracking-tight group/link pointer-events-auto relative z-30">
                            Live Project
                            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center group-hover/link:bg-blue-500 group-hover/link:text-white transition-all">
                                <ExternalLink className="w-4 h-4" />
                            </div>
                        </a>
                    ) : (
                        <span className="flex items-center gap-2 text-slate-500 font-bold text-sm tracking-tight">
                            View Details
                            <div className="w-8 h-8 rounded-full bg-slate-800/50 flex items-center justify-center">
                                <MoveRight className="w-4 h-4" />
                            </div>
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
