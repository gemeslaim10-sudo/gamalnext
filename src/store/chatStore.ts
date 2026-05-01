import { create } from 'zustand';
import type { Message, UserContext } from '@/components/chat/types';
import { doc, getDoc, collection, getDocs, query, orderBy, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User } from 'firebase/auth';

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
            const msgsRef = collection(db, "chat_sessions", sid, "messages");
            const q = query(msgsRef, orderBy("timestamp", "asc"));
            const snapshot = await getDocs(q);
            
            let loadedMessages: Message[] = [];
            snapshot.forEach(d => {
                const data = d.data();
                if (data.text && data.role) {
                    loadedMessages.push({ role: data.role as 'user'|'model', text: data.text });
                }
            });

            let userName = "Guest";
            let userGender = "Unknown";
            let userPhone = "";
            let userEmail = "";
            
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    userName = userData.name || user.displayName || "User";
                    userGender = userData.gender || "Unknown";
                    userPhone = userData.phone || "";
                    userEmail = userData.email || user.email || "";
                } else {
                    userName = user.displayName || "User";
                    userEmail = user.email || "";
                }
            }
            
            set({ userContext: { 
                name: userName, 
                gender: userGender, 
                uid: user?.uid, 
                phone: userPhone, 
                email: userEmail 
            } });

            // If no past messages, fetch welcome message
            if (loadedMessages.length === 0) {
                let welcomeText = "أهلاً بك في منصة جمال 👋 سعيد جداً بوجودك هنا!\nأنا المساعد الذكي الخاص بجمال، ومهمتي هي مساعدتك في التعرف على خدماتنا المتميزة: بناء المواقع، المتاجر الإلكترونية (Next.js & Shopify)، وبرمجة أنظمة الواتساب الذكية. 🚀\n\nبإيه أقدر أساعدك النهاردة؟ 😊";

                if (userName !== "Guest") {
                    // Remove common name-asking phrases if the user is logged in (in case Admin wrote them in the welcome message)
                    welcomeText = welcomeText.replace(/ممكن أتشرف باسمك.*؟/g, '');
                    welcomeText = welcomeText.replace(/ممكن أعرف اسم حضرتك.*؟/g, '');
                    welcomeText = welcomeText.replace(/ممكن أعرف اسمك.*؟/g, '');
                    
                    if (welcomeText.includes("{name}")) {
                        welcomeText = welcomeText.replace(/{name}/g, userName);
                    } else {
                        welcomeText = `أهلاً يا ${userName} 👋،\n${welcomeText}`;
                    }
                } else {
                    welcomeText = welcomeText.replace(/{name}/g, "");
                    if (!welcomeText.includes("اسم")) {
                        welcomeText += "\n\nممكن أعرف اسم حضرتك عشان أقدر أساعدك بشكل أفضل؟ 😊";
                    }
                }
                
                loadedMessages = [{ role: 'model', text: welcomeText.trim() }];
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
            
            // Delete messages from Firestore
            const msgsRef = collection(db, "chat_sessions", state.sessionId, "messages");
            const snapshot = await getDocs(msgsRef);
            
            const deletePromises = snapshot.docs.map(d => deleteDoc(d.ref));
            await Promise.all(deletePromises);
            
            // Re-generate welcome message
            const { name } = state.userContext;
            let welcomeText = "أهلاً بك في منصة جمال 👋 سعيد جداً بوجودك هنا!\nأنا المساعد الذكي الخاص بجمال، ومهمتي هي مساعدتك في التعرف على خدماتنا المتميزة: بناء المواقع، المتاجر الإلكترونية (Next.js & Shopify)، وبرمجة أنظمة الواتساب الذكية. 🚀\n\nبإيه أقدر أساعدك النهاردة؟ 😊";

            if (name && name !== "Guest") {
                welcomeText = `أهلاً يا ${name} 👋،\n${welcomeText}`;
            } else {
                welcomeText += "\n\nممكن أعرف اسم حضرتك عشان أقدر أساعدك بشكل أفضل؟ 😊";
            }
            
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
