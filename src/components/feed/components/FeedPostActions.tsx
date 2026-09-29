import { MessageCircle, Share2 } from "lucide-react";
import LikeButton from "@/components/social/LikeButton";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { FeedItem } from "../types";
import { useCopy } from "@/components/providers/CopyProvider";

interface FeedPostActionsProps {
    item: FeedItem;
    isCommentActive: boolean;
    onToggleComments: (id: string) => void;
    onShare: (item: FeedItem) => void;
}

export function FeedPostActions({ item, isCommentActive, onToggleComments, onShare }: FeedPostActionsProps) {
    const t = useCopy();
    return (
        <div className="flex items-center gap-1 border-t border-border px-2 py-1.5 sm:px-3">
            <LikeButton articleId={item.id} />

            <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleComments(item.id)}
                aria-expanded={isCommentActive}
                className={cn(isCommentActive && "bg-surface-hover text-foreground")}
            >
                <MessageCircle />
                {t("home.comment")}
            </Button>

            <Button variant="ghost" size="sm" onClick={() => onShare(item)} className="ml-auto">
                <Share2 />
                <span className="hidden sm:inline">{t("home.share")}</span>
            </Button>
        </div>
    );
}
