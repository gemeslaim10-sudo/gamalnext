'use client';

import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import ChatHeader from './ChatHeader';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useAiChat } from './useAiChat';

function InlineChatContent() {
    const { messages, input, setInput, loading, handleSubmit } = useAiChat(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="w-full h-[500px] bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-2xl shadow-xl flex flex-col overflow-hidden">
            <ChatHeader />

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.length === 0 && loading && (
                    <div className="text-center mt-10 space-y-4">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
                        <p className="text-slate-400 text-sm">Preparing...</p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <ChatMessage key={idx} role={msg.role} text={msg.text} />
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

export default InlineChatContent;
