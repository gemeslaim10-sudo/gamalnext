'use client';

import { Search, Clock, Trash2 } from 'lucide-react';

interface Message {
    role: 'user' | 'model';
    text: string;
    timestamp: any;
}

interface Session {
    id: string;
    userId: string;
    sessionId: string;
    userName?: string;
    lastMessageAt: any;
    preview: string;
    messages: Message[];
    startedAt?: any;
    userContext?: any;
}

interface ChatSidebarProps {
    sessions: Session[];
    selectedSessionId: string | null;
    setSelectedSessionId: (id: string | null) => void;
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    loading: boolean;
    error: string | null;
    onDelete: (e: React.MouseEvent, id: string) => void;
}

export default function ChatSidebar({
    sessions,
    selectedSessionId,
    setSelectedSessionId,
    searchTerm,
    setSearchTerm,
    loading,
    error,
    onDelete
}: ChatSidebarProps) {
    const filteredSessions = sessions.filter(s =>
        (s.userContext?.name || s.userId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.includes(searchTerm)
    );

    return (
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
                                    {session.lastMessageAt?.seconds
                                        ? new Date(session.lastMessageAt.seconds * 1000).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })
                                        : 'Just now'}
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
                                    onClick={(e) => onDelete(e, session.id)}
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
    );
}
