'use client';
import { useState, useEffect } from 'react';
import { ExternalLink, Code2, Sparkles, Paintbrush, Video, Layout, MoveRight } from 'lucide-react';
import Image from 'next/image';
import Reveal from '../sections/Reveal';
import { useContent } from '@/hooks/useContent';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const defaultProjectsData = {
    items: [
        {
            title: 'Brand Identity Design',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
            tags: 'Branding, UI/UX',
            link: '#',
            description: 'Complete identity design for a startup',
            category: 'design'
        },
        {
            title: 'Smart Store App',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
            tags: 'Next.js, Tailwind',
            link: '#',
            description: 'Advanced store management software',
            category: 'software'
        },
        {
            title: 'Motion Graphics Promo',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
            tags: 'Motion Graphics, AE',
            link: '#',
            description: 'Professional ad for digital products',
            category: 'video'
        }
    ]
};

const CategoryHeader = ({ icon: Icon, title, subtitle }: { icon: any, title: string, subtitle: string }) => (
    <div className="flex items-center justify-between mb-10 border-b border-slate-800/50 pb-6">
        <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                <Icon className="w-7 h-7 text-blue-400" />
            </div>
            <div>
                <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">{title}</h3>
                <p className="text-slate-500 text-sm mt-1">{subtitle}</p>
            </div>
        </div>
        <div className="hidden md:flex gap-2">
            <div className={`swiper-button-prev-${title.replace(/\s+/g, '')} w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-all cursor-pointer`}>
                <MoveRight className="w-5 h-5 rotate-180" />
            </div>
            <div className={`swiper-button-next-${title.replace(/\s+/g, '')} w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-all cursor-pointer`}>
                <MoveRight className="w-5 h-5" />
            </div>
        </div>
    </div>
);

const ProjectSlide = ({ project }: { project: any }) => {
    const tags = project.tags?.split(',').map((t: string) => t.trim()) || [];
    return (
        <div className="group h-full flex flex-col bg-[#0f172a]/60 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border border-slate-800/50 hover:border-blue-500/30 transition-all duration-500 shadow-2xl hover:shadow-blue-500/10 relative">
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

            <div className="p-8 flex flex-col flex-grow text-left relative">
                <div className="flex gap-2 flex-wrap mb-4">
                    {tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="text-[10px] font-bold text-blue-400/80 uppercase tracking-wider">{tag}</span>
                    ))}
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-1">{project.title}</h3>
                
                <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-8 opacity-80 group-hover:opacity-100 transition-opacity">
                    {project.description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-slate-800/50 mt-auto">
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-500 font-bold text-sm tracking-tight group/link">
                        View Details
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center group-hover/link:bg-blue-500 group-hover/link:text-white transition-all">
                            <ExternalLink className="w-4 h-4" />
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default function Projects({ initialData }: { initialData?: any }) {
    const { data } = useContent("site_content", "projects", defaultProjectsData);
    const projects = initialData || data || defaultProjectsData;
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const categories = [
        { id: 'design', title: 'Designs', subtitle: 'Visual creativity that embodies your identity', icon: Paintbrush },
        { id: 'video', title: 'Videos', subtitle: 'Stories told through professional lenses', icon: Video },
        { id: 'software', title: 'Software', subtitle: 'Advanced web systems and stores', icon: Layout }
    ];

    const getItemsByCategory = (catId: string) => {
        return projects.items?.filter((item: any) => item.category === catId) || [];
    };

    if (!mounted) return null;

    return (
        <section id="projects" className="py-24 bg-[#020617] relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(59,130,246,0.1)_0%,_transparent_50%)]"></div>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <Reveal className="text-center mb-24">
                    <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-5 py-2.5 mb-8 shadow-xl">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 text-xs md:text-sm font-bold tracking-widest uppercase">Our Creative Portfolio</span>
                    </div>
                    <h2 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-tight">
                        We turn imagination into <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">tangible websites and stores</span>
                    </h2>
                    <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                        A selection of prominent projects executed with the highest standards of quality and professionalism in various technical and creative fields.
                    </p>
                </Reveal>

                <div className="space-y-32">
                    {categories.map((cat) => {
                        const filteredItems = getItemsByCategory(cat.id);
                        if (filteredItems.length === 0) return null;

                        return (
                            <Reveal key={cat.id}>
                                <CategoryHeader 
                                    icon={cat.icon} 
                                    title={cat.title} 
                                    subtitle={cat.subtitle} 
                                />
                                
                                <div className="relative group/swiper">
                                    <Swiper
                                        modules={[Pagination, Autoplay, Navigation]}
                                        dir="ltr"
                                        spaceBetween={24}
                                        slidesPerView={1}
                                        navigation={{
                                            prevEl: `.swiper-button-prev-${cat.title.replace(/\s+/g, '')}`,
                                            nextEl: `.swiper-button-next-${cat.title.replace(/\s+/g, '')}`,
                                        }}
                                        pagination={{ clickable: true, dynamicBullets: true }}
                                        breakpoints={{
                                            640: { slidesPerView: 1.5, spaceBetween: 24 },
                                            768: { slidesPerView: 2, spaceBetween: 30 },
                                            1024: { slidesPerView: 3, spaceBetween: 32 },
                                        }}
                                        className="!pb-16"
                                    >
                                        {filteredItems.map((project: any, index: number) => (
                                            <SwiperSlide key={index} className="!h-auto">
                                                <ProjectSlide project={project} />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
