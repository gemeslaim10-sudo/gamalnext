'use client';

import Link from 'next/link';
import { Video, Image, Youtube, ArrowRight } from 'lucide-react';

const tools = [
    {
        name: 'تحويل فيديو لصوت',
        description: 'استخرج الصوت MP3 من أي مقطع فيديو.',
        icon: Video,
        href: '/tools/media/video-to-audio',
        color: 'text-pink-400',
        bg: 'bg-pink-400/10'
    },
    {
        name: 'ضغط الصور',
        description: 'تقليل حجم الصور مع الحفاظ على الجودة.',
        icon: Image,
        href: '/tools/media/image-compressor',
        color: 'text-rose-400',
        bg: 'bg-rose-400/10'
    },
    {
        name: 'تحميل صور يوتيوب',
        description: 'تنزيل الصور المصغرة بجودة عالية.',
        icon: Youtube,
        href: '/tools/media/youtube-thumbnail',
        color: 'text-red-500',
        bg: 'bg-red-500/10'
    }
];

export default function MediaToolsPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">أدوات الوسائط (Media)</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                        <Link key={tool.href} href={tool.href} className="flex flex-col bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-slate-600 transition-all">
                            <div className={`w-12 h-12 rounded-xl ${tool.bg} flex items-center justify-center mb-4`}>
                                <Icon className={`w-6 h-6 ${tool.color}`} />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{tool.name}</h3>
                            <p className="text-slate-400 text-sm mb-4 flex-1">{tool.description}</p>
                            <div className="text-blue-400 text-sm flex items-center gap-1 font-medium">ابدأ الآن <ArrowRight className="w-4 h-4" /></div>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}
