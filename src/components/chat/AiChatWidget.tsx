"use client";

import { useState, useEffect, useRef } from "react";
import { Bot, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Extracted Sub-components
import ChatHeader from "../chat/ChatHeader";
import ChatMessage from "../chat/ChatMessage";
import ChatInput from "../chat/ChatInput";

import { useAiChat } from "./useAiChat";

export default function AiChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const { messages, input, setInput, loading, handleSubmit } = useAiChat(isOpen);
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
                    className="fixed bottom-[104px] right-6 z-50 p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg shadow-blue-500/20 text-white cursor-pointer group"
                >
                    <Bot className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-slate-900"></span>
                </motion.button>
            )}

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[400px] h-[500px] md:h-[600px] bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header Component */}
                        <ChatHeader onClose={() => setIsOpen(false)} />

                        {/* Messages Area */}
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

                        {/* Input Area Component */}
                        <ChatInput
                            input={input}
                            setInput={setInput}
                            onSubmit={handleSubmit}
                            loading={loading}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
