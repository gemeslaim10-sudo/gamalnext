'use client';

import Link from 'next/link';
import { Languages, ArrowRight } from 'lucide-react';

const tools = [
    {
        name: 'مترجم AI الذكي',
        description: 'ترجمة سياقية دقيقة باستخدام الذكاء الاصطناعي.',
        icon: Languages,
        href: '/tools/translation/ai-translator',
        color: 'text-blue-400',
        bg: 'bg-blue-400/10'
    }
];

export default function TranslationToolsPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">الترجمة واللغات</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
