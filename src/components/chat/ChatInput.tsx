'use client';

import { Send } from 'lucide-react';

interface ChatInputProps {
    input: string;
    setInput: (val: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
}

export default function ChatInput({ input, setInput, onSubmit, loading }: ChatInputProps) {
    return (
        <form onSubmit={onSubmit} className="p-4 border-t border-slate-800 bg-slate-900/50">
            <div className="relative">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="اكتب رسالتك هنا..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    dir="auto"
                />
                <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:bg-slate-700 disabled:cursor-not-allowed"
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </form>
    );
}
