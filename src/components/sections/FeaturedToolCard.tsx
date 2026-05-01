import Link from 'next/link';
import { ArrowRight, Wrench } from 'lucide-react';
import Reveal from './Reveal';
import { ICON_MAP } from './FeaturedToolsIcons';

interface FeaturedToolCardProps {
    tool: {
        name: string;
        description: string;
        icon: string;
        href: string;
        color: string;
        bg: string;
        border: string;
    };
    index: number;
}

export function FeaturedToolCard({ tool, index }: FeaturedToolCardProps) {
    const Icon = ICON_MAP[tool.icon] || Wrench;

    return (
        <Reveal className={`stagger-${index + 1}`}>
            <Link
                href={tool.href}
                className="relative block group h-full bg-[#0b1121]/80 backdrop-blur-xl border border-white/5 p-7 rounded-[2rem] hover:border-blue-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.2)] overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
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
                
                <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center opacity-0 transform -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 text-blue-400">
                    <ArrowRight className="w-4 h-4" />
                </div>
            </Link>
        </Reveal>
    );
}
