'use client';

import { useState } from 'react';
import { Table, Wand2, Download, Copy, FileJson, FileType, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useToolHistory } from '@/hooks/useToolHistory';

export default function TableGeneratorPage() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [format, setFormat] = useState('html');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const { addToHistory } = useToolHistory();

    const handleGenerate = async () => {
        if (!input.trim()) return;
        setLoading(true);
        try {
            const res = await fetch('/api/ai-table', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: input, type: format }),
            });
            const data = await res.json();
            if (res.ok) {
                setOutput(data.data);
                addToHistory('table-generator', 'صانع الجداول', `Generated ${format.toUpperCase()} table from text`);
            } else {
                toast.error("Failed to generate table");
            }
        } catch (e) {
            toast.error("Error generating table");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        toast.success("تم النسخ!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Table className="text-orange-400" />
                صانع الجداول الذكي
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col h-[500px]">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <span className="bg-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                        أدخل البيانات (نص عشوائي)
                    </h3>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="مثال: قائمة بالدول وعواصمها والعملات... أو انسخ نص من إيميل أو ملف PDF وسيقوم الذكاء الاصطناعي بتنظيمه."
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-300 resize-none outline-none focus:border-blue-500 transition-colors mb-4"
                    />

                    <div className="flex items-center gap-4">
                        <select
                            value={format}
                            onChange={(e) => setFormat(e.target.value)}
                            className="bg-slate-800 text-white rounded-lg px-4 py-3 outline-none border border-slate-700 focus:border-blue-500"
                        >
                            <option value="html">HTML Table</option>
                            <option value="json">JSON Data</option>
                            <option value="csv">CSV (Excel)</option>
                        </select>
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !input}
                            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg py-3 hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <Wand2 className="animate-spin" /> : <Wand2 />}
                            تحويل إلى جدول
                        </button>
                    </div>
                </div>

                {/* Output */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col h-[500px] relative overflow-hidden">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <span className="bg-green-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                        النتيجة
                    </h3>

                    {output ? (
                        <>
                            <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800 overflow-auto p-4 custom-scrollbar">
                                {format === 'html' ? (
                                    <div dangerouslySetInnerHTML={{ __html: output }} className="prose prose-invert max-w-none" />
                                ) : (
                                    <pre className="text-xs text-blue-300 font-mono whitespace-pre-wrap">{output}</pre>
                                )}
                            </div>
                            <div className="mt-4 flex gap-3">
                                <button
                                    onClick={copyToClipboard}
                                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                    نسخ الكود
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-xl">
                            <Table className="w-16 h-16 opacity-20 mb-4" />
                            <p>الجدول سيظهر هنا</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
