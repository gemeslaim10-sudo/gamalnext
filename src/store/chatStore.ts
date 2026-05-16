import { create } from 'zustand';
import type { Message, UserContext } from '@/components/chat/types';
import { User } from 'firebase/auth';
import { fetchUserContextData, fetchChatMessages, buildWelcomeMessage, deleteChatMessages } from './chatStoreHelpers';

interface ChatState {
    messages: Message[];
    input: string;
    loading: boolean;
    userContext: UserContext;
    isInitialized: boolean;
    sessionId: string;
    
    setInput: (input: string) => void;
    setLoading: (loading: boolean) => void;
    addMessage: (msg: Message) => void;
    setMessages: (msgs: Message[]) => void;
    clearChat: () => Promise<void>;
    
    initChat: (user: User | null | undefined) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
    messages: [],
    input: '',
    loading: false,
    userContext: { name: 'Guest', gender: 'Unknown' },
    isInitialized: false,
    sessionId: '',
    
    setInput: (input) => set({ input }),
    setLoading: (loading) => set({ loading }),
    addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
    setMessages: (msgs) => set({ messages: msgs }),
    
    initChat: async (user) => {
        const state = get();
        if (state.isInitialized) return;
        
        let sid = '';
        if (user?.uid) {
            sid = `session_${user.uid}`;
        } else {
            sid = localStorage.getItem("chatSessionId") || "";
            if (!sid) {
                sid = crypto.randomUUID();
                localStorage.setItem("chatSessionId", sid);
            }
        }

        set({ sessionId: sid, isInitialized: true });
        
        try {
            let loadedMessages = await fetchChatMessages(sid);
            const userContext = await fetchUserContextData(user);
            
            set({ userContext });

            if (loadedMessages.length === 0) {
                const welcomeText = buildWelcomeMessage(userContext.name || "Guest");
                loadedMessages = [{ role: 'model', text: welcomeText }];
            }

            set({ messages: loadedMessages });
        } catch (error) {
            console.error("Chat Init Error:", error);
        }
    },

    clearChat: async () => {
        const state = get();
        if (!state.sessionId) return;
        
        try {
            set({ loading: true });
            
            await deleteChatMessages(state.sessionId);
            
            const { name } = state.userContext;
            const welcomeText = buildWelcomeMessage(name || "Guest");
            
            set({ 
                messages: [{ role: 'model', text: welcomeText }],
                loading: false
            });
            
        } catch (error) {
            console.error("Failed to clear chat:", error);
            set({ loading: false });
        }
    }
}));
