'use client';

import { Bot, X } from 'lucide-react';

interface ChatHeaderProps {
    onClose: () => void;
}

export default function ChatHeader({ onClose }: ChatHeaderProps) {
    return (
        <div className="p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                    <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-white text-sm">المساعد الذكي</h3>
                    <p className="text-xs text-blue-300 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        متاح الآن
                    </p>
                </div>
            </div>
            <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
    );
}
