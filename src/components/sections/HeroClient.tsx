'use client';
import { MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import Reveal from './Reveal';
import { useContent } from '@/hooks/useContent';
import { defaultHeroData, type HeroData } from './hero/HeroConfig';
import { HeroVisuals } from './hero/HeroVisuals';

export default function HeroClient({ initialData }: { initialData?: HeroData }) {
    const { data } = useContent("site_content", "hero", initialData || defaultHeroData);
    const hero = data || defaultHeroData;

    return (
        <section id="home" className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-[#020617] pt-20 pb-12 lg:pt-24 lg:pb-16">
            {/* Animated dot grid background */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none" />

            {/* Main ambient glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-cyan-700/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-5rem)]">
                    
                    {/* Left Column: Text & Content */}
                    <div className="flex flex-col items-center text-center lg:items-start lg:text-left pt-4 lg:pt-0">
                        
                        {/* Status Badge */}
                        <Reveal className="mb-8 relative z-20">
                            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-300 text-sm font-bold tracking-wide backdrop-blur-xl shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-300 group cursor-default">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                                </span>
                                <Sparkles className="w-4 h-4 text-blue-400 group-hover:rotate-12 transition-transform" />
                                <span>Available for New Projects</span>
                            </div>
                        </Reveal>

                        {/* Main Title */}
                        <Reveal className="stagger-1 mb-6">
                            <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.15]">
                                <span className="block text-2xl sm:text-3xl lg:text-4xl text-slate-400 font-bold mb-2">Hello, I&apos;m</span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">
                                    {hero.heroTitle.split(' ')[0]}
                                </span>
                                {hero.heroTitle.split(' ').slice(1).length > 0 && (
                                    <span> {hero.heroTitle.split(' ').slice(1).join(' ')}</span>
                                )}
                            </h1>
                        </Reveal>

                        {/* Subtitle */}
                        <Reveal className="stagger-2 mb-6 max-w-2xl">
                            <div className="text-lg sm:text-2xl lg:text-3xl text-slate-300 font-medium leading-snug">
                                <div dangerouslySetInnerHTML={{
                                    __html: hero.heroSubtitle
                                        .replace('Web Developer', '<span class="text-blue-400 relative inline-block after:content-[\'\'] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-blue-400/30">Web Developer</span>')
                                        .replace('E-commerce', '<span class="text-cyan-400 relative inline-block after:content-[\'\'] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-cyan-400/30">E-commerce</span>')
                                }} />
                            </div>
                        </Reveal>

                        {/* Description */}
                        <Reveal className="stagger-3 mb-10 max-w-xl">
                            <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
                                {hero.heroDescription}
                            </p>
                        </Reveal>

                        {/* Action Buttons */}
                        <Reveal className="stagger-4 flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16 lg:mb-12">
                            <a
                                href={hero.resumeLink}
                                className="group relative px-8 py-4 rounded-2xl font-bold text-lg text-white overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2"
                                style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)' }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                                <span>Explore My Work</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </a>

                            <a
                                href={`https://wa.me/${hero.whatsappNumber}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group px-8 py-4 rounded-2xl border border-slate-700 hover:border-emerald-500/50 bg-slate-800/50 hover:bg-emerald-500/10 text-slate-200 hover:text-emerald-400 font-medium text-lg backdrop-blur-sm transition-all duration-300 flex items-center justify-center gap-3 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]"
                            >
                                <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                Let&apos;s Talk
                            </a>
                        </Reveal>
                    </div>

                    {/* Right Column: Visuals & Composition */}
                    <HeroVisuals hero={hero} />
                </div>
            </div>

            {/* Scroll indicator */}
            <a
                href="#skills"
                className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors duration-300 hidden lg:flex group z-20"
                aria-label="Scroll down"
            >
                <span className="text-[10px] tracking-[0.2em] uppercase font-bold opacity-60 group-hover:opacity-100 transition-opacity">Scroll</span>
                <div className="w-6 h-10 rounded-full border-2 border-slate-700 flex justify-center p-1 group-hover:border-cyan-500/50 transition-colors">
                    <div className="w-1.5 h-1.5 bg-slate-500 group-hover:bg-cyan-400 rounded-full animate-bounce mt-1"></div>
                </div>
            </a>
        </section>
    );
}
