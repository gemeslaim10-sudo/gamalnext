'use client';
import Image from 'next/image';
import Reveal from '../Reveal';
import type { HeroData } from './HeroConfig';
import { HeroStatsGrid } from './HeroStatsGrid';
import { useBrandingContext } from '@/components/providers/BrandingProvider';
import { User } from 'lucide-react';

export function HeroVisuals({ hero }: { hero: HeroData }) {
    const branding = useBrandingContext();
    const displayImage = hero.avatarImage && hero.avatarImage !== "/gamal.jpg" ? hero.avatarImage : branding?.siteLogo;
    return (
        <div className="relative flex justify-center items-center lg:justify-end lg:h-full py-10 lg:py-0 mt-8 lg:mt-0">
            <Reveal className="relative z-10 w-full max-w-[500px] lg:max-w-[600px] flex items-center justify-center">
                <div className="relative w-full h-full flex items-center group">
                    
                    {/* Decorative tech background shapes */}
                    <div className="absolute top-[5%] right-[5%] w-[60%] h-[60%] bg-blue-500/20 rounded-[40px] rotate-12 blur-2xl transition-transform duration-700 pointer-events-none"></div>
                    <div className="absolute bottom-[5%] left-[5%] w-[60%] h-[60%] bg-cyan-500/20 rounded-[40px] -rotate-6 blur-2xl transition-transform duration-700 pointer-events-none"></div>

                    {/* Main Composition Wrapper */}
                    <div className="relative w-full flex flex-col 2xl:flex-row items-center justify-center 2xl:justify-end gap-6 lg:gap-8 mt-10 sm:mt-12 lg:mt-0">
                        
                        {/* Subtle Ambient Motion Background */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[450px] lg:h-[450px] pointer-events-none z-0 opacity-30">
                            <div className="w-full h-full rounded-full border border-dashed border-blue-500/30 animate-[spin_60s_linear_infinite]"></div>
                            <div className="absolute inset-4 rounded-full border border-dashed border-cyan-500/20 animate-[spin_40s_linear_infinite_reverse]"></div>
                        </div>

                        {/* Avatar Container Wrapper */}
                        <div className="relative z-20 flex-shrink-0 group">
                            {/* Premium Glowing Outer Ring (Visible on Hover) */}
                            <div className="absolute -inset-1 bg-gradient-to-tr from-blue-500/40 via-cyan-400/20 to-emerald-500/40 rounded-[2.8rem] blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out"></div>

                            <div className="relative w-[180px] h-[180px] sm:w-[260px] sm:h-[260px] lg:w-[320px] lg:h-[320px] 2xl:w-[340px] 2xl:h-[340px] rounded-[2.5rem] overflow-hidden border-2 border-slate-700/50 hover:border-blue-500/50 bg-[#0f172a] flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-500 z-10">
                                {displayImage ? (
                                    <Image
                                        src={displayImage}
                                        alt={hero.heroTitle}
                                        fill
                                        priority
                                        className="object-cover object-center grayscale-[15%] group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
                                        sizes="(max-width: 768px) 180px, 350px"
                                    />
                                ) : (
                                    <User className="w-20 h-20 sm:w-32 sm:h-32 text-slate-600" />
                                )}
                                {/* Advanced Image Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/90 via-[#020617]/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"></div>
                            </div>
                        </div>

                        <HeroStatsGrid />
                    </div>
                </div>
            </Reveal>
        </div>
    );
}
