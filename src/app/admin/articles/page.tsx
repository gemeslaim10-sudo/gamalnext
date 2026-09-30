"use client";

import { Suspense, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import { AdminPage, refreshAdminCounts, useAdminList } from "@/components/admin/kit";
import { Button, ButtonLink, Card, EmptyState } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { ListBody, ListFooter, ListSkeleton, ListTabs, RefreshButton, useTabParam } from "@/components/admin/kit/list";
import { markTabsStale, useCollectionCounts, useReloadIfStale } from "@/components/admin/kit/listData";
import { ArticleRowItem, type ArticleAction } from "./components/ArticleRow";
import {
    ARTICLE_COUNTS,
    ARTICLE_LISTS,
    ARTICLE_TABS,
    articleTitle,
    deleteArticle,
    isPendingArticle,
    setArticleStatus,
    type ArticleDoc,
    type ArticleRow,
} from "./articleData";

export default function AdminArticlesPage() {
    return (
        <AdminPage
            title="المقالات"
            description="مقالات الأعضاء بتستنى مراجعتك قبل ما تظهر على الموقع. افتح أي مقال عشان تقراه أو تعدّله."
            width="wide"
            actions={
                <ButtonLink href="/admin/articles/new">
                    <Plus /> مقال جديد
                </ButtonLink>
            }
        >
            {/* The open tab lives in the address, which needs a boundary while it's read */}
            <Suspense fallback={<ListSkeleton />}>
                <ArticlesScreen />
            </Suspense>
        </AdminPage>
    );
}

function ArticlesScreen() {
    const [tab, onTabChange] = useTabParam(ARTICLE_TABS, "pending");
    const { user } = useAuth();
    // Each tab has its own list, loaded the first time it's opened and kept for the visit
    const list = useAdminList<ArticleDoc>("articles", ARTICLE_LISTS[tab]);
    useReloadIfStale("articles", tab, list.status, list.reload);
    const { counts, refresh: refreshCounts } = useCollectionCounts("articles", ARTICLE_COUNTS);
    const [busyId, setBusyId] = useState<string | null>(null);

    const pending = counts?.pending ?? null;
    const published = typeof counts?.all === "number" && typeof pending === "number" ? Math.max(counts.all - pending, 0) : null;
    const total = tab === "pending" ? pending : published;

    const rows = useMemo(
        () => (tab === "pending" ? list.items : list.items.filter((article) => !isPendingArticle(article))),
        [list.items, tab]
    );

    const run = async (article: ArticleRow, action: ArticleAction) => {
        const title = articleTitle(article);
        if (action === "delete" && !window.confirm(`تمسح «${title}»؟ مش هينفع ترجّعه تاني.`)) return;
        if (action === "unpublish" && !window.confirm(`تلغي نشر «${title}»؟ هيختفي من الموقع ويرجع لقايمة المراجعة.`)) return;

        setBusyId(article.id);
        try {
            if (action === "delete") {
                await deleteArticle(article.id);
                list.removeItem(article.id);
                toast.success("اتمسح المقال");
            } else if (action === "publish") {
                await setArticleStatus(article, "published", user);
                if (tab === "pending") list.removeItem(article.id);
                else list.updateItem(article.id, { status: "published" });
                markTabsStale("articles", ["published"]);
                toast.success("اتنشر المقال");
            } else {
                await setArticleStatus(article, "pending", user);
                // Stays loaded in this list, hidden by the tab
                list.updateItem(article.id, { status: "pending" });
                markTabsStale("articles", ["pending"]);
                toast.success("اتلغى النشر، والمقال رجع لقايمة المراجعة");
            }
        } catch (error) {
            console.error(`Article ${action} failed:`, error);
            toast.error("ما حصلش التغيير. جرّب تاني.");
        } finally {
            setBusyId(null);
        }
    };

    const empty =
        tab === "pending" ? (
            <EmptyState
                title="مفيش مقالات مستنية مراجعة"
                description="أول ما عضو يكتب مقال هيظهر هنا، ومش هيظهر للزوار غير لما تنشره."
                action={
                    <Button variant="secondary" onClick={() => onTabChange("published")}>
                        عرض المقالات المنشورة
                    </Button>
                }
            />
        ) : list.hasMore ? (
            <EmptyState title="مفيش مقالات منشورة في اللي اتحمّل" description="دوس «تحميل المزيد» تحت عشان نجيب مقالات أقدم." />
        ) : (
            <EmptyState
                title="مفيش مقالات منشورة"
                description="اكتب أول مقال وهيظهر في المدونة على طول."
                action={
                    <ButtonLink href="/admin/articles/new" variant="secondary">
                        <Plus /> مقال جديد
                    </ButtonLink>
                }
            />
        );

    return (
        <>
            <ListTabs
                label="حالة المقالات"
                value={tab}
                onChange={onTabChange}
                tabs={[
                    { value: "pending", label: "مستني المراجعة", count: pending },
                    { value: "published", label: "منشور", count: published },
                ]}
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
            <ListBody list={list} shown={rows.length} empty={empty}>
                <Card padding="none">
                    <ul className="divide-y divide-border">
                        {rows.map((article) => (
                            <ArticleRowItem key={article.id} article={article} busy={busyId === article.id} onAction={run} />
                        ))}
                    </ul>
                </Card>
            </ListBody>
            <ListFooter list={list} shown={rows.length} total={total} />
        </>
    );
}
