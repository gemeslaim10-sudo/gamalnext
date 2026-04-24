import { useState, useEffect, useRef } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import type { Message, UserContext } from "./types";

export function useAiChat(isOpen: boolean) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [userContext, setUserContext] = useState<UserContext>({ name: "Guest", gender: "Unknown" });

    const hasInitialized = useRef(false);

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
            const history = messages.map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            }));

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
                    userContext,
                    sessionId
                }),
            });

            const data = await res.json().catch(() => ({})); 

            if (!res.ok) {
                const errorMessage = data.error || data.details || "Failed to connect to the server";
                throw new Error(errorMessage);
            }

            setMessages(prev => [...prev, { role: 'model', text: data.response }]);

        } catch (error: any) {
            console.error("Chat Error:", error);

            let userFriendlyError = `⚠️ Sorry, an error occurred: ${error.message || "An unexpected error occurred"}`;

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

    return {
        messages,
        input,
        setInput,
        loading,
        handleSubmit
    };
}
