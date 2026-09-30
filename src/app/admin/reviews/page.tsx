"use client";

import { Suspense, useState } from "react";
import { toast } from "react-hot-toast";
import { AdminPage, refreshAdminCounts, useAdminList } from "@/components/admin/kit";
import { Button, Card, EmptyState } from "@/components/ui";
import { ListBody, ListFooter, ListSkeleton, ListTabs, RefreshButton, useTabParam } from "@/components/admin/kit/list";
import { markTabsStale, useCollectionCounts, useReloadIfStale } from "@/components/admin/kit/listData";
import { ReviewDetails } from "./components/ReviewDetails";
import { ReviewRowItem, type ReviewAction } from "./components/ReviewRow";
import {
    REVIEW_COUNTS,
    REVIEW_LISTS,
    REVIEW_STATUS,
    REVIEW_TABS,
    deleteReview,
    reviewAuthor,
    setReviewStatus,
    type ReviewDoc,
    type ReviewRow,
    type ReviewStatus,
} from "./reviewData";

const EMPTY: Record<ReviewStatus, { title: string; description: string }> = {
    pending: { title: "مفيش آراء مستنية مراجعة", description: "أول ما عميل يكتب رأيه هيظهر هنا، ومش هيظهر على الموقع غير لما توافق عليه." },
    approved: { title: "مفيش آراء ظاهرة", description: "الآراء اللي توافق عليها بتظهر في صفحة البروفايل." },
    hidden: { title: "مفيش آراء مخفية", description: "الآراء اللي تخفيها بتفضل هنا ومش بتظهر للزوار." },
};

export default function AdminReviewsPage() {
    return (
        <AdminPage
            title="آراء العملاء"
            description="التقييمات بتظهر في صفحة البروفايل بعد ما توافق عليها، وتقدر تخفيها في أي وقت."
            width="wide"
        >
            {/* The open tab lives in the address, which needs a boundary while it's read */}
            <Suspense fallback={<ListSkeleton />}>
                <ReviewsScreen />
            </Suspense>
        </AdminPage>
    );
}

function ReviewsScreen() {
    const [status, setStatus] = useTabParam(REVIEW_TABS, "pending");
    // Each tab has its own list, loaded the first time it's opened and kept for the visit
    const list = useAdminList<ReviewDoc>("reviews", REVIEW_LISTS[status]);
    useReloadIfStale("reviews", status, list.status, list.reload);
    const { counts, refresh: refreshCounts } = useCollectionCounts("reviews", REVIEW_COUNTS);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [selected, setSelected] = useState<ReviewRow | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    const run = async (review: ReviewRow, action: ReviewAction) => {
        const author = reviewAuthor(review);
        if (action === "delete" && !window.confirm(`تمسح رأي ${author}؟ مش هينفع ترجّعه تاني.`)) return;
        if (action === "hide" && review.status === "approved" && !window.confirm(`تخفي رأي ${author}؟ هيختفي من الموقع.`)) return;

        setBusyId(review.id);
        try {
            if (action === "delete") {
                await deleteReview(review.id);
                toast.success("اتمسح الرأي");
            } else {
                const next = action === "approve" ? "approved" : "hidden";
                await setReviewStatus(review.id, next);
                // It moved to that tab, which reloads when opened
                markTabsStale("reviews", [next]);
                toast.success(next === "approved" ? "الرأي بقى ظاهر على الموقع" : "اتخفى الرأي");
            }
            // Either way it's no longer in this tab
            list.removeItem(review.id);
            setDetailsOpen(false);
        } catch (error) {
            console.error(`Review ${action} failed:`, error);
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
                        عرض الآراء الظاهرة
                    </Button>
                ) : undefined
            }
        />
    );

    return (
        <>
            <ListTabs
                label="حالة الآراء"
                value={status}
                onChange={setStatus}
                tabs={REVIEW_TABS.map((value) => ({ value, label: REVIEW_STATUS[value].tab, count: counts?.[value] }))}
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
                        {list.items.map((review) => (
                            <ReviewRowItem
                                key={review.id}
                                review={review}
                                busy={busyId === review.id}
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

            <ReviewDetails
                review={selected}
                open={detailsOpen}
                busy={selected !== null && busyId === selected.id}
                onClose={() => setDetailsOpen(false)}
                onAction={run}
            />
        </>
    );
}
