import { ToolData } from './types';

export const INITIAL_TOOLS: ToolData[] = [
    {
        id: 'video-to-audio',
        name: 'تحويل فيديو لصوت',
        description: 'استخرج الصوت MP3 من أي مقطع فيديو بسهولة وسرعة.',
        category: 'media',
        icon: 'Video',
        route: '/tools/media/video-to-audio',
        isActive: true
    },
    {
        id: 'text-to-speech',
        name: 'تحويل النص لصوت',
        description: 'حول أي نص إلى تعليق صوتي احترافي باستخدام AI أو Google.',
        category: 'audio',
        icon: 'Mic',
        route: '/tools/audio/text-to-speech',
        isActive: true
    },
    {
        id: 'ai-translator',
        name: 'مترجم AI الذكي',
        description: 'ترجمة دقيقة وسياقية بين اللغات باستخدام الذكاء الاصطناعي.',
        category: 'translation',
        icon: 'Languages',
        route: '/tools/translation/ai-translator',
        isActive: true
    },
    {
        id: 'currency-converter',
        name: 'محول العملات',
        description: 'أسعار صرف لحظية للجنيه، الدولار، الريال، والمزيد.',
        category: 'finance',
        icon: 'Coins',
        route: '/tools/finance/currency',
        isActive: true
    },
    {
        id: 'table-generator',
        name: 'صانع الجداول',
        description: 'أنشئ جداول بيانات منظمة من أي نص عشوائي حالاً.',
        category: 'data',
        icon: 'Table',
        route: '/tools/data/table-generator',
        isActive: true
    },
    {
        id: 'qr-generator',
        name: 'منشئ QR Code',
        description: 'حول أي رابط أو نص لرمز QR قابل للمسح.',
        category: 'utils',
        icon: 'QrCode',
        route: '/tools/utils/qr-generator',
        isActive: true
    },
    {
        id: 'password-generator',
        name: 'مولد كلمات مرور',
        description: 'أنشئ كلمات مرور قوية ومعقدة لحماية حساباتك.',
        category: 'security',
        icon: 'Lock',
        route: '/tools/security/password-generator',
        isActive: true
    },
    {
        id: 'text-analyzer',
        name: 'محلل النصوص',
        description: 'احسب عدد الكلمات والحروف وحلل النصوص.',
        category: 'data',
        icon: 'FileText',
        route: '/tools/data/text-analyzer',
        isActive: true
    },
    {
        id: 'image-compressor',
        name: 'ضغط الصور',
        description: 'تقليل حجم الصور مع الحفاظ على الجودة للويب.',
        category: 'media',
        icon: 'Image',
        route: '/tools/media/image-compressor',
        isActive: true
    },
    {
        id: 'youtube-thumbnail',
        name: 'تحميل صور يوتيوب',
        description: 'تنزيل الصور المصغرة (Thumbnails) بجودة عالية.',
        category: 'media',
        icon: 'Youtube',
        route: '/tools/media/youtube-thumbnail',
        isActive: true
    },
    {
        id: 'json-formatter',
        name: 'منسق JSON',
        description: 'تنسيق وتصحيح أكواد JSON للمطورين.',
        category: 'data',
        icon: 'Code',
        route: '/tools/data/json-formatter',
        isActive: true
    },
    {
        id: 'unit-converter',
        name: 'محول الوحدات',
        description: 'تحويل الأطوال، الأوزان، والمساحات بسهولة.',
        category: 'utils',
        icon: 'Ruler',
        route: '/tools/utils/unit-converter',
        isActive: true
    },
    {
        id: 'age-calculator',
        name: 'حاسبة العمر',
        description: 'احسب عمرك بدقة بالسنين والشهور والأيام.',
        category: 'utils',
        icon: 'Calendar',
        route: '/tools/utils/age-calculator',
        isActive: true
    },
    {
        id: 'stopwatch',
        name: 'ساعة إيقاف',
        description: 'مؤقت وساعة إيقاف للمهام والرياضة.',
        category: 'utils',
        icon: 'Timer',
        route: '/tools/utils/stopwatch',
        isActive: true
    }
];
