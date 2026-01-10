"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ChatSidebar from "@/components/admin/chat/ChatSidebar";
import ChatView from "@/components/admin/chat/ChatView";

type Message = {
    role: 'user' | 'model';
    text: string;
    timestamp: any;
};

type Session = {
    id: string;
    userId: string;
    sessionId: string;
    userName?: string;
    lastMessageAt: any;
    preview: string;
    messages: Message[];
    startedAt?: any;
    userContext?: any;
};

export default function AiChatsPage() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch Sessions (Real-time)
    useEffect(() => {
        const q = query(collection(db, "chat_sessions"), orderBy("lastMessageAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedSessions = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Session));
            setSessions(fetchedSessions);
            setLoading(false);
        }, (err) => {
            console.error("Firestore Listen Error:", err);
            if (err.code === 'permission-denied') {
                setError("Missing Permissions. Please ensure Firestore Security Rules are deployed.");
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this chat history?")) {
            try {
                await deleteDoc(doc(db, "chat_sessions", sessionId));
                if (selectedSessionId === sessionId) {
                    setSelectedSessionId(null);
                }
            } catch (err) {
                console.error("Delete Error:", err);
            }
        }
    };

    const activeSession = sessions.find(s => s.id === selectedSessionId);

    return (
        <div className="flex h-[calc(100vh-100px)] bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
            <ChatSidebar
                sessions={sessions}
                selectedSessionId={selectedSessionId}
                setSelectedSessionId={setSelectedSessionId}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                loading={loading}
                error={error}
                onDelete={handleDeleteSession}
            />

            <ChatView
                session={activeSession}
                onBack={() => setSelectedSessionId(null)}
            />
        </div>
    );
}
