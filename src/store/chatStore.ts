import { create } from "zustand";
import type { User } from "firebase/auth";
import type { Message, PublicChatConfig, UserContext } from "@/components/chat/types";
import { deleteChatMessages, fetchChatConfig, fetchChatMessages, fetchUserContextData } from "./chatStoreHelpers";

type LoadStatus = "idle" | "loading" | "ready" | "error";

interface ChatState {
    messages: Message[];
    input: string;
    loading: boolean;
    userContext: UserContext;
    isInitialized: boolean;
    sessionId: string;
    /** Texts from the dashboard; null until loaded */
    config: PublicChatConfig | null;
    configStatus: LoadStatus;

    setInput: (input: string) => void;
    setLoading: (loading: boolean) => void;
    addMessage: (msg: Message) => void;
    setMessages: (msgs: Message[]) => void;
    clearChat: () => Promise<void>;
    loadConfig: () => Promise<void>;
    initChat: (user: User | null | undefined) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
    messages: [],
    input: "",
    loading: false,
    userContext: { name: "Guest" },
    isInitialized: false,
    sessionId: "",
    config: null,
    configStatus: "idle",

    setInput: (input) => set({ input }),
    setLoading: (loading) => set({ loading }),
    addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
    setMessages: (msgs) => set({ messages: msgs }),

    loadConfig: async () => {
        const { configStatus } = get();
        if (configStatus === "loading" || configStatus === "ready") return;
        set({ configStatus: "loading" });
        try {
            set({ config: await fetchChatConfig(), configStatus: "ready" });
        } catch (error) {
            console.error("Chat config error:", error);
            set({ configStatus: "error" });
        }
    },

    initChat: async (user) => {
        if (get().isInitialized) return;

        // Signed-in users keep one conversation across devices; visitors get an id in this browser
        let sid = "";
        if (user?.uid) {
            sid = `session_${user.uid}`;
        } else {
            try {
                sid = localStorage.getItem("chatSessionId") || "";
                if (!sid) {
                    sid = crypto.randomUUID();
                    localStorage.setItem("chatSessionId", sid);
                }
            } catch {
                sid = crypto.randomUUID();
            }
        }

        set({ sessionId: sid, isInitialized: true });
        void get().loadConfig();

        try {
            const [messages, userContext] = await Promise.all([fetchChatMessages(sid), fetchUserContextData(user)]);
            // Don't overwrite messages the visitor already sent while the history was loading
            set((state) => ({ userContext, messages: state.messages.length ? [...messages, ...state.messages] : messages }));
        } catch (error) {
            console.error("Chat init error:", error);
        }
    },

    clearChat: async () => {
        const { sessionId } = get();
        if (!sessionId) return;
        try {
            set({ loading: true });
            await deleteChatMessages(sessionId);
            set({ messages: [], loading: false });
        } catch (error) {
            console.error("Failed to clear chat:", error);
            set({ loading: false });
        }
    },
}));
