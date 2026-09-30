import { create } from "zustand";
import type { User } from "firebase/auth";
import type { Message, PublicChatConfig, UserContext } from "@/components/chat/types";
import { fetchChatConfig, fetchUserContextData, forgetOldChatSession } from "./chatStoreHelpers";

type LoadStatus = "idle" | "loading" | "ready" | "error";

interface ChatState {
    /** The conversation lives only here, in this tab: it's never stored anywhere */
    messages: Message[];
    input: string;
    loading: boolean;
    userContext: UserContext;
    isInitialized: boolean;
    /** Texts from the dashboard; null until loaded */
    config: PublicChatConfig | null;
    configStatus: LoadStatus;

    setInput: (input: string) => void;
    setLoading: (loading: boolean) => void;
    addMessage: (msg: Message) => void;
    setMessages: (msgs: Message[]) => void;
    clearChat: () => void;
    loadConfig: () => Promise<void>;
    /** Texts that came with the page (cached on the server), so opening the chat needs no request */
    seedConfig: (config: PublicChatConfig) => void;
    initChat: (user: User | null | undefined) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
    messages: [],
    input: "",
    loading: false,
    userContext: { name: "Guest" },
    isInitialized: false,
    config: null,
    configStatus: "idle",

    setInput: (input) => set({ input }),
    setLoading: (loading) => set({ loading }),
    addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
    setMessages: (msgs) => set({ messages: msgs }),

    seedConfig: (config) => {
        if (get().configStatus !== "ready") set({ config, configStatus: "ready" });
    },

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
        set({ isInitialized: true });
        forgetOldChatSession();
        void get().loadConfig();

        try {
            // A signed-in visitor's name, so the assistant can greet them by it
            set({ userContext: await fetchUserContextData(user) });
        } catch (error) {
            console.error("Chat init error:", error);
        }
    },

    clearChat: () => set({ messages: [] }),
}));
