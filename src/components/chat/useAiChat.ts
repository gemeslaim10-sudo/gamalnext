import { useEffect, type FormEvent } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useChatStore } from "@/store/chatStore";
import { fillWelcome, isRealName } from "@/lib/ai/assistant/shared";

/** How many earlier messages go with each request (the server trims further). */
const HISTORY_LIMIT = 30;

/**
 * Safety-net texts, shown only when a request fails. Everything else the widget shows comes
 * from the dashboard (GET /api/chat). Picked by the language of the visitor's message.
 */
const ERROR_TEXT = {
    en: {
        failed: "Sorry, I couldn't reply just now. Please try again in a moment.",
        busy: "You're sending messages quickly. Please wait a minute and try again.",
        offline: "Can't reach the server right now. Check your connection and try again.",
    },
    ar: {
        failed: "معلش، مقدرتش أرد دلوقتي. جرّب تاني بعد لحظات.",
        busy: "بتبعت رسائل كتير ورا بعض. استنى دقيقة وجرّب تاني.",
        offline: "مش قادر أوصل للسيرفر دلوقتي. اتأكد من الاتصال وجرّب تاني.",
    },
};

class ChatRequestError extends Error {
    constructor(readonly status: number) {
        super(`Chat request failed (${status})`);
    }
}

export function useAiChat(isOpen: boolean) {
    const { user, loading: authLoading } = useAuth();
    const pathname = usePathname();

    const messages = useChatStore((s) => s.messages);
    const input = useChatStore((s) => s.input);
    const loading = useChatStore((s) => s.loading);
    const userContext = useChatStore((s) => s.userContext);
    const config = useChatStore((s) => s.config);
    const configStatus = useChatStore((s) => s.configStatus);
    const setInput = useChatStore((s) => s.setInput);
    const setLoading = useChatStore((s) => s.setLoading);
    const addMessage = useChatStore((s) => s.addMessage);
    const initChat = useChatStore((s) => s.initChat);
    const loadConfig = useChatStore((s) => s.loadConfig);
    const clearChat = useChatStore((s) => s.clearChat);

    // The dashboard texts load right away; the conversation waits for Firebase auth, so a signed-in
    // visitor gets their own conversation instead of a guest one
    useEffect(() => {
        if (isOpen) void loadConfig();
    }, [isOpen, loadConfig]);

    useEffect(() => {
        if (isOpen && !authLoading) void initChat(user);
    }, [isOpen, authLoading, user, initChat]);

    const welcome = config ? fillWelcome(config.welcomeMessage, isRealName(userContext.name) ? userContext.name : null) : "";

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const text = input.trim();
        if (!text || loading) return;

        const history = messages
            .filter((m) => !m.isError)
            .slice(-HISTORY_LIMIT)
            .map((m) => ({ role: m.role, parts: [{ text: m.text }] }));

        setInput("");
        addMessage({ role: "user", text });
        setLoading(true);

        try {
            const headers: Record<string, string> = { "Content-Type": "application/json" };
            // Signed-in visitors prove who they are, so a lead they leave is linked to their account
            if (user) {
                try {
                    headers.Authorization = `Bearer ${await user.getIdToken()}`;
                } catch {
                    // Chatting still works without it
                }
            }

            const res = await fetch("/api/chat", {
                method: "POST",
                headers,
                body: JSON.stringify({
                    message: text,
                    history,
                    userContext: { name: userContext.name, phone: userContext.phone },
                    page: pathname,
                }),
            });
            const data = (await res.json().catch(() => ({}))) as { response?: unknown };
            if (!res.ok || typeof data.response !== "string" || !data.response.trim()) throw new ChatRequestError(res.status);

            addMessage({ role: "model", text: data.response });
        } catch (error) {
            console.error("Chat error:", error);
            const copy = /[؀-ۿ]/.test(text) ? ERROR_TEXT.ar : ERROR_TEXT.en;
            const status = error instanceof ChatRequestError ? error.status : 0;
            addMessage({ role: "model", isError: true, text: status === 429 ? copy.busy : status === 0 ? copy.offline : copy.failed });
        } finally {
            setLoading(false);
        }
    };

    return { messages, input, setInput, loading, handleSubmit, clearChat, config, configStatus, welcome };
}
