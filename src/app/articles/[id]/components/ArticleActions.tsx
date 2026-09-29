import { Pencil, Share2, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import LikeButton from "@/components/social/LikeButton";
import { useCopy } from "@/components/providers/CopyProvider";
import { Button, ButtonLink } from "@/components/ui";

interface ArticleActionsProps {
    articleId: string;
    title: string;
    summary?: string;
    isAuthor: boolean;
    deleting: boolean;
    handleDelete: () => void;
}

export function ArticleActions({ articleId, title, summary, isAuthor, deleting, handleDelete }: ArticleActionsProps) {
    const t = useCopy();

    const handleShare = async () => {
        const shareData = {
            title,
            text: summary,
            url: window.location.href,
        };

        try {
            if (navigator.share && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success(t("blog.linkCopied"));
            }
        } catch {
            toast.error(t("blog.copyFailed"));
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-1 border-t border-border pt-4">
            <LikeButton articleId={articleId} />
            <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 />
                {t("blog.share")}
            </Button>

            {isAuthor && (
                <div className="ml-auto flex items-center gap-1">
                    <ButtonLink href={`/articles/${articleId}/edit`} variant="ghost" size="sm">
                        <Pencil />
                        {t("blog.edit")}
                    </ButtonLink>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDelete}
                        disabled={deleting}
                        className="hover:bg-danger/10 hover:text-danger"
                    >
                        <Trash2 />
                        {t("blog.delete")}
                    </Button>
                </div>
            )}
        </div>
    );
}
