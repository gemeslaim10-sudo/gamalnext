'use client';

import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
    role: 'user' | 'model';
    text: string;
    isError?: boolean;
}

export default function ChatMessage({ role, text, isError }: ChatMessageProps) {
    return (
        <div
            className={`flex items-start gap-3 ${role === 'user' ? 'flex-row-reverse' : ''}`}
        >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${role === 'user' ? 'bg-purple-600' : isError ? 'bg-rose-600' : 'bg-blue-600'}`}>
                {role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
            </div>
            <div
                dir="auto"
                className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${role === 'user'
                    ? 'bg-purple-600/20 text-purple-100 rounded-tr-none border border-purple-500/20'
                    : isError
                        ? 'bg-rose-500/20 text-rose-200 rounded-tl-none border border-rose-500/30'
                        : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                    }`}
            >
                <div style={{ whiteSpace: 'pre-wrap' }}>{text.replace(/\[\[LEAD_DATA:[\s\S]*?\]\]/g, '').trim()}</div>
            </div>
        </div>
    );
}
