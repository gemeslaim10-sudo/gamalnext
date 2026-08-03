"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import ProjectCard from '@/components/projects/ProjectCard';
import { Sparkles } from 'lucide-react';

type ProjectData = {
    title?: string;
    name?: string;
    image?: string;
    imageUrl?: string;
    images?: string[];
    tags?: string;
    link?: string;
    slug?: string;
    id?: string;
    description?: string;
    [key: string]: unknown;
};

export default function RelatedProjectsCarousel({ currentProjectSlug, allProjects }: { currentProjectSlug: string, allProjects: ProjectData[] }) {
    // Filter out the current project and ensure projects have a title
    const relatedProjects = allProjects.filter(p => {
        const title = p.title || p.name;
        if (!title) return false;
        
        const pSlug = p.slug || p.id;
        return pSlug !== currentProjectSlug;
    }).slice(0, 8); // Take up to 8 projects for the carousel

    if (relatedProjects.length === 0) return null;

    return (
        <section className="relative z-10 px-6 max-w-7xl mx-auto mb-32 lg:mb-48">
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400 text-sm font-semibold">More Work</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">Related Projects</h2>
                <p className="text-slate-400 text-lg">Explore more of our premium digital experiences</p>
            </div>

            <Swiper
                modules={[Pagination, Navigation, Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                breakpoints={{
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }}
                autoplay={{ delay: 3000, disableOnInteraction: true }}
                pagination={{ clickable: true, dynamicBullets: true }}
                navigation
                className="w-full !pb-16"
            >
                {relatedProjects.map((p, idx) => {
                    // Map the generic data to the format expected by ProjectCard
                    const mappedProject = {
                        title: p.title || p.name || 'Untitled',
                        image: p.image || p.imageUrl || p.images?.[0],
                        tags: p.tags || '',
                        link: p.link || '',
                        description: p.description
                    };

                    return (
                        <SwiperSlide key={p.id || `related-${idx}`} className="h-auto">
                            <div className="h-full">
                                <ProjectCard project={mappedProject} />
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </section>
    );
}
