import { Wrench, Video, Mic, Languages, Coins, Table, QrCode, Lock, FileText, Image, Youtube, Code, Ruler, Calendar, Timer } from 'lucide-react';
import Link from 'next/link';

const tools = [
    {
        id: 'video-to-audio',
        name: 'تحويل فيديو لصوت',
        description: 'استخرج الصوت MP3 من أي مقطع فيديو بسهولة وسرعة.',
        icon: Video,
        href: '/tools/media/video-to-audio',
        color: 'text-pink-400',
        bg: 'bg-pink-400/10',
        border: 'border-pink-400/20'
    },
    {
        id: 'text-to-speech',
        name: 'تحويل النص لصوت',
        description: 'حول أي نص إلى تعليق صوتي احترافي باستخدام AI أو Google.',
        icon: Mic,
        href: '/tools/audio/text-to-speech',
        color: 'text-purple-400',
        bg: 'bg-purple-400/10',
        border: 'border-purple-400/20'
    },
    {
        id: 'translator',
        name: 'مترجم AI الذكي',
        description: 'ترجمة دقيقة وسياقية بين اللغات باستخدام الذكاء الاصطناعي.',
        icon: Languages,
        href: '/tools/translation/ai-translator',
        color: 'text-blue-400',
        bg: 'bg-blue-400/10',
        border: 'border-blue-400/20'
    },
    {
        id: 'currency-converter',
        name: 'محول العملات',
        description: 'أسعار صرف لحظية للجنيه، الدولار، الريال، والمزيد.',
        icon: Coins,
        href: '/tools/finance/currency',
        color: 'text-green-400',
        bg: 'bg-green-400/10',
        border: 'border-green-400/20'
    },
    {
        id: 'table-generator',
        name: 'صانع الجداول',
        description: 'أنشئ جداول بيانات منظمة من أي نص عشوائي حالاً.',
        icon: Table,
        href: '/tools/data/table-generator',
        color: 'text-orange-400',
        bg: 'bg-orange-400/10',
        border: 'border-orange-400/20'
    },
    {
        id: 'qr-generator',
        name: 'منشئ QR Code',
        description: 'حول أي رابط أو نص لرمز QR قابل للمسح.',
        icon: QrCode,
        href: '/tools/utils/qr-generator',
        color: 'text-gray-200',
        bg: 'bg-gray-400/10',
        border: 'border-gray-400/20'
    },
    {
        id: 'password-generator',
        name: 'مولد كلمات مرور',
        description: 'أنشئ كلمات مرور قوية ومعقدة لحماية حساباتك.',
        icon: Lock,
        href: '/tools/security/password-generator',
        color: 'text-red-400',
        bg: 'bg-red-400/10',
        border: 'border-red-400/20'
    },
    {
        id: 'text-analyzer',
        name: 'محلل النصوص',
        description: 'احسب عدد الكلمات والحروف وحلل النصوص.',
        icon: FileText,
        href: '/tools/data/text-analyzer',
        color: 'text-teal-400',
        bg: 'bg-teal-400/10',
        border: 'border-teal-400/20'
    },
    {
        id: 'image-compressor',
        name: 'ضغط الصور',
        description: 'تقليل حجم الصور مع الحفاظ على الجودة للويب.',
        icon: Image,
        href: '/tools/media/image-compressor',
        color: 'text-rose-400',
        bg: 'bg-rose-400/10',
        border: 'border-rose-400/20'
    },
    {
        id: 'youtube-thumbnail',
        name: 'تحميل صور يوتيوب',
        description: 'تنزيل الصور المصغرة (Thumbnails) بجودة عالية.',
        icon: Youtube,
        href: '/tools/media/youtube-thumbnail',
        color: 'text-red-500',
        bg: 'bg-red-500/10',
        border: 'border-red-500/20'
    },
    {
        id: 'json-formatter',
        name: 'منسق JSON',
        description: 'تنسيق وتصحيح أكواد JSON للمطورين.',
        icon: Code,
        href: '/tools/data/json-formatter',
        color: 'text-yellow-400',
        bg: 'bg-yellow-400/10',
        border: 'border-yellow-400/20'
    },
    {
        id: 'unit-converter',
        name: 'محول الوحدات',
        description: 'تحويل الأطوال، الأوزان، والمساحات بسهولة.',
        icon: Ruler,
        href: '/tools/utils/unit-converter',
        color: 'text-indigo-400',
        bg: 'bg-indigo-400/10',
        border: 'border-indigo-400/20'
    },
    {
        id: 'age-calculator',
        name: 'حاسبة العمر',
        description: 'احسب عمرك بدقة بالسنين والشهور والأيام.',
        icon: Calendar,
        href: '/tools/utils/age-calculator',
        color: 'text-cyan-400',
        bg: 'bg-cyan-400/10',
        border: 'border-cyan-400/20'
    },
    {
        id: 'stopwatch',
        name: 'ساعة إيقاف',
        description: 'مؤقت وساعة إيقاف للمهام والرياضة.',
        icon: Timer,
        href: '/tools/utils/stopwatch',
        color: 'text-lime-400',
        bg: 'bg-lime-400/10',
        border: 'border-lime-400/20'
    }
];

export const metadata = {
    title: "مركز الأدوات | جمال تك",
    alternates: {
        canonical: './',
    },
};

export default function ToolsPage() {
    return (
        <div>
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Wrench className="w-8 h-8 text-blue-500" />
                    مركز الأدوات الذكية
                </h1>
                <p className="text-slate-400 text-lg">
                    مجموعة مختارة من الأدوات الرقمية التي تساعدك على إنجاز مهامك اليومية بسرعة وكفاءة.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((tool) => {
                    const Icon = tool.icon;
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
                                استخدام الأداة <span className="mr-auto">→</span>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}
