'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import ChatHeader from './ChatHeader';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useAiChat } from './useAiChat';

export default function InlineChatWidget() {
    const [isXl, setIsXl] = useState(() => {
        if (typeof window === 'undefined') return true;
        return window.matchMedia('(min-width: 1280px)').matches;
    });

    useEffect(() => {
        const mql = window.matchMedia('(min-width: 1280px)');
        const handler = (e: MediaQueryListEvent) => setIsXl(e.matches);
        mql.addEventListener('change', handler);
        return () => mql.removeEventListener('change', handler);
    }, []);

    const { messages, input, setInput, loading, handleSubmit, clearChat } = useAiChat(isXl);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = chatContainerRef.current;
        if (container) {
            container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);

    const handleCopyChat = () => {
        if (messages.length === 0) return;
        const formattedChat = messages.map(msg => {
            const sender = msg.role === 'model' ? '🤖 Smart Assistant' : '👤 Guest/Client';
            const cleanText = msg.text.replace(/\[\[LEAD_DATA:[\s\S]*?\]\]/g, '').trim();
            return `${sender}:\n${cleanText}\n`;
        }).join('\n');
        
        navigator.clipboard.writeText(formattedChat);
        import('react-hot-toast').then(({ toast }) => {
            toast.success('Chat copied to clipboard!');
        });
    };

    return (
        <div className="w-full h-[calc(90vh-8rem)] bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-2xl shadow-xl flex flex-col overflow-hidden">
            <ChatHeader onCopyChat={handleCopyChat} onClearChat={clearChat} />

            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.length === 0 && loading && (
                    <div className="text-center mt-10 space-y-4">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
                        <p className="text-slate-400 text-sm">Preparing...</p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <ChatMessage key={idx} role={msg.role} text={msg.text} isError={msg.isError} />
                ))}

                {loading && messages.length > 0 && (
                    <div className="flex items-center gap-2 text-slate-500 text-sm p-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Typing...</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <ChatInput
                input={input}
                setInput={setInput}
                onSubmit={handleSubmit}
                loading={loading}
            />
        </div>
    );
}
