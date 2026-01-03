"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, X, Bot, User, Loader2, Minimize2, Minimize, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

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

    // Initialize: Fetch Settings & User Profile
    useEffect(() => {
        const initChat = async () => {
            if (hasInitialized.current) return;
            hasInitialized.current = true;

            try {
                // 1. Fetch AI Settings (Welcome Message)
                let welcomeText = "أهلًا وسهلًا بك في منصة جمال 👋 منوّر موقعنا!\nأنا المساعد الافتراضي هنا، ومتحمس أعرّفك على جمال وخدماته الرائعة: تطوير مواقع ديناميكية، متاجر إلكترونية، لوحات تحكم، وتحسين SEO باستخدام أحدث التقنيات، وأيضًا دمج الذكاء الاصطناعي (Gemini AI)! 🚀\n\nممكن أعرف حضرتك يسعدني جداً مساعدتك، ما هو اسمك الكريم؟ 😊";
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
                    welcomeText = welcomeText.replace("{name}", "يا صديقي");
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

            // Get or create Session ID
            let sessionId = sessionStorage.getItem("chatSessionId");
            if (!sessionId) {
                sessionId = crypto.randomUUID();
                sessionStorage.setItem("chatSessionId", sessionId);
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
                const errorMessage = data.error || data.details || "فشل الاتصال بالخادم";
                throw new Error(errorMessage);
            }

            setMessages(prev => [...prev, { role: 'model', text: data.response }]);

        } catch (error: any) {
            console.error("Chat Error:", error);

            let userFriendlyError = `⚠️ عذراً، حدث خطأ: ${error.message || "حدث خطأ غير متوقع"}`;

            // Handle Network/Server Down errors specifically
            if (error.message && (error.message.includes("Failed to fetch") || error.message.includes("NetworkError"))) {
                userFriendlyError = "⚠️ عذراً، لا يمكن الاتصال بالخادم حالياً. قد يكون الخادم قيد التحديث أو إعادة التشغيل. الرجاء المحاولة مرة أخرى بعد ثوانٍ.";
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
                    className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg shadow-blue-500/20 text-white cursor-pointer group"
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
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-slate-700/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-600 rounded-lg">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">المساعد الذكي</h3>
                                    <p className="text-xs text-blue-300 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                        متاح الآن
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {messages.length === 0 && loading && (
                                <div className="text-center mt-10 space-y-4">
                                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
                                    <p className="text-slate-400 text-sm">جاري التجهيز...</p>
                                </div>
                            )}

                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-purple-600' : 'bg-blue-600'}`}>
                                        {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                                    </div>
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                            ? 'bg-purple-600/20 text-purple-100 rounded-tr-none border border-purple-500/20'
                                            : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                                            }`}
                                    >
                                        <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                                    </div>
                                </div>
                            ))}

                            {loading && messages.length > 0 && (
                                <div className="flex items-center gap-2 text-slate-500 text-sm p-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>جاري الكتابة...</span>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSubmit} className="p-4 border-t border-slate-800 bg-slate-900/50">
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
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
