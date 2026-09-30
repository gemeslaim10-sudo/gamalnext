"use client";

import { toast } from "react-hot-toast";
import type { User } from "firebase/auth";
import { loadFirestore } from "@/lib/firebase-app";
import { refreshSite } from "@/lib/refreshSite";
import { isPublicArticle } from "@/lib/content/shared";
import { slugFromTitle } from "@/lib/articles/paths";
import { invalidateAdminDocs, refreshAdminCounts, type AdminListOptions } from "@/components/admin/kit";
import { invalidateCounts, type CountFilter } from "@/components/admin/kit/listData";
import type { FirebaseTimestamp, MediaItem } from "@/types";

/** An article as stored. Older articles have `excerpt` / `coverImage` instead of `summary` / `media`. */
export interface ArticleDoc {
    title?: string;
    summary?: string;
    excerpt?: string;
    content?: string;
    media?: MediaItem[];
    coverImage?: string;
    tags?: string[];
    slug?: string;
    /** "pending" = waiting for review (private); missing or "published" = public */
    status?: string;
    authorId?: string;
    authorName?: string;
    createdAt?: FirebaseTimestamp;
    updatedAt?: FirebaseTimestamp;
}

export type ArticleRow = ArticleDoc & { id: string };

// ── Lists ─────────────────────────────────────────────────────────────────────

export const ARTICLE_TABS = ["pending", "published"] as const;
export type ArticleTab = (typeof ARTICLE_TABS)[number];

export const ARTICLE_LISTS: Record<ArticleTab, AdminListOptions> = {
    // Newest first (uses the status + createdAt index in firestore.indexes.json)
    pending: { where: { status: "pending" }, orderBy: "createdAt", direction: "desc", pageSize: 20 },
    // Every article, newest first; the ones waiting for review are hidden on screen. Older articles
    // have no status field at all, so the query can't pick "published" ones itself.
    published: { pageSize: 20 },
};

/** Published = all − pending (a missing status can't be counted directly). */
export const ARTICLE_COUNTS: Record<"pending" | "all", CountFilter> = { pending: { status: "pending" }, all: null };

// ── Reading ───────────────────────────────────────────────────────────────────

export const isPendingArticle = (article: { status?: unknown }) => article.status === "pending";

export function articleStatus(article: ArticleDoc): { label: string; variant: "warning" | "success" | "neutral" } {
    if (isPendingArticle(article)) return { label: "مستني المراجعة", variant: "warning" };
    if (isPublicArticle(article)) return { label: "منشور", variant: "success" };
    return { label: "مش منشور", variant: "neutral" };
}

export const articleTitle = (article: ArticleDoc) => article.title?.trim() || "مقال من غير عنوان";

export const articleSummary = (article: ArticleDoc) => (article.summary || article.excerpt || "").trim();

export function articleCover(article: ArticleDoc) {
    return article.media?.find((item) => item?.type === "image" && item.url)?.url || article.coverImage || undefined;
}

/** Where the list shows this article (so "back" returns to the right tab). */
export const articleListHref = (article: ArticleDoc | null | undefined) =>
    article && isPendingArticle(article) ? "/admin/articles" : "/admin/articles?tab=published";

/** For useAdminDoc: the stored fields as they are (missing document = no fields). */
export const readArticleDoc = (raw: Record<string, unknown> | null): ArticleDoc => (raw ?? {}) as ArticleDoc;

// ── The form ──────────────────────────────────────────────────────────────────

export interface ArticleForm {
    title: string;
    /** The readable end of the address (/articles/{slug}); empty = made from the title */
    slug: string;
    summary: string;
    /** Comma separated while editing; saved as a list */
    tags: string;
    media: MediaItem[];
    content: string;
}

export type ArticleErrors = Partial<Record<keyof ArticleForm, string>>;

export const EMPTY_ARTICLE: ArticleForm = { title: "", slug: "", summary: "", tags: "", media: [], content: "" };

