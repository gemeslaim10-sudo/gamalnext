"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from "date-fns";
import { Search, Trash2, User, Bot, Clock, MessageSquare } from "lucide-react";

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

            // Select first session by default if none selected
            if (!selectedSessionId && fetchedSessions.length > 0) {
                // Optional: verify if we want auto-selection
            }
        }, (err) => {
            console.error("Firestore Listen Error:", err);
            if (err.code === 'permission-denied') {
                setError("Missing Permissions. Please ensure Firestore Security Rules are deployed.");
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [selectedSessionId]);

    const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this chat history?")) {
            await deleteDoc(doc(db, "chat_sessions", sessionId));
            if (selectedSessionId === sessionId) {
                setSelectedSessionId(null);
            }
        }
    };

    const filteredSessions = sessions.filter(s =>
        (s.userContext?.name || s.userId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.includes(searchTerm)
    );

    const activeSession = sessions.find(s => s.id === selectedSessionId);

    return (
        <div className="flex h-[calc(100vh-100px)] bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
            {/* Sidebar List */}
            <div className={`w-full md:w-80 bg-slate-950 border-r border-slate-800 flex flex-col ${selectedSessionId ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-slate-800">
                    <h2 className="font-bold text-white mb-4">Chat History ({sessions.length})</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search user or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="p-4 text-center text-slate-500">Loading chats...</div>
                    ) : error ? (
                        <div className="p-4 text-center text-red-500 text-sm border border-red-500/20 bg-red-500/10 rounded m-4">
                            {error} <br />
                            <span className="text-xs text-slate-400 block mt-1">Check firestore.rules</span>
                        </div>
                    ) : filteredSessions.length === 0 ? (
                        <div className="p-4 text-center text-slate-500">No chats found.</div>
                    ) : (
                        filteredSessions.map(session => (
                            <div
                                key={session.id}
                                onClick={() => setSelectedSessionId(session.id)}
                                className={`p-4 border-b border-slate-800 cursor-pointer hover:bg-slate-900/50 transition-colors ${selectedSessionId === session.id ? 'bg-blue-900/20 border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent'}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-slate-200 text-sm truncate max-w-[120px]">
                                        {session.userContext?.name || session.userId || "Anonymous"}
                                    </h3>
                                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {session.lastMessageAt?.seconds ? format(new Date(session.lastMessageAt.seconds * 1000), 'MMM d, HH:mm') : 'Just now'}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                    {session.preview || "No messages yet"}
                                </p>
                                <div className="mt-2 flex justify-between items-center">
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-500">
                                        {session.messages?.length || 0} msgs
                                    </span>
                                    <button
                                        onClick={(e) => handleDeleteSession(e, session.id)}
                                        className="p-1 hover:bg-red-900/30 rounded text-slate-500 hover:text-red-400"
                                        title="Delete Log"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Main Chat View */}
            <div className={`flex-1 flex flex-col bg-slate-900 ${!selectedSessionId ? 'hidden md:flex' : 'flex'}`}>
                {activeSession ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50 backdrop-blur">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setSelectedSessionId(null)} className="md:hidden text-slate-400">
                                    ← Back
                                </button>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                                    {(activeSession.userContext?.name?.[0] || "A").toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="font-bold text-white">
                                        {activeSession.userContext?.name || activeSession.userId || "Anonymous"}
                                    </h2>
                                    <p className="text-xs text-slate-400">
                                        ID: {activeSession.id.substring(0, 8)}...
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2 text-sm text-slate-400">
                                {activeSession.userContext?.phone && (
                                    <span className="px-3 py-1 bg-green-900/20 text-green-400 rounded-full border border-green-900/50">
                                        📞 {activeSession.userContext.phone}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-900/50">
                            {activeSession.messages?.map((msg, idx) => {
                                const isUser = msg.role === 'user';
                                return (
                                    <div key={idx} className={`flex items-start gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-purple-600' : 'bg-blue-600'}`}>
                                            {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                                        </div>
                                        <div className={`max-w-[80%] rounded-2xl p-4 ${isUser ? 'bg-purple-900/20 border border-purple-500/20 text-purple-100' : 'bg-slate-800 border border-slate-700 text-slate-200'}`}>
                                            <div style={{ whiteSpace: "pre-wrap" }} className="text-sm leading-relaxed">
                                                {msg.text}
                                            </div>
                                            <div className={`text-[10px] mt-2 opacity-50 ${isUser ? 'text-right' : 'text-left'}`}>
                                                {msg.timestamp?.seconds ? format(new Date(msg.timestamp.seconds * 1000), 'HH:mm:ss') : ''}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                        <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
                        <p>Select a chat session to view history</p>
                        <p className="text-sm opacity-50 mt-2">Chats are archived here automatically.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
