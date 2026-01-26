'use client';
import { ExternalLink, FolderGit2, Code2, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Reveal from '../sections/Reveal';
import { useContent } from '@/hooks/useContent';

const defaultProjectsData = {
    items: [
        {
            title: 'Art Vision Portfolio',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
            tags: 'React, Netlify, Dashboard',
            link: 'https://artvisionviewportfolio.netlify.app/',
            description: 'منصة احترافية لعرض الأعمال الفنية'
        },
        {
            title: 'Noorva Store',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
            tags: 'E-commerce, Supabase, React',
            link: 'https://noorvastore.netlify.app/',
            description: 'متجر إلكتروني متكامل مع نظام إدارة متقدم'
        },
        {
            title: 'Zakaryia Law Firm',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
            tags: 'Corporate, CMS, Dynamic',
            link: 'https://zakaryialawfirm.netlify.app/',
            description: 'موقع مؤسسي ديناميكي بنظام إدارة محتوى'
        },
        {
            title: 'Framez Vision',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
            tags: 'Cloudflare, Media, Animation',
            link: 'https://framezvision.pages.dev/',
            description: 'منصة إعلامية تفاعلية مع تأثيرات بصرية متطورة'
        }
    ]
};

export default function Projects({ initialData }: { initialData?: any }) {
    const { data } = useContent("site_content", "projects", defaultProjectsData);
    const projects = initialData || data || defaultProjectsData;

    return (
        <section id="projects" className="py-20 md:py-28 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <Reveal className="text-center mb-16 md:mb-20">
                    <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 text-sm font-semibold">معرض الأعمال</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        أحدث <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">الإنجازات التقنية</span>
                    </h2>
                    <p className="text-slate-400 mt-4 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                        كافة الأنظمة المطورة مزودة بلوحات تحكم إدارية متكاملة وتقنيات حديثة
                    </p>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    {projects.items?.map((project: any, index: number) => {
                        const tags = project.tags.split(',').map((t: string) => t.trim());
                        return (
                            <Reveal key={index} className={`stagger-${(index % 4) + 1}`}>
                                <div className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_0_60px_rgba(59,130,246,0.3)] hover:-translate-y-2 backdrop-blur-sm">
                                    {/* Image Container */}
                                    <div className="h-64 md:h-80 overflow-hidden relative">
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
                                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-purple-600/30 to-pink-600/30"></div>
                                                <div className="absolute inset-0 opacity-20">
                                                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
                                                    <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-blue-300 rounded-full blur-3xl animate-pulse delay-700"></div>
                                                </div>
                                                <div className="text-white/60 z-10 flex flex-col items-center gap-3">
                                                    <Code2 className="w-16 h-16" />
                                                    <span className="font-semibold text-lg">مشروع تقني</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>

                                        {/* Hover Overlay with Link Button */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 bg-slate-900/20">
                                            <a
                                                href={project.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 p-5 rounded-full text-white transition-all transform scale-0 group-hover:scale-100 shadow-2xl shadow-blue-500/50"
                                            >
                                                <ExternalLink className="w-7 h-7" />
                                            </a>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 md:p-8 relative">
                                        {/* Decorative line */}
                                        <div className="absolute top-0 left-0 w-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 group-hover:w-full transition-all duration-700"></div>

                                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all">
                                            {project.title}
                                        </h3>

                                        {project.description && (
                                            <p className="text-slate-400 text-sm md:text-base mb-4 leading-relaxed">
                                                {project.description}
                                            </p>
                                        )}

                                        <div className="flex gap-2 flex-wrap mb-4">
                                            {tags.map((tag: string) => (
                                                <span
                                                    key={tag}
                                                    className="text-xs bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600/50 text-slate-300 px-3 py-1.5 rounded-full group-hover:from-blue-500/20 group-hover:to-purple-500/20 group-hover:border-blue-500/30 group-hover:text-blue-300 transition-all duration-300 font-medium"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        {/* View Project Link */}
                                        <a
                                            href={project.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-semibold group-hover:gap-3 transition-all"
                                        >
                                            مشاهدة المشروع
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
