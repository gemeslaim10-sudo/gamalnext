import { Wrench, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Reveal from './Reveal';
import { getCollection } from '@/lib/server-utils';
import { FeaturedToolCard } from './FeaturedToolCard';
import { DEFAULT_TOOLS } from './FeaturedToolsIcons';

interface DbTool {
    name: string;
    description: string;
    icon: string;
    route?: string;
    isActive?: boolean;
    color?: string;
    bg?: string;
    border?: string;
}

export default async function FeaturedTools() {
    const dbTools = await getCollection<DbTool>("tools");
    let tools = DEFAULT_TOOLS;

    if (dbTools.length > 0) {
        const activeTools = dbTools.filter(t => t.isActive !== false);
        if (activeTools.length >= 4) {
            tools = activeTools.slice(0, 4).map(t => {
                const defaultVer = (DEFAULT_TOOLS.find(d => d.name === t.name) || {}) as Record<string, string | undefined>;
                return {
                    name: t.name,
                    description: t.description,
                    icon: t.icon,
                    href: t.route || '#',
                    color: t.color || defaultVer.color || 'text-blue-400',
                    bg: t.bg || defaultVer.bg || 'bg-blue-400/10',
                    border: t.border || defaultVer.border || 'border-blue-400/20'
                };
            }) as typeof DEFAULT_TOOLS;
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
                    {tools.map((tool, index) => (
                        <FeaturedToolCard key={tool.href} tool={tool} index={index} />
                    ))}
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
