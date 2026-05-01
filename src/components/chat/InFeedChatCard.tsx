'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Send, Loader2 } from 'lucide-react';

import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ChatHeader from './ChatHeader';
import { useAiChat } from './useAiChat';

export default function InFeedChatCard() {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isXl, setIsXl] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia('(min-width: 1280px)').matches;
    });
    const { messages, input, setInput, loading, handleSubmit, clearChat } = useAiChat(!isXl);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Subscribe to xl breakpoint changes
    useEffect(() => {
        const mql = window.matchMedia('(min-width: 1280px)');
        const handler = (e: MediaQueryListEvent) => setIsXl(e.matches);
        mql.addEventListener('change', handler);
        return () => mql.removeEventListener('change', handler);
    }, []);

    // Get welcome message (first bot message)
    const welcomeMsg = messages.find(m => m.role === 'model');

    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isFullScreen) {
            const container = chatContainerRef.current;
            if (container) {
                container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
            }
        }
    }, [messages, isFullScreen]);

    // Lock body scroll when fullscreen
    useEffect(() => {
        if (isFullScreen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isFullScreen]);

    // Handle submit from teaser card input — submit first, then go fullscreen
    const handleTeaserSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;
        handleSubmit(e);       // Send the message immediately
        setIsFullScreen(true); // Then open fullscreen to see the response
    };

    const handleCopyChat = () => {
        if (messages.length === 0) return;
        const formattedChat = messages.map(msg => {
            const sender = msg.role === 'model' ? '🤖 Smart Assistant' : '👤 Guest/Client';
            return `${sender}:\n${msg.text}\n`;
        }).join('\n');
        
        navigator.clipboard.writeText(formattedChat);
        import('react-hot-toast').then(({ toast }) => {
            toast.success('Chat copied to clipboard!');
        });
    };

    // Don't render on xl screens (InlineChatWidget handles it)
    if (isXl) return null;

    return (
        <>
            {/* ── Teaser Card (looks like a post) ──────────────── */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <ChatHeader 
                    className="p-4 flex items-center justify-between" 
                />

                {/* Welcome Message */}
                <div className="px-4 pb-3">
                    <div className="bg-slate-800/50 rounded-xl p-3 text-sm text-slate-300 leading-relaxed" dir="auto">
                        {welcomeMsg ? welcomeMsg.text : (
                            <div className="flex items-center gap-2 text-slate-500">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Loading...</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Input */}
                <form onSubmit={handleTeaserSubmit} className="px-4 pb-4">
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your reply..."
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-4 pr-11 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                            dir="auto"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || loading}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:bg-slate-700"
                        >
                            <Send className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </form>
            </div>

            {/* ── Fullscreen Chat Overlay (portaled to body) ──── */}
            {isFullScreen && createPortal(
                <div className="fixed inset-0 z-[200] bg-[#030712] flex flex-col animate-in slide-in-from-bottom duration-300">
                    {/* Header with back button */}
                    <ChatHeader 
                        onBack={() => setIsFullScreen(false)} 
                        onCopyChat={handleCopyChat}
                        onClearChat={clearChat}
                    />

                    {/* Messages */}
                    <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
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

                    {/* Input */}
                    <ChatInput
                        input={input}
                        setInput={setInput}
                        onSubmit={handleSubmit}
                        loading={loading}
                    />
                </div>,
                document.body
            )}
        </>
    );
}
