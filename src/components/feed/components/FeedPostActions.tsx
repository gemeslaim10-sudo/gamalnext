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
        <div className="p-3 sm:p-4 border-t border-white/5 bg-slate-900/40">
            <div className="flex items-center gap-2 sm:gap-3">
                <LikeButton articleId={item.id} />
                
                <button 
                    onClick={() => onToggleComments(item.id)}
                    aria-label="Comment"
                    className={`flex items-center justify-center gap-1.5 sm:gap-2 w-9 h-9 sm:w-auto sm:h-auto sm:px-4 sm:py-2 rounded-full font-medium transition-colors text-xs sm:text-sm border ${
                        isCommentActive 
                            ? 'bg-blue-600/20 text-blue-400 border-blue-500/30' 
                            : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white border-slate-700/50'
                    }`}
                >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span className="hidden sm:inline">Comment</span>
                </button>
                
                <button 
                    onClick={() => onShare(item)}
                    aria-label="Share"
                    className="flex items-center justify-center gap-1.5 sm:gap-2 w-9 h-9 sm:w-auto sm:h-auto sm:px-4 sm:py-2 rounded-full font-medium transition-colors text-xs sm:text-sm border bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white border-slate-700/50 ml-auto"
                >
                    <Share2 className="w-4 h-4 shrink-0" />
                    <span className="hidden sm:inline">Share</span>
                </button>
            </div>
        </div>
    );
}
