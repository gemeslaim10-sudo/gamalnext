'use client';

import { User, Bot, MessageSquare } from 'lucide-react';

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

interface ChatViewProps {
    session: Session | undefined;
    onBack: () => void;
}

export default function ChatView({ session, onBack }: ChatViewProps) {
    if (!session) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 bg-slate-900">
                <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
                <p>Select a chat session to view history</p>
                <p className="text-sm opacity-50 mt-2">Chats are archived here automatically.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-slate-900">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50 backdrop-blur">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="md:hidden text-slate-400">
                        ← Back
                    </button>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                        {(session.userContext?.name?.[0] || "A").toUpperCase()}
                    </div>
                    <div className="text-right">
                        <h2 className="font-bold text-white">
                            {session.userContext?.name || session.userId || "Anonymous"}
                        </h2>
                        <p className="text-xs text-slate-400">
                            ID: {session.id.substring(0, 8)}...
                        </p>
                    </div>
                </div>
                <div className="flex gap-2 text-sm text-slate-400">
                    {session.userContext?.phone && (
                        <span className="px-3 py-1 bg-green-900/20 text-green-400 rounded-full border border-green-900/50">
                            📞 {session.userContext.phone}
                        </span>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-900/50">
                {session.messages?.map((msg, idx) => {
                    const isUser = msg.role === 'user';
                    return (
                        <div key={idx} className={`flex items-start gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-purple-600' : 'bg-blue-600'}`}>
                                {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                            </div>
                            <div className={`max-w-[80%] rounded-2xl p-4 ${isUser ? 'bg-purple-900/20 border border-purple-500/20 text-purple-100' : 'bg-slate-800 border border-slate-700 text-slate-200'}`}>
                                <div style={{ whiteSpace: "pre-wrap" }} className={`text-sm leading-relaxed ${isUser ? 'text-right' : 'text-right'}`}>
                                    {msg.text}
                                </div>
                                <div className={`text-[10px] mt-2 opacity-50 ${isUser ? 'text-right' : 'text-left'}`}>
                                    {msg.timestamp?.seconds
                                        ? new Date(msg.timestamp.seconds * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
                                        : ''}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
