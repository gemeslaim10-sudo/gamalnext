import { useEffect, useState, type FormEvent } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { AI_SETTINGS_DOC, fillWelcome, resolveProfile, type AssistantDebug, type AssistantProfile } from "@/lib/ai/assistant/shared";

export interface TestMessage {
    id: string;
    role: "user" | "model";
    text: string;
    isError?: boolean;
    /** Full debug info for successful replies; failed requests may carry only `attempts` */
    debug?: Partial<AssistantDebug>;
}

let counter = 0;
const nextId = () => `m${Date.now().toString(36)}${counter++}`;

/**
 * Chats with the real assistant in admin test mode: same prompt, knowledge and models as the
 * live site, but nothing is stored (no lead, no chat log) and every reply comes with debug info.
 */
export function useAssistantTest() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<AssistantProfile | null>(null);
    const [profileError, setProfileError] = useState(false);
    const [messages, setMessages] = useState<TestMessage[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [visitorName, setVisitorName] = useState("");
    /** Empty = the model saved in the settings */
    const [model, setModel] = useState("");
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Read straight from Firestore (not the cached public endpoint) so a change saved a moment ago shows up
    useEffect(() => {
        getDoc(doc(db, AI_SETTINGS_DOC.collection, AI_SETTINGS_DOC.id))
            .then((snap) => setProfile(resolveProfile(snap.exists() ? snap.data() : undefined)))
            .catch((error) => {
                console.error("Could not load AI settings:", error);
                setProfileError(true);
            });
    }, []);

    const welcome = profile?.welcomeMessage ? fillWelcome(profile.welcomeMessage, visitorName.trim() || null) : "";

    const send = async (e: FormEvent) => {
        e.preventDefault();
        const text = input.trim();
        if (!text || loading || !user) return;

        const history = messages.filter((m) => !m.isError).map((m) => ({ role: m.role, parts: [{ text: m.text }] }));
        setInput("");
        setMessages((prev) => [...prev, { id: nextId(), role: "user", text }]);
        setLoading(true);

        try {
            const token = await user.getIdToken();
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    message: text,
                    history,
                    test: true,
                    model: model || undefined,
                    userContext: { name: visitorName.trim() || "Guest" },
                    page: "/",
                }),
            });
            const data = (await res.json().catch(() => ({}))) as { response?: string; error?: string; debug?: Partial<AssistantDebug> };
            const id = nextId();
            if (res.ok && data.response) {
                setMessages((prev) => [...prev, { id, role: "model", text: data.response!, debug: data.debug }]);
            } else {
                const reason = data.error || `HTTP ${res.status}`;
                setMessages((prev) => [...prev, { id, role: "model", isError: true, text: `فشل الرد: ${reason}`, debug: data.debug }]);
            }
            setSelectedId(id);
        } catch (error) {
            const id = nextId();
            setMessages((prev) => [
                ...prev,
                { id, role: "model", isError: true, text: `تعذّر الاتصال بالسيرفر: ${error instanceof Error ? error.message : String(error)}` },
            ]);
            setSelectedId(id);
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setMessages([]);
        setSelectedId(null);
    };

    const replies = messages.filter((m) => m.role === "model");
    const selected = replies.find((m) => m.id === selectedId) ?? replies[replies.length - 1] ?? null;

    return {
        profile,
        profileError,
        welcome,
        messages,
        input,
        setInput,
        loading,
        visitorName,
        setVisitorName,
        model,
        setModel,
        selected,
        setSelectedId,
        send,
        reset,
    };
}