export function toArticleForm(article: ArticleDoc): ArticleForm {
    const media = Array.isArray(article.media)
        ? article.media.filter((item) => item && typeof item.url === "string" && item.url)
        : article.coverImage
          ? [{ url: article.coverImage, type: "image" as const }]
          : [];
    return {
        title: article.title ?? "",
        slug: article.slug ?? "",
        summary: article.summary ?? article.excerpt ?? "",
        tags: Array.isArray(article.tags) ? article.tags.join(", ") : "",
        media,
        content: article.content ?? "",
    };
}

export function validateArticle(form: ArticleForm): ArticleErrors {
    const errors: ArticleErrors = {};
    if (!form.title.trim()) errors.title = "اكتب عنوان المقال";
    if (!form.content.trim()) errors.content = "اكتب محتوى المقال";
    return errors;
}

/** The fields the editor owns. The slug typed in the form wins, else the saved one, else one from the title. */
export function articlePatch(form: ArticleForm, currentSlug?: string) {
    return {
        title: form.title.trim(),
        summary: form.summary.trim(),
        content: form.content,
        media: form.media,
        tags: form.tags
            .split(/[,،]/)
            .map((tag) => tag.trim())
            .filter(Boolean),
        slug: slugFromTitle(form.slug) || currentSlug || slugFromTitle(form.title),
    };
}

// ── Changes ───────────────────────────────────────────────────────────────────

/**
 * After any change: refresh the article's page, the blog and the home feed (and tell Bing & co.
 * about the article), then the menu counters and the tab totals.
 */
export function afterArticleChange(articleId: string) {
    void refreshSite({ articleId }).then((ok) => {
        if (!ok) toast("اتحفظ، بس الموقع لسه ما اتحدّثش. لو التغيير ما ظهرش دوس «تفريغ الكاش» في الرئيسية.");
    });
    void refreshAdminCounts();
    invalidateCounts("articles");
}

/** Tells the author their article was approved (as the dashboard always did). Never blocks the approval. */
export async function notifyAuthorApproved(article: { id: string; authorId?: string }, admin: User | null) {
    if (!admin || !article.authorId || article.authorId === admin.uid) return;
    try {
        const { db, addDoc, collection, serverTimestamp } = await loadFirestore();
        await addDoc(collection(db, "notifications"), {
            recipientId: article.authorId,
            type: "article_approved",
            // The security rules accept only the signed-in user as the sender
            senderId: admin.uid,
            senderName: "Admin Team",
            link: `/articles/${article.id}`,
            read: false,
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Couldn't notify the author:", error);
        toast("اتنشر المقال، بس ما قدرناش نبعت إشعار للكاتب.");
    }
}

/** Publish ("published") or send back to review ("pending") from a list. */
export async function setArticleStatus(article: ArticleRow, status: "published" | "pending", admin: User | null) {
    const { db, doc, updateDoc, serverTimestamp } = await loadFirestore();
    await updateDoc(doc(db, "articles", article.id), { status, updatedAt: serverTimestamp() });
    // An editor opened earlier in this visit reads the article again
    invalidateAdminDocs(`articles/${article.id}`);
    afterArticleChange(article.id);
    if (status === "published") await notifyAuthorApproved(article, admin);
}

export async function deleteArticle(articleId: string) {
    const { db, doc, deleteDoc } = await loadFirestore();
    await deleteDoc(doc(db, "articles", articleId));
    afterArticleChange(articleId);
}

/** A new article by the signed-in admin, published right away. Returns its id. */
export async function createArticle(form: ArticleForm, admin: User) {
    const { db, addDoc, collection, serverTimestamp } = await loadFirestore();
    const ref = await addDoc(collection(db, "articles"), {
        ...articlePatch(form),
        status: "published",
        // The security rules require the author to be the signed-in user
        authorId: admin.uid,
        authorName: admin.displayName || "Admin",
        authorPhoto: admin.photoURL || "",
        likesCount: 0,
        commentsCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    afterArticleChange(ref.id);
    return ref.id;
}
