"use client";

import { ExternalLink, Code2, Sparkles, Star, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Reveal from './Reveal';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectCards } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-cards';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800';

type Project = {
    title: string;
    image?: string;
    tags: string;
    link: string;
    description?: string;
}

export default function FeaturedProjectsClient({ projects }: { projects: Project[] }) {
    if (!projects || projects.length === 0) return null;

    return (
        <section id="projects" className="py-32 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
            {/* Advanced Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>

            {/* Animated Gradient Orbs */}
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                {/* Header */}
                <Reveal className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-6 py-2.5 mb-8 backdrop-blur-sm">
                        <Star className="w-5 h-5 text-purple-400 fill-purple-400" />
                        <span className="text-purple-400 text-sm font-bold tracking-wide">الأعمال المميزة</span>
                        <Star className="w-5 h-5 text-purple-400 fill-purple-400" />
                    </div>

                    <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
                        معرض
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 mx-3">
                            الإبداع التقني
                        </span>
                    </h2>

                    <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                        نماذج حية لأحدث التقنيات والحلول المبتكرة، مزودة بأنظمة إدارة متطورة ومصممة بأعلى معايير الجودة
                    </p>
                </Reveal>

                {/* Projects Swiper */}
                <div className="mb-16 relative">
                    <Swiper
                        effect={'cards'}
                        grabCursor={true}
                        centeredSlides={true}
                        slidesPerView={1}
                        cardsEffect={{
                            perSlideOffset: 8,
                            perSlideRotate: 2,
                            rotate: true,
                            slideShadows: true,
                        }}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        modules={[EffectCards, Pagination, Autoplay]}
                        breakpoints={{
                            640: { effect: 'cards' },
                            768: { effect: 'cards' },
                            1024: { effect: 'cards' },
                        }}
                        className="!pb-16 max-w-[380px] md:max-w-[450px] mx-auto"
                    >
                        {projects.map((project, index) => {
                            const tags = project.tags ? project.tags.split(',').map(t => t.trim()) : [];
                            const imageSrc = project.image || DEFAULT_IMAGE;

                            return (
                                <SwiperSlide key={index}>
                                    <div className="group relative rounded-3xl overflow-hidden h-[600px] md:h-[650px] bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-2xl hover:shadow-[0_0_80px_rgba(168,85,247,0.5)] transition-all duration-700">
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
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-slate-900/60 backdrop-blur-sm">
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

                                            <h3 className="text-3xl md:text-4xl font-black text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all leading-tight">
                                                {project.title}
                                            </h3>

                                            {project.description && (
                                                <p className="text-slate-400 text-base mb-6 leading-relaxed line-clamp-2">
                                                    {project.description}
                                                </p>
                                            )}

                                            {/* Tags */}
                                            <div className="flex gap-2 flex-wrap mb-6">
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
                                                <span>استكشف المشروع</span>
                                                <ArrowRight className="w-5 h-5" />
                                            </a>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>

                {/* Bottom CTA */}
                <Reveal className="text-center">
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold px-10 py-5 rounded-2xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all hover:scale-105 text-lg"
                    >
                        <Code2 className="w-6 h-6" />
                        شاهد جميع المشاريع
                        <Sparkles className="w-6 h-6" />
                    </Link>
                </Reveal>
            </div>
        </section>
    );
}
