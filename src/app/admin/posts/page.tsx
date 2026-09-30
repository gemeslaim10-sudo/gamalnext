"use client";

import { Suspense, useState } from "react";
import { toast } from "react-hot-toast";
import { AdminPage, refreshAdminCounts, useAdminList } from "@/components/admin/kit";
import { Button, Card, EmptyState } from "@/components/ui";
import { ListBody, ListFooter, ListSkeleton, ListTabs, RefreshButton, useTabParam } from "@/components/admin/kit/list";
import { markTabsStale, useCollectionCounts, useReloadIfStale } from "@/components/admin/kit/listData";
import { PostDetails } from "./components/PostDetails";
import { PostRowItem, type PostAction } from "./components/PostRow";
import { POST_COUNTS, POST_LISTS, POST_STATUS, POST_TABS, deletePost, postAuthor, setPostStatus, type PostDoc, type PostRow, type PostStatus } from "./postData";

const EMPTY: Record<PostStatus, { title: string; description: string }> = {
    pending: { title: "مفيش منشورات مستنية مراجعة", description: "أول ما عضو ينشر حاجة هتظهر هنا، ومش هتظهر للزوار غير لما توافق عليها." },
    approved: { title: "مفيش منشورات منشورة", description: "المنشورات اللي توافق عليها بتظهر في الصفحة الرئيسية." },
    rejected: { title: "مفيش منشورات مرفوضة", description: "المنشورات اللي ترفضها بتفضل هنا ومش بتظهر للزوار." },
};

export default function AdminPostsPage() {
    return (
        <AdminPage
            title="المنشورات"
            description="منشورات الأعضاء في الصفحة الرئيسية. المنشور مش بيظهر للزوار غير لما توافق عليه."
            width="wide"
        >
            {/* The open tab lives in the address, which needs a boundary while it's read */}
            <Suspense fallback={<ListSkeleton />}>
                <PostsScreen />
            </Suspense>
        </AdminPage>
    );
}

function PostsScreen() {
    const [status, setStatus] = useTabParam(POST_TABS, "pending");
    // Each tab has its own list, loaded the first time it's opened and kept for the visit
    const list = useAdminList<PostDoc>("posts", POST_LISTS[status]);
    useReloadIfStale("posts", status, list.status, list.reload);
    const { counts, refresh: refreshCounts } = useCollectionCounts("posts", POST_COUNTS);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [selected, setSelected] = useState<PostRow | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    const run = async (post: PostRow, action: PostAction) => {
        const author = postAuthor(post);
        if (action === "delete" && !window.confirm(`تمسح منشور ${author}؟ مش هينفع ترجّعه تاني.`)) return;
        if (action === "reject" && post.status === "approved" && !window.confirm(`ترفض منشور ${author}؟ هيختفي من الصفحة الرئيسية.`)) return;

        setBusyId(post.id);
        try {
            if (action === "delete") {
                await deletePost(post.id);
                toast.success("اتمسح المنشور");
            } else {
                const next = action === "approve" ? "approved" : "rejected";
                await setPostStatus(post.id, next);
                // It moved to that tab, which reloads when opened
                markTabsStale("posts", [next]);
                toast.success(next === "approved" ? "اتنشر المنشور" : "اترفض المنشور");
            }
            // Either way it's no longer in this tab
            list.removeItem(post.id);
            setDetailsOpen(false);
        } catch (error) {
            console.error(`Post ${action} failed:`, error);
            toast.error("ما حصلش التغيير. جرّب تاني.");
        } finally {
            setBusyId(null);
        }
    };

    const empty = (
        <EmptyState
            title={EMPTY[status].title}
            description={EMPTY[status].description}
            action={
                status === "pending" ? (
                    <Button variant="secondary" onClick={() => setStatus("approved")}>
                        عرض المنشورات المنشورة
                    </Button>
                ) : undefined
            }
        />
    );

    return (
        <>
            <ListTabs
                label="حالة المنشورات"
                value={status}
                onChange={setStatus}
                tabs={POST_TABS.map((value) => ({ value, label: POST_STATUS[value].tab, count: counts?.[value] }))}
                end={
                    <RefreshButton
                        refreshing={list.loading}
                        onRefresh={() => {
                            void list.reload();
                            void refreshCounts();
                            void refreshAdminCounts();
                        }}
                    />
                }
            />

            <ListBody list={list} shown={list.items.length} empty={empty}>
                <Card padding="none">
                    <ul className="divide-y divide-border">
                        {list.items.map((post) => (
                            <PostRowItem
                                key={post.id}
                                post={post}
                                busy={busyId === post.id}
                                onOpen={(item) => {
                                    setSelected(item);
                                    setDetailsOpen(true);
                                }}
                                onAction={run}
                            />
                        ))}
                    </ul>
                </Card>
            </ListBody>
            <ListFooter list={list} shown={list.items.length} total={counts?.[status]} />

            <PostDetails
                post={selected}
                open={detailsOpen}
                busy={selected !== null && busyId === selected.id}
                onClose={() => setDetailsOpen(false)}
                onAction={run}
            />
        </>
    );
}
