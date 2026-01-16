'use client';

import { useState } from 'react';
import { Code, Check, AlertTriangle, Copy, Trash2, FileJson } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useToolHistory } from '@/hooks/useToolHistory';

export default function JsonFormatterPage() {
    const [input, setInput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { addToHistory } = useToolHistory();

    const handleFormat = () => {
        if (!input.trim()) return;
        try {
            const parsed = JSON.parse(input);
            setInput(JSON.stringify(parsed, null, 4));
            setError(null);
            toast.success("Valid JSON Formatted");
            addToHistory('json-formatter', 'منسق JSON', 'Formatted JSON Code');
        } catch (e: any) {
            setError(e.message);
            toast.error("Invalid JSON");
        }
    };

    const handleMinify = () => {
        if (!input.trim()) return;
        try {
            const parsed = JSON.parse(input);
            setInput(JSON.stringify(parsed));
            setError(null);
            toast.success("Minified");
        } catch (e: any) {
            setError(e.message);
        }
    };

    const copyToClipboard = () => {
        if (!input) return;
        navigator.clipboard.writeText(input);
        toast.success("Copied!");
    };

    return (
        <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Code className="text-yellow-400" />
                    منسق ومصحح JSON
                </h1>
                <div className="flex gap-2">
                    <button onClick={handleMinify} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-white">Minify</button>
                    <button onClick={handleFormat} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm text-white font-bold">Format (Beautify)</button>
                </div>
            </div>

            <div className={`flex-1 bg-slate-900 border ${error ? 'border-red-500/50' : 'border-slate-800'} rounded-2xl flex flex-col overflow-hidden relative`}>
                <div className="flex justify-between items-center bg-slate-950 px-4 py-2 border-b border-slate-800">
                    <div className="flex items-center gap-2 text-xs">
                        <FileJson className="w-4 h-4 text-slate-500" />
                        <span className={error ? "text-red-400" : "text-green-400"}>
                            {error ? "Invalid JSON" : "Valid JSON"}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setInput('')} title="Clear" className="p-1.5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded"><Trash2 className="w-4 h-4" /></button>
                        <button onClick={copyToClipboard} title="Copy" className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded"><Copy className="w-4 h-4" /></button>
                    </div>
                </div>

                <textarea
                    value={input}
                    onChange={(e) => { setInput(e.target.value); setError(null); }}
                    placeholder="Paste your JSON here..."
                    className="flex-1 w-full bg-[#1e1e1e] p-6 text-sm text-green-300 font-mono resize-none outline-none leading-relaxed"
                    spellCheck="false"
                />

                {error && (
                    <div className="absolute bottom-0 left-0 w-full bg-red-900/90 text-red-100 p-4 text-sm font-mono border-t border-red-500/50 backdrop-blur-md">
                        <div className="flex items-center gap-2 font-bold mb-1">
                            <AlertTriangle className="w-4 h-4" /> Error Parsing JSON:
                        </div>
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}
