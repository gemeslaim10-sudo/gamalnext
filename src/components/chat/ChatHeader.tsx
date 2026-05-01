'use client';

import { Bot, X, Copy, ArrowLeft, Trash2 } from 'lucide-react';

interface ChatHeaderProps {
    onClose?: () => void;
    onBack?: () => void;
    onCopyChat?: () => void;
    onClearChat?: () => void;
    className?: string;
}

export default function ChatHeader({ onClose, onBack, onCopyChat, onClearChat, className = "p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-slate-700/50 flex items-center justify-between" }: ChatHeaderProps) {
    return (
        <div className={className}>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                    <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-white text-sm">Smart Assistant</h3>
                    <p className="text-xs text-blue-300 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        Online Now
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {onCopyChat && (
                    <button
                        onClick={onCopyChat}
                        title="Copy Chat"
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                    >
                        <Copy className="w-4 h-4" />
                    </button>
                )}
                {onClearChat && (
                    <button
                        onClick={onClearChat}
                        title="Clear Chat"
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-slate-400 hover:text-red-400"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
                {onBack && (
                    <button
                        onClick={onBack}
                        title="Go Back"
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                )}
                {onClose && (
                    <button
                        onClick={onClose}
                        title="Close Chat"
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
}
