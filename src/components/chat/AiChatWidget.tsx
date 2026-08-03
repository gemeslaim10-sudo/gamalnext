"use client";

import { useState, useEffect, useRef } from "react";
import { Bot, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Extracted Sub-components
import ChatHeader from "../chat/ChatHeader";
import ChatMessage from "../chat/ChatMessage";
import ChatInput from "../chat/ChatInput";

import { useAiChat } from "./useAiChat";
import { usePathname } from "next/navigation";

interface AiChatWidgetProps {
    inline?: boolean;
}

export default function AiChatWidget({ inline = false }: AiChatWidgetProps = {}) {
    const [isOpen, setIsOpen] = useState(inline);
    const pathname = usePathname();
    const isHomePage = pathname === '/';
    
    const { messages, input, setInput, loading, handleSubmit, clearChat } = useAiChat(isOpen);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Listen for external open trigger (from GlobalSidebar)
    useEffect(() => {
        const handleOpenChat = () => setIsOpen(true);
        document.addEventListener('open-chat-widget', handleOpenChat);
        return () => document.removeEventListener('open-chat-widget', handleOpenChat);
    }, []);

    // Completely hide the floating widget on the homepage for ALL devices, 
    // because we display it inline instead
    if (!inline && isHomePage) {
        return null;
    }

    const inlineClasses = "w-full h-[500px] md:h-[600px] bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-2xl shadow-xl flex flex-col overflow-hidden";
    const floatingClasses = "w-[calc(100vw-32px)] sm:w-[400px] h-[80dvh] sm:h-[600px] max-h-[800px] bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden";

    const chatWindowClasses = inline ? inlineClasses : floatingClasses;

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

    const chatContent = (
        <div className={chatWindowClasses}>
            {/* Header Component */}
            <ChatHeader 
                onClose={inline ? undefined : () => setIsOpen(false)} 
                onCopyChat={handleCopyChat}
                onClearChat={clearChat}
            />

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
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

            {/* Input Area Component */}
            <ChatInput
                input={input}
                setInput={setInput}
                onSubmit={handleSubmit}
                loading={loading}
            />
        </div>
    );

    if (inline) {
        return chatContent;
    }

    return (
        <>
            {/* Toggle Button */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-[80px] sm:bottom-[104px] right-4 sm:right-6 z-50 p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg shadow-blue-500/20 text-white cursor-pointer group"
                >
                    <Bot className="w-7 h-7 sm:w-8 sm:h-8 group-hover:rotate-12 transition-transform" />
                    <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-red-500 rounded-full animate-pulse border-2 border-slate-900"></span>
                </motion.button>
            )}

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 origin-bottom-right"
                    >
                        {chatContent}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
