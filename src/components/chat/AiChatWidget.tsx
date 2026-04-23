"use client";

import { useState, useEffect, useRef } from "react";
import { Bot, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

// Extracted Sub-components
import ChatHeader from "../chat/ChatHeader";
import ChatMessage from "../chat/ChatMessage";
import ChatInput from "../chat/ChatInput";

type Message = {
    role: 'user' | 'model';
    text: string;
};

export default function AiChatWidget() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    // User Context for AI
    const [userContext, setUserContext] = useState({ name: "Guest", gender: "Unknown" });
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const hasInitialized = useRef(false);

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

    // Initialize: Fetch Settings & User Profile
    useEffect(() => {
        const initChat = async () => {
            if (hasInitialized.current) return;
            hasInitialized.current = true;

            try {
                // 1. Fetch AI Settings (Welcome Message)
                let welcomeText = "Welcome to Gamal's platform 👋 Glad to have you here!\nI am the virtual assistant here, excited to introduce you to Gamal and his amazing services: building websites, creating e-commerce stores (WordPress & Shopify), and providing integrated WhatsApp API solutions. 🚀\n\nMay I know your name? I'd be very happy to assist you! 😊";
                const aiDoc = await getDoc(doc(db, "settings", "ai"));
                if (aiDoc.exists() && aiDoc.data().welcomeMessage) {
                    welcomeText = aiDoc.data().welcomeMessage;
                }

                // 2. Fetch User Details if logged in
                let userName = "Guest";
                let userGender = "Unknown";

                if (user) {
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        userName = userData.name || user.displayName || "User";
                        userGender = userData.gender || "Unknown";
                    } else {
                        userName = user.displayName || "User";
                    }
                }

                setUserContext({ name: userName, gender: userGender });

                // 3. Personalize Welcome Message
                if (userName !== "Guest") {
                    welcomeText = welcomeText.replace("{name}", userName);
                } else {
                    welcomeText = welcomeText.replace("{name}", "my friend");
                }

                setMessages([{ role: 'model', text: welcomeText }]);

            } catch (error) {
                console.error("Chat Init Error:", error);
            }
        };

        if (isOpen) {
            initChat();
        }
    }, [isOpen, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setLoading(true);

        try {
            // Transform history for Gemini API (user/model roles)
            const history = messages.map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            }));

            // Get or create Session ID:
            // - Authenticated users get a deterministic ID based on their UID
            //   (consistent across tabs and devices).
            // - Guests get a UUID stored in localStorage
            //   (persists across tabs in the same browser).
            let sessionId: string;
            if (user?.uid) {
                sessionId = `session_${user.uid}`;
            } else {
                sessionId = localStorage.getItem("chatSessionId") || "";
                if (!sessionId) {
                    sessionId = crypto.randomUUID();
                    localStorage.setItem("chatSessionId", sessionId);
                }
            }

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    history,
                    userContext, // Pass user context to API
                    sessionId // Pass Session ID for archiving
                }),
            });

            const data = await res.json().catch(() => ({})); // Safe parse

            if (!res.ok) {
                // Use backend error message if available
                const errorMessage = data.error || data.details || "Failed to connect to the server";
                throw new Error(errorMessage);
            }

            setMessages(prev => [...prev, { role: 'model', text: data.response }]);

        } catch (error: any) {
            console.error("Chat Error:", error);

            let userFriendlyError = `⚠️ Sorry, an error occurred: ${error.message || "An unexpected error occurred"}`;

            // Handle Network/Server Down errors specifically
            if (error.message && (error.message.includes("Failed to fetch") || error.message.includes("NetworkError"))) {
                userFriendlyError = "⚠️ Sorry, cannot connect to the server right now. The server might be updating or restarting. Please try again in a few seconds.";
            }

            setMessages(prev => [...prev, {
                role: 'model',
                text: userFriendlyError
            }]);
        } finally {
            setLoading(false);
        }
    };

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
