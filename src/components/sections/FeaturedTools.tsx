
import { Wrench, ArrowRight, Video, Mic, Languages, Coins, Table, QrCode, Lock, FileText, Image, Youtube, Code, Ruler, Calendar, Timer, LucideIcon } from 'lucide-react';
import Link from 'next/link';
import Reveal from './Reveal';
import { getCollection } from '@/lib/server-utils';

const ICON_MAP: Record<string, LucideIcon> = {
    Video, Mic, Languages, Coins, Table, QrCode, Lock, FileText, Image, Youtube, Code, Ruler, Calendar, Timer
};

const DEFAULT_TOOLS = [
    {
        name: 'Video to Audio',
        description: 'Extract MP3 audio from any video.',
        icon: 'Video',
        href: '/tools/media/video-to-audio',
        color: 'text-pink-400',
        bg: 'bg-pink-400/10',
        border: 'border-pink-400/20'
    },
    {
        name: 'Smart AI Translator',
        description: 'Accurate and contextual instant translation.',
        icon: 'Languages',
        href: '/tools/translation/ai-translator',
        color: 'text-blue-400',
        bg: 'bg-blue-400/10',
        border: 'border-blue-400/20'
    },
    {
        name: 'Currency Converter',
        description: 'Real-time exchange rates for all currencies.',
        icon: 'Coins',
        href: '/tools/finance/currency',
        color: 'text-green-400',
        bg: 'bg-green-400/10',
        border: 'border-green-400/20'
    },
    {
        name: 'Table Generator',
        description: 'Automatically organize data into tables.',
        icon: 'Table',
        href: '/tools/data/table-generator',
        color: 'text-orange-400',
        bg: 'bg-orange-400/10',
        border: 'border-orange-400/20'
    }
];

export default async function FeaturedTools() {
    const dbTools = await getCollection<any>("tools");
    let tools = DEFAULT_TOOLS;

    if (dbTools.length > 0) {
        // Filter for active and maybe prefer specific ones, for now just take first 4 active
        const activeTools = dbTools.filter(t => t.isActive !== false);
        if (activeTools.length >= 4) {
            tools = activeTools.slice(0, 4).map(t => {
                const defaultVer = DEFAULT_TOOLS.find(d => d.name === t.name) || {}; // simple match or just defaults
                return {
                    name: t.name,
                    description: t.description,
                    icon: t.icon,
                    href: t.route || '#',
                    // Use saved styles or fallbacks
                    color: t.color || (defaultVer as any).color || 'text-blue-400',
                    bg: t.bg || (defaultVer as any).bg || 'bg-blue-400/10',
                    border: t.border || (defaultVer as any).border || 'border-blue-400/20'
                };
            });
        }
    }

    return (
        <section className="py-20 bg-slate-950/50 relative overflow-hidden">
            {/* Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/5 rounded-full blur-[100px]"></div>

            <div className="max-w-7xl mx-auto px-4">
                <Reveal>
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <div className="flex items-center gap-2 text-blue-400 font-bold mb-2">
                                <Wrench className="w-5 h-5" />
                                <span className="uppercase tracking-wider">SMART TOOLS</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold text-white">
                                Tools <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">to ease your work</span>
                            </h2>
                        </div>
                        <Link href="/tools" className="hidden md:flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                            All Tools
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </Reveal>

                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {tools.map((tool, index) => {
                        const Icon = ICON_MAP[tool.icon] || Wrench;
                        return (
                            <Reveal key={tool.href} className={`stagger-${index + 1}`}>
                                <Link
                                    href={tool.href}
                                    className="relative block group h-full bg-[#0b1121]/80 backdrop-blur-xl border border-white/5 p-7 rounded-[2rem] hover:border-blue-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.2)] overflow-hidden"
                                >
                                    {/* Glossy Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                    
                                    {/* Glowing top line */}
                                    <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <div className={`w-14 h-14 rounded-2xl ${tool.bg || 'bg-slate-800/50'} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                                        <Icon className={`w-7 h-7 ${tool.color || 'text-slate-300'}`} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300 leading-tight">
                                        {tool.name}
                                    </h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        {tool.description}
                                    </p>
                                    
                                    {/* Arrow icon appearing on hover */}
                                    <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center opacity-0 transform -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 text-blue-400">
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </Link>
                            </Reveal>
                        );
                    })}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Link href="/tools" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                        Browse all tools
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
