import { Video, Mic, Languages, Coins, Table, QrCode, Lock, FileText, Image, Youtube, Code, Ruler, Calendar, Timer, LucideIcon } from 'lucide-react';

export const ICON_MAP: Record<string, LucideIcon> = {
    Video, Mic, Languages, Coins, Table, QrCode, Lock, FileText, Image, Youtube, Code, Ruler, Calendar, Timer
};

export const DEFAULT_TOOLS = [
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
