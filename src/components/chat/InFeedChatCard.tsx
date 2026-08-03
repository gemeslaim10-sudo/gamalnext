'use client';

import { useState, useEffect, useRef } from 'react';
import { useAiChat } from './useAiChat';
import { TeaserCard } from './components/TeaserCard';
import { FullscreenChatOverlay } from './components/FullscreenChatOverlay';

export default function InFeedChatCard() {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isXl, setIsXl] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia('(min-width: 1280px)').matches;
    });
    const { messages, input, setInput, loading, handleSubmit, clearChat } = useAiChat(!isXl);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mql = window.matchMedia('(min-width: 1280px)');
        const handler = (e: MediaQueryListEvent) => setIsXl(e.matches);
        mql.addEventListener('change', handler);
        return () => mql.removeEventListener('change', handler);
    }, []);

    useEffect(() => {
        if (isFullScreen) {
            const container = chatContainerRef.current;
            if (container) {
                container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
            }
        }
    }, [messages, isFullScreen]);

    useEffect(() => {
        if (isFullScreen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isFullScreen]);

    const handleTeaserSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;
        handleSubmit(e);
        setIsFullScreen(true);
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

    if (isXl) return null;

    const welcomeMsg = messages.find(m => m.role === 'model');

    return (
        <>
            <TeaserCard 
                welcomeMsg={welcomeMsg}
                input={input}
                setInput={setInput}
                handleTeaserSubmit={handleTeaserSubmit}
                loading={loading}
            />

            {isFullScreen && (
                <FullscreenChatOverlay 
                    messages={messages as { role: 'model' | 'user'; text: string; isError?: boolean }[]}
                    loading={loading}
                    input={input}
                    setInput={setInput}
                    handleSubmit={handleSubmit}
                    clearChat={clearChat}
                    handleCopyChat={handleCopyChat}
                    onClose={() => setIsFullScreen(false)}
                    chatContainerRef={chatContainerRef}
                    messagesEndRef={messagesEndRef}
                />
            )}
        </>
    );
}
