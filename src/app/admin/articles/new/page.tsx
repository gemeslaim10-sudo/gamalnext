"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { toast } from "react-hot-toast";
import { AdminPage, invalidateAdminLists, useDraft, useUnsavedChangesGuard } from "@/components/admin/kit";
import { Button, Card, Spinner } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { ArticleFields } from "../components/ArticleFields";
import { EMPTY_ARTICLE, createArticle, validateArticle, type ArticleErrors } from "../articleData";

export default function NewArticlePage() {
    const router = useRouter();
    const { user } = useAuth();
    const { draft, update, dirty } = useDraft(EMPTY_ARTICLE);
    const [errors, setErrors] = useState<ArticleErrors>({});
    const [publishing, setPublishing] = useState(false);
    useUnsavedChangesGuard(dirty && !publishing);

    if (!draft) return null;

    const publish = async () => {
        const found = validateArticle(draft);
        setErrors(found);
        const firstInvalid = Object.keys(found)[0];
        if (firstInvalid) {
            document.getElementById(`article-${firstInvalid}`)?.focus();
            toast.error("فيه بيانات ناقصة");
            return;
        }
        if (!user) return;
        setPublishing(true);
        try {
            const id = await createArticle(draft, user);
            invalidateAdminLists("articles");
            toast.success("اتنشر المقال");
            // Keep editing the article that now exists
            router.replace(`/admin/articles/${id}`);
        } catch (error) {
            console.error("Creating the article failed:", error);
            toast.error("ما قدرناش ننشر المقال. جرّب تاني.");
            setPublishing(false);
        }
    };

    return (
        <AdminPage
            title="مقال جديد"
            description="المقال بيظهر في المدونة أول ما تدوس «نشر المقال»، وتقدر تعدّله بعد كده في أي وقت."
            breadcrumbs={[{ label: "المقالات", href: "/admin/articles?tab=published" }]}
        >
            <Card padding="lg">
                <ArticleFields value={draft} onChange={update} errors={errors} />
            </Card>

            {/* Same place and look as the save bar of the editors */}
            <div className="sticky bottom-0 z-20 -mx-4 mt-8 flex items-center justify-between gap-3 border-t border-border bg-background px-4 py-3 sm:-mx-6 sm:px-6">
                <p className="min-w-0 truncate text-sm text-subtle">لسه ما اتنشرش</p>
                <Button size="sm" onClick={() => void publish()} disabled={publishing}>
                    {publishing ? <Spinner className="size-4 text-primary-foreground" /> : <Send className="rtl:-scale-x-100" />}
                    نشر المقال
                </Button>
            </div>
        </AdminPage>
    );
}
