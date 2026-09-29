"use client";

import { Check, Trash2, X } from "lucide-react";
import { Badge, Button, Card, EmptyState, LoadingBlock, PageHeader } from "@/components/ui";
import { useAdminPosts, type Post } from "./hooks/useAdminPosts";

const STATUS_BADGE: Record<Post["status"], "success" | "warning" | "danger"> = {
    approved: "success",
    pending: "warning",
    rejected: "danger",
};

export default function AdminPostsPage() {
    const { posts, loading, handleUpdateStatus, handleDelete } = useAdminPosts();

    return (
        <>
            <PageHeader
                title="Community Posts Moderation"
                description="Review, approve, or reject posts submitted by users for the Explore feed."
            />

            {loading ? (
                <LoadingBlock />
            ) : posts.length === 0 ? (
                <EmptyState title="No Posts Found" description="Users haven't submitted any posts yet." />
            ) : (
                <Card padding="none" className="overflow-hidden">
                    <ul className="divide-y divide-border">
                        {posts.map(post => (
                            <li key={post.id} className="flex flex-col gap-3 px-4 py-3 md:flex-row md:items-start md:justify-between md:gap-6">
                                <div className="min-w-0 flex-1 space-y-2">
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                        <span className="text-sm font-medium text-foreground">{post.userName}</span>
                                        <span className="min-w-0 break-all text-xs text-subtle">({post.userEmail})</span>
                                        <Badge variant={STATUS_BADGE[post.status] ?? "warning"} className="capitalize">
                                            {post.status}
                                        </Badge>
                                    </div>
                                    <p dir="auto" className="whitespace-pre-wrap break-words text-sm leading-relaxed text-muted">
                                        {post.content}
                                    </p>
                                </div>

                                <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                                    {post.status !== 'approved' && (
                                        <Button variant="secondary" size="sm" onClick={() => handleUpdateStatus(post.id, "approved")}>
                                            <Check /> Approve
                                        </Button>
                                    )}
                                    {post.status !== 'rejected' && (
                                        <Button variant="secondary" size="sm" onClick={() => handleUpdateStatus(post.id, "rejected")}>
                                            <X /> Reject
                                        </Button>
                                    )}
                                    <Button
                                        variant="danger"
                                        size="icon-sm"
                                        onClick={() => handleDelete(post.id)}
                                        aria-label="Delete post"
                                        title="Delete"
                                    >
                                        <Trash2 />
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </Card>
            )}
        </>
    );
}
