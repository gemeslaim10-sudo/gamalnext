"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Check, ExternalLink, EyeOff, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import {
    AdminPage,
    SaveBar,
    invalidateAdminDocs,
    invalidateAdminLists,
    useAdminDoc,
    useDraft,
    useUnsavedChangesGuard,
} from "@/components/admin/kit";
import { Alert, Badge, Button, ButtonLink, Card, EmptyState, MenuItem, Skeleton, Spinner } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { isPublicArticle } from "@/lib/content/shared";
import { LoadError, RowMenu } from "@/components/admin/kit/list";
import { formatDate } from "@/components/admin/kit/listData";
import { ArticleFields } from "../components/ArticleFields";
import {
    afterArticleChange,
    articleListHref,
    articlePatch,
    articleStatus,
    articleTitle,
    deleteArticle,
    isPendingArticle,
    notifyAuthorApproved,
    readArticleDoc,
    toArticleForm,
    validateArticle,
    type ArticleErrors,
} from "../articleData";

const CRUMBS = [{ label: "المقالات", href: "/admin/articles" }];

type Busy = null | "publish" | "unpublish" | "delete";

export default function EditArticlePage() {
    const { id } = useParams<{ id: string }>();
    const path = `articles/${id}` as const;
    const router = useRouter();
    const { user } = useAuth();

    // Only this article is read (once per visit; saving updates the same copy)
    const article = useAdminDoc(path, readArticleDoc);
    const saved = useMemo(() => (article.raw && article.data ? toArticleForm(article.data) : null), [article.raw, article.data]);
    const { draft, update, dirty, reset } = useDraft(saved);
    useUnsavedChangesGuard(dirty);

    const [errors, setErrors] = useState<ArticleErrors>({});
    const [saving, setSaving] = useState(false);
    const [busy, setBusy] = useState<Busy>(null);
    const [deleted, setDeleted] = useState(false);

    // A deleted article is forgotten once this page closes (not while it's open, which would read it again)
    const deletedRef = useRef(false);
    useEffect(
        () => () => {
            if (deletedRef.current) invalidateAdminDocs(path);
        },
        [path]
    );

    const data = article.data;
    const backHref = articleListHref(data);
    const crumbs = [{ ...CRUMBS[0], href: backHref }];

    if (deleted) {
        return (
            <AdminPage title="تعديل المقال" breadcrumbs={crumbs}>
                <Alert>اتمسح المقال. بنرجعك للقايمة…</Alert>
            </AdminPage>
        );
    }

    if (article.loading) {
        return (
            <AdminPage title="تعديل المقال" breadcrumbs={CRUMBS}>
                <EditorSkeleton />
            </AdminPage>
        );
    }

    if (!article.raw || !data || !draft) {
        return (
            <AdminPage title="تعديل المقال" breadcrumbs={CRUMBS}>
                {article.status === "error" ? (
                    <LoadError message="ما قدرناش نقرا المقال." onRetry={() => void article.reload()} />
                ) : (
                    <EmptyState
                        title="المقال ده مش موجود"
                        description="ممكن يكون اتمسح. ارجع للقايمة وافتح مقال تاني."
                        action={
                            <ButtonLink href="/admin/articles?tab=published" variant="secondary">
                                رجوع للمقالات
                            </ButtonLink>
                        }
                    />
                )}
            </AdminPage>
        );
    }

    const pending = isPendingArticle(data);
    const isPublic = isPublicArticle(data);
    const status = articleStatus(data);
    const title = articleTitle(data);
    const created = formatDate(data.createdAt);

    /** Shows what's missing; false when the text can't be saved yet. */
    const checkFields = () => {
        const found = validateArticle(draft);
        setErrors(found);
        const firstInvalid = Object.keys(found)[0];
        if (!firstInvalid) return true;
        document.getElementById(`article-${firstInvalid}`)?.focus();
        toast.error("فيه بيانات ناقصة");
        return false;
    };

    const save = async () => {
        if (!checkFields()) return;
        setSaving(true);
        try {
            // Only the fields this page edits; the rest of the article stays as it is
            await article.save(articlePatch(draft, data.slug), { refresh: false });
            invalidateAdminLists("articles");
            afterArticleChange(id);
            toast.success("اتحفظ المقال");
        } catch (error) {
            console.error("Saving the article failed:", error);
            toast.error("ما قدرناش نحفظ. جرّب تاني.");
        } finally {
            setSaving(false);
        }
    };

    const setStatus = async (next: "published" | "pending") => {
        if (dirty && !checkFields()) return;
        if (next === "pending" && !window.confirm(`تلغي نشر «${title}»؟ هيختفي من الموقع ويرجع لقايمة المراجعة.`)) return;
        setBusy(next === "published" ? "publish" : "unpublish");
        try {
            // Unsaved edits go out with the new status in the same write, so nothing is lost
            await article.save({ ...(dirty ? articlePatch(draft, data.slug) : {}), status: next }, { refresh: false });
            invalidateAdminLists("articles");
            afterArticleChange(id);
            if (next === "published") await notifyAuthorApproved({ id, authorId: data.authorId }, user);
            toast.success(next === "published" ? "اتنشر المقال" : "اتلغى النشر، والمقال رجع لقايمة المراجعة");
        } catch (error) {
            console.error("Changing the article status failed:", error);
            toast.error("ما حصلش التغيير. جرّب تاني.");
        } finally {
            setBusy(null);
        }
    };

    const remove = async () => {
        if (!window.confirm(`تمسح «${title}»؟ مش هينفع ترجّعه تاني.`)) return;
        setBusy("delete");
        try {
            await deleteArticle(id);
            deletedRef.current = true;
            invalidateAdminLists("articles");
            setDeleted(true);
            toast.success("اتمسح المقال");
            router.replace(backHref);
        } catch (error) {
            console.error("Deleting the article failed:", error);
            toast.error("ما قدرناش نمسح المقال. جرّب تاني.");
            setBusy(null);
        }
    };

    const statusLocked = saving || busy !== null;

    return (
        <AdminPage
            title="تعديل المقال"
            breadcrumbs={crumbs}
            description={
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <Badge variant={status.variant}>{status.label}</Badge>
                    <span dir="auto">{data.authorName || "من غير اسم"}</span>
                    {created && (
                        <>
                            <span aria-hidden>·</span>
                            <span>{created}</span>
                        </>
                    )}
                </span>
            }
            actions={
                <>
                    {isPublic && (
                        <ButtonLink href={`/articles/${id}`} external variant="ghost">
                            <ExternalLink /> عرض على الموقع
                        </ButtonLink>
                    )}
                    {isPublic ? (
                        <Button variant="secondary" onClick={() => void setStatus("pending")} disabled={statusLocked}>
                            {busy === "unpublish" ? <Spinner className="size-4" /> : <EyeOff />}
                            إلغاء النشر
                        </Button>
                    ) : (
                        <Button variant="secondary" onClick={() => void setStatus("published")} disabled={statusLocked}>
                            {busy === "publish" ? <Spinner className="size-4" /> : <Check />}
                            نشر
                        </Button>
                    )}
                    <RowMenu label="إجراءات تانية">
                        {(close) => (
                            <MenuItem
                                danger
                                onClick={() => {
                                    close();
                                    if (busy === null) void remove();
                                }}
                            >
                                <Trash2 /> حذف المقال
                            </MenuItem>
                        )}
                    </RowMenu>
                </>
            }
        >
            {article.status === "error" && (
                <LoadError className="mb-6" message="ما قدرناش نحدّث المقال من قاعدة البيانات." onRetry={() => void article.reload()} />
            )}
            {pending && (
                <Alert variant="warning" className="mb-6">
                    المقال ده مستني المراجعة ومش ظاهر للزوار. اقراه، عدّل لو محتاج، وبعدين دوس «نشر» (بيحفظ تعديلاتك كمان).
                </Alert>
            )}

            <Card padding="lg">
                <ArticleFields value={draft} onChange={update} errors={errors} />
            </Card>

            <SaveBar
                dirty={dirty}
                saving={saving}
                disabled={busy !== null}
                onSave={() => void save()}
                onReset={() => {
                    reset();
                    setErrors({});
                }}
            />
        </AdminPage>
    );
}

function EditorSkeleton() {
    return (
        <Card padding="lg" role="status" className="space-y-5">
            <span className="sr-only">جاري تحميل المقال…</span>
            {[0, 1, 2].map((index) => (
                <div key={index} aria-hidden className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
            ))}
            <div aria-hidden className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-64 w-full" />
            </div>
        </Card>
    );
}
