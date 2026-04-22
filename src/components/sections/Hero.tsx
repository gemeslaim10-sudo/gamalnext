'use client';
import { MessageCircle, ChevronDown, ArrowRight, Star, Briefcase, Code2, TrendingUp, Sparkles, Globe, Terminal } from 'lucide-react';
import Image from 'next/image';
import Reveal from './Reveal';
import { useContent } from '@/hooks/useContent';
import { useEffect, useRef, useState } from 'react';

const defaultHeroData = {
    heroTitle: "Gamal Abdelaty",
    heroSubtitle: "Web Developer, E-commerce, and WhatsApp API",
    heroDescription: "Specializing in creating scalable websites, premium e-commerce stores, and intelligent WhatsApp API solutions. I transform complex ideas into elegant digital experiences that drive real business growth.",
    whatsappNumber: "201024531452",
    resumeLink: "#projects"
};

const STATS = [
    { label: "Completed Projects", value: 120, suffix: "+", icon: Briefcase },
    { label: "Happy Clients", value: 98, suffix: "%", icon: Star },
    { label: "Technologies", value: 30, suffix: "+", icon: Code2 },
    { label: "Years Exp.", value: 5, suffix: "+", icon: TrendingUp },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const started = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started.current) {
                started.current = true;
                let start = 0;
                const duration = 1800;
                const step = Math.ceil(target / (duration / 16));
                const timer = setInterval(() => {
                    start += step;
                    if (start >= target) {
                        setCount(target);
                        clearInterval(timer);
                    } else {
                        setCount(start);
                    }
                }, 16);
            }
        }, { threshold: 0.5 });

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target]);

    return <span ref={ref}>{count}{suffix}</span>;
}

export default function Hero() {
    const { data } = useContent("site_content", "hero", defaultHeroData);
    const hero = data || defaultHeroData;

    return (
        <section id="home" className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-[#020617] pt-28 pb-12 lg:pt-32 lg:pb-20">
            {/* Animated dot grid background */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none" />

            {/* Main ambient glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-cyan-700/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-5rem)]">
                    
                    {/* Left Column: Text & Content */}
                    <div className="flex flex-col items-center text-center lg:items-start lg:text-left pt-10 lg:pt-0">
                        
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
                    <div className="relative flex justify-center items-center lg:justify-end lg:h-full py-10 lg:py-0 mt-8 lg:mt-0">
                        <Reveal className="relative z-10 w-full max-w-[500px] lg:max-w-[600px] flex items-center justify-center">
                            <div className="relative w-full h-full flex items-center group">
                                
                                {/* Decorative tech background shapes */}
                                <div className="absolute top-[5%] right-[5%] w-[60%] h-[60%] bg-blue-500/20 rounded-[40px] rotate-12 blur-2xl transition-transform duration-700 pointer-events-none"></div>
                                <div className="absolute bottom-[5%] left-[5%] w-[60%] h-[60%] bg-cyan-500/20 rounded-[40px] -rotate-6 blur-2xl transition-transform duration-700 pointer-events-none"></div>

                                {/* Main Composition Wrapper */}
                                <div className="relative w-full flex flex-col xl:flex-row items-center justify-center xl:justify-end gap-6 lg:gap-8 mt-10 sm:mt-12 lg:mt-0">
                                    
                                    {/* Subtle Ambient Motion Background (Fills empty space without breaking balance) */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[450px] lg:h-[450px] pointer-events-none z-0 opacity-30">
                                        <div className="w-full h-full rounded-full border border-dashed border-blue-500/30 animate-[spin_60s_linear_infinite]"></div>
                                        <div className="absolute inset-4 rounded-full border border-dashed border-cyan-500/20 animate-[spin_40s_linear_infinite_reverse]"></div>
                                    </div>

                                    {/* Avatar Container Wrapper */}
                                    <div className="relative z-20 flex-shrink-0 group">
                                        
                                        {/* Premium Glowing Outer Ring (Visible on Hover) */}
                                        <div className="absolute -inset-1 bg-gradient-to-tr from-blue-500/40 via-cyan-400/20 to-emerald-500/40 rounded-[2.8rem] blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out"></div>

                                        {/* The Actual Image Container (Small on mobile, large on desktop) */}
                                        <div className="relative w-[180px] h-[180px] sm:w-[260px] sm:h-[260px] lg:w-[320px] lg:h-[320px] xl:w-[340px] xl:h-[340px] rounded-[2.5rem] overflow-hidden border-2 border-slate-700/50 hover:border-blue-500/50 bg-[#0f172a] shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-500 relative z-10">
                                            <Image
                                                src="/gamal.jpg"
                                                alt={hero.heroTitle}
                                                fill
                                                priority
                                                className="object-cover object-center grayscale-[15%] group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
                                                sizes="(max-width: 768px) 100vw, 350px"
                                            />
                                            {/* Advanced Image Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/90 via-[#020617]/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
                                        </div>
                                    </div>

                                    {/* Stats Grid - Perfectly Vertically Aligned, NO OVERLAP (Desktop XL) */}
                                    <div className="hidden xl:grid grid-cols-2 gap-4 z-10 relative self-center flex-shrink-0">
                                        {STATS.map(({ label, value, suffix, icon: Icon }, index) => (
                                            <div 
                                                key={label} 
                                                className={`group/stat relative bg-gradient-to-b from-[#0b1120] to-[#040814] border border-slate-700/60 p-4 lg:p-5 rounded-[1.5rem] flex flex-col items-center justify-center text-center w-[110px] h-[110px] md:w-[130px] md:h-[130px] xl:w-[140px] xl:h-[140px] shadow-[0_10px_40px_rgba(0,0,0,0.5)] hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-500 hover:-translate-y-1 flex-shrink-0 ${index % 2 !== 0 ? 'translate-y-6 lg:translate-y-8' : ''}`}
                                            >
                                                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover/stat:opacity-100 rounded-[1.5rem] transition-opacity duration-500"></div>
                                                <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-blue-500 mb-2 lg:mb-3 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] group-hover/stat:scale-110 transition-transform duration-300" />
                                                <span className="text-xl xl:text-2xl font-black text-white tracking-tight leading-none mb-1">
                                                    <AnimatedCounter target={value} suffix={suffix} />
                                                </span>
                                                <span className="text-[9px] xl:text-[10px] text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap">{label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                        
                        {/* Stats Row for Mobile & Tablet & LG Screens */}
                        <Reveal className="stagger-5 w-full mt-10 xl:hidden relative z-20">
                            <div className="grid grid-cols-2 gap-3 px-2">
                                {STATS.map(({ label, value, suffix, icon: Icon }) => (
                                    <div key={label} className="bg-gradient-to-b from-[#0b1120] to-[#040814] border border-slate-800 p-4 sm:p-5 rounded-[1.5rem] flex flex-col items-center text-center shadow-2xl">
                                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mb-2 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                        <span className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
                                            <AnimatedCounter target={value} suffix={suffix} />
                                        </span>
                                        <span className="text-[9px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-wider">{label}</span>
                                    </div>
                                ))}
                            </div>
                        </Reveal>
                    </div>
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
