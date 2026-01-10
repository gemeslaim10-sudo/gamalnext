'use client';

import Image from 'next/image';
import { Sparkles, ExternalLink, ArrowRight } from 'lucide-react';

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

    return (
        <div className="group relative rounded-3xl overflow-hidden min-h-[550px] md:min-h-[600px] flex flex-col bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-2xl hover:shadow-[0_0_80px_rgba(168,85,247,0.5)] transition-all duration-700">
            {/* Image Section */}
            <div className="h-[300px] md:h-[350px] overflow-hidden relative">
                <Image
                    src={imageSrc}
                    alt={project.title}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>

                {/* Floating Badge */}
                <div className="absolute top-6 right-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg backdrop-blur-sm flex items-center gap-2 animate-pulse">
                    <Sparkles className="w-4 h-4" />
                    مميز
                </div>

                {/* Hover Overlay Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-slate-900/20">
                    <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 p-5 rounded-full text-white transition-all transform scale-0 group-hover:scale-100 shadow-2xl shadow-purple-500/50"
                    >
                        <ExternalLink className="w-7 h-7" />
                    </a>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-8 flex flex-col h-[300px]">
                {/* Decorative Line */}
                <div className="w-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full mb-6 group-hover:w-full transition-all duration-700"></div>

                <h3 className="text-3xl md:text-4xl font-black text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all leading-tight text-right">
                    {project.title}
                </h3>

                {project.description && (
                    <p className="text-slate-400 text-base mb-6 leading-relaxed line-clamp-2 text-right">
                        {project.description}
                    </p>
                )}

                {/* Tags */}
                <div className="flex gap-2 flex-wrap mb-6 justify-end">
                    {tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="text-xs bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600/50 text-slate-300 px-4 py-2 rounded-full group-hover:from-purple-500/20 group-hover:to-pink-500/20 group-hover:border-purple-500/30 group-hover:text-purple-300 transition-all duration-300 font-semibold"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Link Button */}
                <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center justify-center gap-2 text-purple-400 hover:text-purple-300 font-bold text-sm group-hover:gap-3 transition-all"
                >
                    <ArrowRight className="w-5 h-5 rotate-180" />
                    <span>استكشف المشروع</span>
                </a>
            </div>
        </div>
    );
}
