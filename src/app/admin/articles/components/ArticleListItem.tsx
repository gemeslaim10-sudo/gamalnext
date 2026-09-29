import { Check, Pencil, Trash2, Video } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import type { Article } from "../types";

interface ArticleListItemProps {
    article: Article;
    handleApprove: (article: Article) => void;
    handleEdit: (article: Article) => void;
    handleDelete: (id: string) => void;
}

export function ArticleListItem({
    article,
    handleApprove,
    handleEdit,
    handleDelete
}: ArticleListItemProps) {
    const isPending = article.status === 'pending';

    return (
        <li className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 gap-3">
                {/* Thumbnail */}
                <div className="flex aspect-video w-20 shrink-0 items-center justify-center overflow-hidden rounded-control border border-border bg-surface-hover text-xs text-subtle sm:w-28">
                    {article.media?.[0] ? (
                        article.media[0].type === 'video' ? (
                            <Video aria-label="Video" className="size-4" />
                        ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={article.media[0].url} alt={article.title} className="size-full object-cover" />
                        )
                    ) : (
                        <span>No Media</span>
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <h3 className="min-w-0 truncate text-sm font-medium text-foreground">{article.title}</h3>
                        {isPending ? <Badge variant="warning">Needs review</Badge> : <Badge variant="success">Published</Badge>}
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-sm text-muted sm:line-clamp-1">{article.summary}</p>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-subtle">
                        <span>By: {article.authorName || 'Admin'}</span>
                        <span className="max-w-full truncate">/{article.slug}</span>
                        <span>{article.media?.length || 0} Media Items</span>
                    </div>
                </div>
            </div>

            <div className="flex shrink-0 items-center justify-end gap-1">
                {isPending && (
                    <Button variant="secondary" size="sm" onClick={() => handleApprove(article)}>
                        <Check /> Approve
                    </Button>
                )}
                <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(article)} aria-label={`Edit ${article.title}`} title="Edit">
                    <Pencil />
                </Button>
                <Button variant="danger" size="icon-sm" onClick={() => handleDelete(article.id)} aria-label={`Delete ${article.title}`} title="Delete">
                    <Trash2 />
                </Button>
            </div>
        </li>
    );
}
