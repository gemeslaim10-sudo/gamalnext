import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useChatStore } from "@/store/chatStore";

export function useAiChat(isOpen: boolean) {
    const { user } = useAuth();
    const store = useChatStore();

    useEffect(() => {
        if (isOpen) {
            store.initChat(user);
        }
    }, [isOpen, user, store]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!store.input.trim() || store.loading) return;

        const userMessage = store.input.trim();
        store.setInput("");
        store.addMessage({ role: 'user', text: userMessage });
        store.setLoading(true);

        try {
            // Build clean history: filter errors, then merge consecutive same-role messages
            const cleanMessages = store.messages.filter(m => !m.isError);
            const history: { role: string; parts: { text: string }[] }[] = [];
            
            for (const m of cleanMessages) {
                const last = history[history.length - 1];
                if (last && last.role === m.role) {
                    last.parts[0].text += "\n" + m.text;
                } else {
                    history.push({ role: m.role, parts: [{ text: m.text }] });
                }
            }
            
            // Gemini requires history to start with 'user'
            while (history.length > 0 && history[0].role === 'model') {
                history.shift();
            }

            const requestBody = {
                message: userMessage,
                history,
                userContext: store.userContext,
                sessionId: store.sessionId
            };

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            const rawText = await res.text();
            
            let data: Record<string, unknown>;
            try {
                data = JSON.parse(rawText);
            } catch {
                throw new Error("Invalid response from server");
            }

            if (!res.ok || data.error) {
                const errorMessage = (data.error || data.details || "Failed to connect to the server") as string;
                throw new Error(errorMessage);
            }

            const responseText = (data.response || data.text || data.message || "") as string;
            if (!responseText) {
                throw new Error("Received empty response from AI");
            }

            store.addMessage({ role: 'model', text: responseText });

        } catch (error) {
            console.error("Chat Error:", error);

            const errMsg = error instanceof Error ? error.message : "An unexpected error occurred";
            let userFriendlyError = `⚠️ Sorry, an error occurred: ${errMsg}`;

            if (errMsg.includes("Failed to fetch") || errMsg.includes("NetworkError")) {
                userFriendlyError = "⚠️ Sorry, cannot connect to the server right now. The server might be updating or restarting. Please try again in a few seconds.";
            }

            store.addMessage({
                role: 'model',
                text: userFriendlyError,
                isError: true
            });
        } finally {
            store.setLoading(false);
        }
    };

    return {
        messages: store.messages,
        input: store.input,
        setInput: store.setInput,
        loading: store.loading,
        handleSubmit,
        clearChat: store.clearChat
    };
}
