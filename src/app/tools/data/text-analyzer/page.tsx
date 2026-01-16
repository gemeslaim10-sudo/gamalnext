'use client';

import { useState, useMemo, useEffect } from 'react';
import { FileText, AlignLeft, Clock } from 'lucide-react';
import { useToolHistory } from '@/hooks/useToolHistory';

export default function TextAnalyzerPage() {
    const [text, setText] = useState('');
    const { addToHistory } = useToolHistory();

    const stats = useMemo(() => {
        const trimmed = text.trim();
        if (!trimmed) return { words: 0, chars: 0, charsNoSpaces: 0, sentences: 0, readingTime: 0 };

        const words = trimmed.split(/\s+/).length;
        const chars = text.length;
        const charsNoSpaces = text.replace(/\s/g, '').length;
        const sentences = text.split(/[.!?]+/).filter(Boolean).length;
        const readingTime = Math.ceil(words / 200); // Average 200 wpm

        return { words, chars, charsNoSpaces, sentences, readingTime };
    }, [text]);

    // Debounce history saving
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (stats.words > 0) {
                addToHistory('text-analyzer', 'محلل النصوص', `Analyzed text: ${stats.words} words, ${stats.chars} chars`);
            }
        }, 3000);
        return () => clearTimeout(timeout);
    }, [stats.words, stats.chars]);

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
            <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <FileText className="text-teal-400" />
                محلل النصوص
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-white mb-1">{stats.words}</div>
                    <div className="text-xs text-slate-400 uppercase">كلمات</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-white mb-1">{stats.chars}</div>
                    <div className="text-xs text-slate-400 uppercase">حروف</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-white mb-1">{stats.sentences}</div>
                    <div className="text-xs text-slate-400 uppercase">جمل</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-white mb-1 flex items-center justify-center gap-1">
                        {stats.readingTime} <span className="text-xs font-normal text-slate-500">د</span>
                    </div>
                    <div className="text-xs text-slate-400 uppercase">وقت القراءة</div>
                </div>
            </div>

            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-1 overflow-hidden flex flex-col">
                <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center gap-2 text-xs text-slate-500">
                    <AlignLeft className="w-4 h-4" />
                    محرر النصوص
                </div>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="اكتب أو الصق النص هنا للتحليل..."
                    className="flex-1 w-full bg-transparent p-6 text-lg text-slate-200 resize-none outline-none leading-relaxed"
                />
            </div>
        </div>
    );
}
