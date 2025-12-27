'use client';
import { ExternalLink, FolderGit2 } from 'lucide-react';
import Image from 'next/image';
import Reveal from './Reveal';
import { useContent } from '@/hooks/useContent';

const defaultProjectsData = {
    items: [
        {
            title: 'Art Vision Portfolio',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
            tags: 'React, Netlify, Dashboard',
            link: 'https://artvisionviewportfolio.netlify.app/'
        },
        {
            title: 'Noorva Store',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
            tags: 'E-commerce, Supabase, React',
            link: 'https://noorvastore.netlify.app/'
        },
        {
            title: 'Zakaryia Law Firm',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
            tags: 'Corporate, CMS, Dynamic',
            link: 'https://zakaryialawfirm.netlify.app/'
        },
        {
            title: 'Framez Vision',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
            tags: 'Cloudflare, Media, Animation',
            link: 'https://framezvision.pages.dev/'
        }
    ]
};

export default function Projects({ initialData }: { initialData?: any }) {
    const { data } = useContent("site_content", "projects", defaultProjectsData);
    const projects = initialData || data || defaultProjectsData;

    return (
        <section id="projects" className="py-16 md:py-20 bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <Reveal className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white">
                        أحدث <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">المشاريع</span>
                    </h2>
                    <p className="text-slate-400 mt-4 text-sm md:text-base">جميع المشاريع تتضمن لوحة تحكم (Dashboard) كاملة</p>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                    {projects.items?.map((project: any, index: number) => {
                        const tags = project.tags.split(',').map((t: string) => t.trim());
                        return (
                            <Reveal key={index} className={`stagger-${(index % 4) + 1} glass-card group relative rounded-3xl overflow-hidden hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] transition-all duration-500`}>
                                <div className="h-56 sm:h-64 md:h-72 overflow-hidden relative">
                                    {project.image ? (
                                        <Image
                                            src={project.image}
                                            alt={project.title}
                                            width={800}
                                            height={600}
                                            className="w-full h-full object-cover transform group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-800 flex items-center justify-center relative">
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-purple-900/40"></div>
                                            <div className="text-slate-600 font-bold text-lg z-10 flex flex-col items-center gap-2">
                                                <FolderGit2 className="w-10 h-10 opacity-50" />
                                                <span>No Preview</span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-75"></div>

                                    {/* Overlay Link Icon */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                                        <a href={project.link} target="_blank" className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-full text-white hover:bg-blue-600 hover:border-blue-500 transition-all transform translate-y-4 group-hover:translate-y-0">
                                            <ExternalLink className="w-8 h-8" />
                                        </a>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 w-full p-6 sm:p-8 z-10">
                                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{project.title}</h3>
                                    <div className="flex gap-2 mb-4 flex-wrap">
                                        {tags.map((tag: string) => (
                                            <span key={tag} className="text-xs bg-white/5 border border-white/10 text-slate-300 px-3 py-1.5 rounded-full backdrop-blur-md group-hover:border-blue-500/30 group-hover:bg-blue-500/10 group-hover:text-blue-200 transition-colors">{tag}</span>
                                        ))}
                                    </div>
                                    {/* Decoration Line */}
                                    <div className="w-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full group-hover:w-full transition-all duration-700 delay-100"></div>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
