'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { collection, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-hot-toast';
import { Wrench, Save, RefreshCw } from 'lucide-react';

// Initial Hardcoded Tools to Seed the Database
const INITIAL_TOOLS = [
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

// A local component to prevent full page re-render on every keystroke
function ToolRow({ tool, onSave }: { tool: any, onSave: (toolData: any) => void }) {
    const [localTool, setLocalTool] = useState(tool);

    const handleChange = (field: string, value: any) => {
        const updated = { ...localTool, [field]: value };
        setLocalTool(updated);
        onSave(updated); // Parent will handle debounce and firestore
    };

    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1 space-y-4 w-full">
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Tool Name</label>
                        <input
                            value={localTool.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white"
                        />
                    </div>
                    <div className="w-1/3">
                        <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Category</label>
                        <input
                            value={localTool.category}
                            onChange={(e) => handleChange('category', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white"
                        />
                    </div>
                </div>
                <div>
                    <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Description</label>
                    <textarea
                        value={localTool.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white h-20"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-3 min-w-[150px]">
                <label className="flex items-center gap-2 cursor-pointer bg-slate-950 p-2 rounded border border-slate-800">
                    <input
                        type="checkbox"
                        checked={localTool.isActive}
                        onChange={(e) => handleChange('isActive', e.target.checked)}
                        className="w-4 h-4 rounded"
                    />
                    <span className={localTool.isActive ? "text-green-400" : "text-slate-500"}>
                        {localTool.isActive ? "Active" : "Disabled"}
                    </span>
                </label>

                <button
                    onClick={() => onSave(localTool)}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors"
                >
                    <Save className="w-4 h-4" /> Save
                </button>
            </div>
        </div>
    );
}

export default function AdminToolsPage() {
    const [tools, setTools] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // ── Debounce map: one timer per tool ID ──
    const debounceTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

    useEffect(() => {
        return () => {
            debounceTimers.current.forEach(timer => clearTimeout(timer));
        };
    }, []);

    useEffect(() => {
        fetchTools();
    }, []);

    const fetchTools = async () => {
        setLoading(true);
        try {
            const snap = await getDocs(collection(db, 'tools'));
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setTools(data);
        } catch (e) {
            console.error(e);
            toast.error("Failed to fetch tools");
        } finally {
            setLoading(false);
        }
    };

    const seedDatabase = async () => {
        if (!confirm("This will overwrite/reset standard tools. Continue?")) return;
        try {
            for (const tool of INITIAL_TOOLS) {
                await setDoc(doc(db, 'tools', tool.id), tool);
            }
            toast.success("Database seeded with initial tools");
            fetchTools();
        } catch (e) {
            console.error(e);
            toast.error("Failed to seed database");
        }
    };

    const saveChanges = async (updatedTool: any) => {
        try {
            await updateDoc(doc(db, 'tools', updatedTool.id), updatedTool);
            // Optionally show toast, but maybe noisy if auto-saving
        } catch (e) {
            toast.error("Failed to update");
        }
    };

    const debouncedSave = useCallback((updatedTool: any) => {
        const existing = debounceTimers.current.get(updatedTool.id);
        if (existing) clearTimeout(existing);

        const timer = setTimeout(() => {
            debounceTimers.current.delete(updatedTool.id);
            saveChanges(updatedTool);
        }, 1000); // Wait 1s after last keystroke

        debounceTimers.current.set(updatedTool.id, timer);
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Wrench className="text-blue-500" />
                    Manage Tools
                </h1>
                <button
                    onClick={seedDatabase}
                    className="flex items-center gap-2 bg-slate-800 text-slate-400 hover:text-white px-4 py-2 rounded-lg text-sm border border-slate-700"
                >
                    <RefreshCw className="w-4 h-4" />
                    Reset / Seed Defaults
                </button>
            </div>

            {loading ? (
                <div className="text-center text-slate-500 py-10">Loading tools...</div>
            ) : tools.length === 0 ? (
                <div className="text-center py-20 bg-slate-900 rounded-xl border border-dashed border-slate-700">
                    <p className="text-slate-400 mb-4">No tools found in database.</p>
                    <button onClick={seedDatabase} className="bg-blue-600 text-white px-6 py-2 rounded-lg">Initialize Database</button>
                </div>
            ) : (
                <div className="grid gap-6">
                    {tools.map((tool) => (
                        <ToolRow key={tool.id} tool={tool} onSave={debouncedSave} />
                    ))}
                </div>
            )}
        </div>
    );
}
