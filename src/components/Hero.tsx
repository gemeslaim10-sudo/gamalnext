'use client';
import { MessageCircle, ChevronDown, ArrowRight } from 'lucide-react';
import Reveal from './Reveal';
import { useContent } from '@/hooks/useContent';

const defaultHeroData = {
    heroTitle: "جمال عبد العاطي",
    heroSubtitle: "SEO Optimization & Data Analyst",
    heroDescription: "خبير في جمال تك (Gamal Tech) لتحسين محركات البحث، تحليل البيانات، وتطوير الأنظمة الرقمية (CMS)، المتاجر الإلكترونية، ومعرفة كيفية عمل ويبسايت احترافي.",
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

            <div className="relative z-10 max-w-7xl mx-auto px-4 flex flex-col items-center">
                {/* Image Section */}
                <Reveal className="mb-10 relative">
                    <div className="relative group">
                        {/* Orbiting Ring */}
                        <div className="absolute -inset-4 border-2 border-dashed border-blue-500/30 rounded-full animate-[spin_20s_linear_infinite]"></div>

                        {/* Glow Layer */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 offset-2 to-purple-600 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

                        {/* Main Image Container */}
                        <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-slate-900 shadow-2xl">
                            <img
                                src="/gamal.jpg"
                                alt={hero.heroTitle}
                                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-125"
                            />
                        </div>
                    </div>
                </Reveal>

                <Reveal className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-sm font-semibold tracking-wide backdrop-blur-sm shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    نظم المعلومات و SEO
                </Reveal>

                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tight">
                    <Reveal className="stagger-1 inline-block text-gradient p-2">{hero.heroTitle}</Reveal>
                </h1>

                <Reveal className="stagger-2 text-xl sm:text-3xl md:text-4xl text-slate-300 mb-10 font-light max-w-4xl mx-auto leading-relaxed">
                    <div dangerouslySetInnerHTML={{ __html: hero.heroSubtitle.replace('SEO Optimization', '<span class="text-blue-400 font-semibold drop-shadow-[0_0_10px_rgba(96,165,250,0.3)]">SEO Optimization</span>').replace('Data Analyst', '<span class="text-purple-400 font-semibold drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]">Data Analyst</span>') }} />
                </Reveal>

                <Reveal className="stagger-3 max-w-2xl mx-auto text-slate-400 text-lg sm:text-xl mb-12 leading-relaxed px-4 text-center">
                    {hero.heroDescription}
                    <div className="mt-4 text-slate-500 text-sm md:text-base font-medium">
                        CMS Specialist (WordPress & Shopify) | AI Agents Developer
                    </div>
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
