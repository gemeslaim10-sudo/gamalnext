'use client';
import { Sparkles, Paintbrush, Video, Layout } from 'lucide-react';
import Reveal from '../sections/Reveal';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { CategoryHeader } from './CategoryHeader';
import { ProjectSlide } from './ProjectSlide';
import { useProjects } from './hooks/useProjects';
import type { ProjectsData, ProjectItem } from '@/types';

export default function Projects({ initialData }: { initialData?: ProjectsData }) {
    const { mounted, getItemsByCategory } = useProjects(initialData);

    const categories = [
        { id: 'design', title: 'Designs', subtitle: 'Visual creativity that embodies your identity', icon: Paintbrush },
        { id: 'video', title: 'Videos', subtitle: 'Stories told through professional lenses', icon: Video },
        { id: 'software', title: 'Software', subtitle: 'Advanced web systems and stores', icon: Layout }
    ];

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
                                        {filteredItems.map((project: ProjectItem, index: number) => (
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
