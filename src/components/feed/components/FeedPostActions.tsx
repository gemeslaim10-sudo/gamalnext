import { MessageCircle, Share2 } from "lucide-react";
import LikeButton from "@/components/social/LikeButton";
import type { FeedItem } from "../types";

interface FeedPostActionsProps {
    item: FeedItem;
    isCommentActive: boolean;
    onToggleComments: (id: string) => void;
    onShare: (item: FeedItem) => void;
}

export function FeedPostActions({ item, isCommentActive, onToggleComments, onShare }: FeedPostActionsProps) {
    return (
        <div className="p-4 border-t border-white/5 bg-slate-900/40">
            <div className="flex items-center gap-2">
                <div className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-full transition-colors flex items-center px-1">
                    <LikeButton articleId={item.id} />
                </div>
                
                <button 
                    onClick={() => onToggleComments(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors text-sm border ${
                        isCommentActive 
                            ? 'bg-blue-600/20 text-blue-400 border-blue-500/30' 
                            : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white border-slate-700/50'
                    }`}
                >
                    <MessageCircle className="w-4 h-4" />
                    Comment
                </button>
                
                <button 
                    onClick={() => onShare(item)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors text-sm border bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white border-slate-700/50 ml-auto"
                >
                    <Share2 className="w-4 h-4" />
                    Share
                </button>
            </div>
        </div>
    );
}
