"use client";

import { Code2, Sparkles, Star } from 'lucide-react';
import Link from 'next/link';
import Reveal from '../sections/Reveal';
import ProjectCard from './ProjectCard';

export type Project = {
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
                        <span className="text-purple-400 text-sm font-bold tracking-wide">Featured Projects</span>
                        <Star className="w-5 h-5 text-purple-400 fill-purple-400" />
                    </div>

                    <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-snug pb-2">
                        My
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 mx-3 py-1">
                            Portfolio
                        </span>
                    </h2>

                    <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                        Examples of websites and stores I have built and developed
                    </p>
                </Reveal>

                {/* Projects Balanced Grid */}
                <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-16 px-2 md:px-4">
                    {projects.map((project, index) => (
                        <Reveal
                            key={index}
                            className={`stagger-${(index % 3) + 1} w-[calc(50%-0.5rem)] md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.35rem)]`}
                        >
                            <ProjectCard project={project} />
                        </Reveal>
                    ))}
                </div>

                {/* Bottom CTA */}
                <Reveal className="text-center">
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold px-10 py-5 rounded-2xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all hover:scale-105 text-lg"
                    >
                        <Code2 className="w-6 h-6" />
                        View all projects
                        <Sparkles className="w-6 h-6" />
                    </Link>
                </Reveal>
            </div>
        </section>
    );
}
