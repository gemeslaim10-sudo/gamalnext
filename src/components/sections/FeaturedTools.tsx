
import { Wrench, ArrowLeft, Video, Mic, Languages, Coins, Table, QrCode, Lock, FileText, Image, Youtube, Code, Ruler, Calendar, Timer, LucideIcon } from 'lucide-react';
import Link from 'next/link';
import Reveal from './Reveal';
import { getCollection } from '@/lib/server-utils';

const ICON_MAP: Record<string, LucideIcon> = {
    Video, Mic, Languages, Coins, Table, QrCode, Lock, FileText, Image, Youtube, Code, Ruler, Calendar, Timer
};

const DEFAULT_TOOLS = [
    {
        name: 'تحويل فيديو لصوت',
        description: 'استخرج الصوت MP3 من أي فيديو.',
        icon: 'Video',
        href: '/tools/media/video-to-audio',
        color: 'text-pink-400',
        bg: 'bg-pink-400/10',
        border: 'border-pink-400/20'
    },
    {
        name: 'مترجم AI الذكي',
        description: 'ترجمة فورية دقيقة وسياقية.',
        icon: 'Languages',
        href: '/tools/translation/ai-translator',
        color: 'text-blue-400',
        bg: 'bg-blue-400/10',
        border: 'border-blue-400/20'
    },
    {
        name: 'محول العملات',
        description: 'أسعار صرف لحظية لجميع العملات.',
        icon: 'Coins',
        href: '/tools/finance/currency',
        color: 'text-green-400',
        bg: 'bg-green-400/10',
        border: 'border-green-400/20'
    },
    {
        name: 'صانع الجداول',
        description: 'تنظيم البيانات في جداول تلقائياً.',
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
                                <span className="uppercase tracking-wider">أدوات ذكية</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold text-white">
                                أدوات <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">تسهل عملك</span>
                            </h2>
                        </div>
                        <Link href="/tools" className="hidden md:flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                            جميع الأدوات
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {tools.map((tool, index) => {
                        const Icon = ICON_MAP[tool.icon] || Wrench;
                        return (
                            <Reveal key={tool.href} className={`stagger-${index + 1}`}>
                                <Link
                                    href={tool.href}
                                    className={`block group bg-slate-900 border ${tool.border || 'border-slate-800'} p-6 rounded-2xl hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                                >
                                    <div className={`w-12 h-12 rounded-xl ${tool.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <Icon className={`w-6 h-6 ${tool.color}`} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                        {tool.name}
                                    </h3>
                                    <p className="text-slate-400 text-sm">
                                        {tool.description}
                                    </p>
                                </Link>
                            </Reveal>
                        );
                    })}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Link href="/tools" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                        استعراض كل الأدوات
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
