'use client';

import { useState } from 'react';
import { Languages, ArrowRightLeft, Copy, Check, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useToolHistory } from '@/hooks/useToolHistory';

const LANGUAGES = [
    { code: 'ar', name: 'العربية' },
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'zh', name: 'Chinese (Simplified)' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ru', name: 'Russian' },
];

export default function AiTranslatorPage() {
    const [text, setText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [sourceLang, setSourceLang] = useState('auto');
    const [targetLang, setTargetLang] = useState('en');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const { addToHistory } = useToolHistory();

    const handleTranslate = async () => {
        if (!text.trim()) return;

        setLoading(true);
        try {
            const res = await fetch('/api/ai-translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, sourceLang, targetLang }),
            });

            const data = await res.json();
            if (res.ok) {
                setTranslatedText(data.translation);
                addToHistory('ai-translator', 'مترجم AI', `Translated ${text.slice(0, 20)}... from ${sourceLang} to ${targetLang}`);
            } else {
                toast.error(data.error || "Translation failed");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(translatedText);
        setCopied(true);
        toast.success("تم النسخ!");
        setTimeout(() => setCopied(false), 2000);
    };

    const swapLanguages = () => {
        if (sourceLang === 'auto') {
            toast.error("لا يمكن التبديل مع 'Auto Detect'");
            return;
        }
        setSourceLang(targetLang);
        setTargetLang(sourceLang);
        setText(translatedText);
        setTranslatedText(text);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Languages className="text-blue-400" />
                مترجم AI الذكي
                <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full border border-purple-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Powered by Gemini
                </span>
            </h1>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                {/* Controls */}
                <div className="bg-slate-950/50 p-4 border-b border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <select
                            value={sourceLang}
                            onChange={(e) => setSourceLang(e.target.value)}
                            className="bg-slate-800 border-slate-700 text-white text-sm rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-40"
                        >
                            <option value="auto">Auto Detect</option>
                            {LANGUAGES.map(l => <option key={l.code} value={l.name}>{l.name}</option>)}
                        </select>

                        <button onClick={swapLanguages} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400">
                            <ArrowRightLeft className="w-5 h-5" />
                        </button>

                        <select
                            value={targetLang}
                            onChange={(e) => setTargetLang(e.target.value)}
                            className="bg-slate-800 border-slate-700 text-white text-sm rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-40"
                        >
                            {LANGUAGES.map(l => <option key={l.code} value={l.name}>{l.name}</option>)}
                        </select>
                    </div>

                    <button
                        onClick={handleTranslate}
                        disabled={loading || !text}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-colors disabled:opacity-50 flex items-center gap-2 w-full md:w-auto justify-center"
                    >
                        {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                        ترجمة
                    </button>
                </div>

                {/* Input/Output Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 min-h-[400px]">
                    <div className="p-4 border-b md:border-b-0 md:border-l border-slate-800 bg-slate-900/50">
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="أدخل النص هنا..."
                            className="w-full h-full bg-transparent resize-none outline-none text-lg text-slate-200 placeholder-slate-500"
                            dir="auto"
                        />
                    </div>
                    <div className="p-4 bg-slate-950/30 relative">
                        {loading ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm z-10 text-blue-400">
                                <Loader2 className="w-8 h-8 animate-spin" />
                            </div>
                        ) : null}

                        {translatedText ? (
                            <>
                                <textarea
                                    readOnly
                                    value={translatedText}
                                    className="w-full h-full bg-transparent resize-none outline-none text-lg text-blue-100"
                                    dir="auto"
                                />
                                <button
                                    onClick={copyToClipboard}
                                    className="absolute bottom-4 left-4 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors border border-slate-700"
                                    title="Copy Translation"
                                >
                                    {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                                </button>
                            </>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-600 select-none">
                                الترجمة ستظهر هنا
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center text-slate-500 text-sm">
                يستخدم تقنيات الذكاء الاصطناعي المتقدمة (Gemini Pro) لضمان دقة المعنى وليس مجرد ترجمة حرفية.
            </div>
        </div>
    );
}
