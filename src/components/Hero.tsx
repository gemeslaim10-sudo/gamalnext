'use client';
import { MessageCircle, ChevronDown, ArrowRight } from 'lucide-react';
import Reveal from './Reveal';
import { useContent } from '@/hooks/useContent';

const defaultHeroData = {
    heroTitle: "جمال عبد العاطي",
    heroSubtitle: "Full Stack Web Developer & SEO Specialist",
    heroDescription: "تطوير حلول Web Applications متكاملة، وتنفيذ استراتيجيات SEO لتعزيز الظهور الرقمي.",
    whatsappNumber: "201024531452",
    resumeLink: "#projects"
};

export default function Hero() {
    const { data } = useContent("site_content", "hero", defaultHeroData);
    const hero = data || defaultHeroData;

    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] -z-10"></div>

            {/* Floating Blobs */}
            <div className="blob bg-blue-500 top-20 right-10 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="blob bg-purple-500 bottom-20 left-10 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="blob bg-pink-500 top-1/2 left-1/2 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
                <Reveal className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-sm font-semibold tracking-wide backdrop-blur-sm shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    تطوير مواقع الويب و SEO
                </Reveal>

                <h1 className="text-5xl sm:text-7xl md:text-9xl font-black text-white mb-8 tracking-tight">
                    <Reveal className="stagger-1 inline-block text-gradient p-2">{hero.heroTitle}</Reveal>
                </h1>

                <Reveal className="stagger-2 text-xl sm:text-3xl md:text-4xl text-slate-300 mb-10 font-light max-w-4xl mx-auto leading-relaxed">
                    <div dangerouslySetInnerHTML={{ __html: hero.heroSubtitle.replace('Full Stack Web Developer', '<span class="text-blue-400 font-semibold drop-shadow-[0_0_10px_rgba(96,165,250,0.3)]">Full Stack Web Developer</span>').replace('SEO Specialist', '<span class="text-purple-400 font-semibold drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]">SEO Specialist</span>') }} />
                </Reveal>

                <Reveal className="stagger-3 max-w-2xl mx-auto text-slate-400 text-lg sm:text-xl mb-12 leading-relaxed px-4">
                    {hero.heroDescription}
                </Reveal>

                <Reveal className="stagger-4 flex flex-col sm:flex-row gap-6 justify-center items-center w-full sm:w-auto">
                    <a href={hero.resumeLink} className="group relative w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-lg shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <span className="relative flex items-center justify-center gap-2">
                            استعراض المشاريع <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </a>
                    <a href={`https://wa.me/${hero.whatsappNumber}`} target="_blank" className="group w-full sm:w-auto px-8 py-4 rounded-xl border border-white/10 hover:border-green-400/50 bg-white/5 hover:bg-green-500/10 text-slate-200 hover:text-green-400 font-medium text-lg backdrop-blur-sm transition-all duration-300 flex items-center justify-center gap-3">
                        <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        بدء محادثة رسمية
                    </a>
                </Reveal>
            </div>

            <a href="#skills" className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-slate-500 hover:text-blue-400 animate-bounce cursor-pointer transition-colors duration-300 hidden sm:block">
                <ChevronDown className="w-10 h-10" />
            </a>
        </section>
    );
}
