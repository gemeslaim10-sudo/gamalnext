
import { Wrench, Video, Mic, Languages, Coins, Table, QrCode, Lock, FileText, Image, Youtube, Code, Ruler, Calendar, Timer, LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { getCollection } from '@/lib/server-utils';

const ICON_MAP: Record<string, LucideIcon> = {
    Video, Mic, Languages, Coins, Table, QrCode, Lock, FileText, Image, Youtube, Code, Ruler, Calendar, Timer
};

const DEFAULT_TOOLS = [
    {
        id: 'video-to-audio',
        name: 'Video to Audio',
        description: 'Extract MP3 audio from any video easily and quickly.',
        category: 'media',
        icon: 'Video',
        href: '/tools/media/video-to-audio',
        color: 'text-pink-400',
        bg: 'bg-pink-400/10',
        border: 'border-pink-400/20'
    },
    {
        id: 'text-to-speech',
        name: 'Text to Speech',
        description: 'Convert any text into a professional voiceover using AI or Google.',
        category: 'audio',
        icon: 'Mic',
        href: '/tools/audio/text-to-speech',
        color: 'text-purple-400',
        bg: 'bg-purple-400/10',
        border: 'border-purple-400/20'
    },
    {
        id: 'ai-translator',
        name: 'Smart AI Translator',
        description: 'Accurate and contextual translation between languages using AI.',
        category: 'translation',
        icon: 'Languages',
        href: '/tools/translation/ai-translator',
        color: 'text-blue-400',
        bg: 'bg-blue-400/10',
        border: 'border-blue-400/20'
    },
    {
        id: 'currency-converter',
        name: 'Currency Converter',
        description: 'Real-time exchange rates for EGP, USD, SAR, and more.',
        category: 'finance',
        icon: 'Coins',
        href: '/tools/finance/currency',
        color: 'text-green-400',
        bg: 'bg-green-400/10',
        border: 'border-green-400/20'
    },
    {
        id: 'table-generator',
        name: 'Table Generator',
        description: 'Create organized data tables from any random text instantly.',
        category: 'data',
        icon: 'Table',
        href: '/tools/data/table-generator',
        color: 'text-orange-400',
        bg: 'bg-orange-400/10',
        border: 'border-orange-400/20'
    },
    {
        id: 'qr-generator',
        name: 'QR Code Generator',
        description: 'Convert any link or text into a scannable QR code.',
        category: 'utils',
        icon: 'QrCode',
        href: '/tools/utils/qr-generator',
        color: 'text-gray-200',
        bg: 'bg-gray-400/10',
        border: 'border-gray-400/20'
    },
    {
        id: 'password-generator',
        name: 'Password Generator',
        description: 'Create strong and complex passwords to protect your accounts.',
        category: 'security',
        icon: 'Lock',
        href: '/tools/security/password-generator',
        color: 'text-red-400',
        bg: 'bg-red-400/10',
        border: 'border-red-400/20'
    },
    {
        id: 'text-analyzer',
        name: 'Text Analyzer',
        description: 'Count words and characters, and analyze text easily.',
        category: 'data',
        icon: 'FileText',
        href: '/tools/data/text-analyzer',
        color: 'text-teal-400',
        bg: 'bg-teal-400/10',
        border: 'border-teal-400/20'
    },
    {
        id: 'image-compressor',
        name: 'Image Compressor',
        description: 'Reduce image size while maintaining quality for the web.',
        category: 'media',
        icon: 'Image',
        href: '/tools/media/image-compressor',
        color: 'text-rose-400',
        bg: 'bg-rose-400/10',
        border: 'border-rose-400/20'
    },
    {
        id: 'youtube-thumbnail',
        name: 'YouTube Thumbnail Downloader',
        description: 'Download high-quality video thumbnails.',
        category: 'media',
        icon: 'Youtube',
        href: '/tools/media/youtube-thumbnail',
        color: 'text-red-500',
        bg: 'bg-red-500/10',
        border: 'border-red-500/20'
    },
    {
        id: 'json-formatter',
        name: 'JSON Formatter',
        description: 'Format and validate JSON codes for developers.',
        category: 'data',
        icon: 'Code',
        href: '/tools/data/json-formatter',
        color: 'text-yellow-400',
        bg: 'bg-yellow-400/10',
        border: 'border-yellow-400/20'
    },
    {
        id: 'unit-converter',
        name: 'Unit Converter',
        description: 'Convert lengths, weights, and areas easily.',
        category: 'utils',
        icon: 'Ruler',
        href: '/tools/utils/unit-converter',
        color: 'text-indigo-400',
        bg: 'bg-indigo-400/10',
        border: 'border-indigo-400/20'
    },
    {
        id: 'age-calculator',
        name: 'Age Calculator',
        description: 'Calculate your exact age in years, months, and days.',
        category: 'utils',
        icon: 'Calendar',
        href: '/tools/utils/age-calculator',
        color: 'text-cyan-400',
        bg: 'bg-cyan-400/10',
        border: 'border-cyan-400/20'
    },
    {
        id: 'stopwatch',
        name: 'Stopwatch',
        description: 'Timer and stopwatch for tasks and sports.',
        category: 'utils',
        icon: 'Timer',
        href: '/tools/utils/stopwatch',
        color: 'text-lime-400',
        bg: 'bg-lime-400/10',
        border: 'border-lime-400/20'
    }
];

export const metadata = {
    title: "Tools Center | Gamal Tech",
    alternates: {
        canonical: './',
    },
};

export const revalidate = 0; // Revalidate immediately (dynamic)

export default async function ToolsPage() {
    const dbTools = await getCollection<any>("tools");

    // Normalize DB tools to match UI structure (adding colors/borders if missing)
    // For simplicity, we'll map DB tools and fallback to DEFAULT_TOOLS properties for styling if missing
    // In a real app, these styles might be in DB or calculated

    let tools = dbTools.length > 0 ? dbTools : DEFAULT_TOOLS;

    // Filter active tools if from DB
    if (dbTools.length > 0) {
        tools = tools.filter(t => t.isActive !== false);
        // Map fetched tools to include styling from DEFAULT_TOOLS matching by ID, or default styling
        tools = tools.map((tool: any) => {
            const defaultVer = DEFAULT_TOOLS.find(d => d.id === tool.id);
            return {
                ...tool,
                color: tool.color || defaultVer?.color || 'text-blue-400',
                bg: tool.bg || defaultVer?.bg || 'bg-blue-400/10',
                border: tool.border || defaultVer?.border || 'border-blue-400/20',
                href: tool.route || defaultVer?.href || '#'
            };
        });
    }

    return (
        <div>
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Wrench className="w-8 h-8 text-blue-500" />
                    Smart Tools Center
                </h1>
                <p className="text-slate-400 text-lg">
                    A selection of tools that help you accomplish web and e-commerce development tasks efficiently.
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {tools.map((tool: any) => {
                    const Icon = ICON_MAP[tool.icon] || Wrench;
                    return (
                        <Link
                            key={tool.id}
                            href={tool.href}
                            className={`group relative p-6 rounded-2xl border ${tool.border} bg-slate-900/50 hover:bg-slate-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                        >
                            <div className={`mb-4 w-12 h-12 rounded-xl ${tool.bg} flex items-center justify-center`}>
                                <Icon className={`w-6 h-6 ${tool.color}`} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                {tool.name}
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                {tool.description}
                            </p>
                            <div className="mt-4 flex items-center text-sm font-medium text-slate-500 group-hover:text-slate-300 transition-colors">
                                Use Tool <span className="ml-auto">→</span>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}
