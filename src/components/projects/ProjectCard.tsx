'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ExternalLink, ArrowUpRight } from 'lucide-react';
import { slugify } from '@/lib/utils';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800';

type Project = {
    title: string;
    image?: string;
    tags: string;
    link: string;
    description?: string;
}

interface ProjectCardProps {
    project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
    const tags = project.tags ? project.tags.split(',').map(t => t.trim()) : [];
    const imageSrc = project.image || DEFAULT_IMAGE;
    const projectSlug = slugify(project.title);
    const detailsUrl = `/projects/${projectSlug}`;

    return (
        <div className="group relative rounded-3xl overflow-hidden flex flex-col bg-[#0b1121]/80 backdrop-blur-xl border border-white/5 hover:border-blue-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.2)]">
            
            {/* Full Card Clickable Link */}
            <Link href={detailsUrl} className="absolute inset-0 z-10" aria-label={`View details for ${project.title}`} />

            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />

            {/* Image Container */}
            <div className="relative h-[220px] sm:h-[240px] lg:h-[280px] w-full overflow-hidden block">
                <Image
                    src={imageSrc}
                    alt={project.title}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Gradient Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1121] via-[#0b1121]/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500" />

                {/* Badge */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/10 backdrop-blur-md border border-white/10 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transform -translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100 z-20">
                    <Sparkles className="w-3 h-3 text-blue-400" />
                    <span className="tracking-wider">FEATURED</span>
                </div>
            </div>

            {/* Hover Center Button - External Link */}
            {project.link && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none z-30">
                    <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600/90 hover:bg-blue-500 backdrop-blur-md p-3 sm:p-4 rounded-full text-white transition-all transform scale-50 group-hover:scale-100 shadow-[0_0_30px_rgba(37,99,235,0.4)] pointer-events-auto"
                        title="Visit External Project Link"
                    >
                        <ExternalLink className="w-5 h-5 sm:w-6 sm:h-6" />
                    </a>
                </div>
            )}

            {/* Content Section */}
            <div className="relative p-3 sm:p-6 lg:p-8 flex flex-col flex-grow -mt-4 sm:-mt-6 z-20 pointer-events-none">
                {/* Decorative glowing line */}
                <div className="absolute top-0 left-3 right-3 sm:left-8 sm:right-8 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="flex justify-between items-start mb-2 sm:mb-4 gap-2 sm:gap-4">
                    <div className="flex-1">
                        <h3 className="text-sm sm:text-xl lg:text-2xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300 leading-tight line-clamp-1 sm:line-clamp-2">
                            {project.title}
                        </h3>
                    </div>
                    {project.link && (
                        <a 
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 w-7 h-7 sm:w-10 sm:h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-500 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 pointer-events-auto relative z-30"
                            title="Visit External Project Link"
                        >
                            <ArrowUpRight className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                        </a>
                    )}
                </div>

                {project.description && (
                    <p className="text-slate-400 text-[11px] sm:text-sm leading-relaxed mb-3 sm:mb-6 line-clamp-1 sm:line-clamp-2">
                        {project.description}
                    </p>
                )}

                {/* Tags */}
                <div className="mt-auto flex flex-wrap gap-1.5 sm:gap-2">
                    {tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="text-[9px] sm:text-[11px] font-medium tracking-wide bg-slate-800/50 text-slate-300 border border-slate-700/50 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full group-hover:bg-blue-500/10 group-hover:text-blue-300 group-hover:border-blue-500/20 transition-all duration-300 whitespace-nowrap"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
