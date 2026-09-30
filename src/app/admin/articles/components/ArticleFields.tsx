"use client";

import { MediaUpload, type MediaUploadLabels } from "@/components/admin/MediaUpload";
import { Field, Input, Textarea } from "@/components/ui";
import type { ArticleErrors, ArticleForm } from "../articleData";

const MEDIA_LABELS: MediaUploadLabels = {
    title: "الصور والفيديو",
    add: "إضافة",
    uploading: "بيفتح…",
    empty: "مفيش صور أو فيديو لسه. أول صورة بتبقى غلاف المقال.",
    image: "صورة",
    video: "فيديو",
    remove: "إزالة",
    openFailed: "ما قدرناش نفتح نافذة الرفع. جرّب تاني.",
};

interface ArticleFieldsProps {
    value: ArticleForm;
    onChange: <K extends keyof ArticleForm>(key: K, next: ArticleForm[K]) => void;
    errors: ArticleErrors;
}

/** The article form, shared by "new article" and the editor of an existing one. */
export function ArticleFields({ value, onChange, errors }: ArticleFieldsProps) {
    return (
        <div className="space-y-5">
            <Field label="العنوان" htmlFor="article-title" error={errors.title}>
                <Input
                    id="article-title"
                    dir="auto"
                    value={value.title}
                    onChange={(e) => onChange("title", e.target.value)}
                    aria-invalid={Boolean(errors.title)}
                />
            </Field>

            <Field
                label="الملخص"
                htmlFor="article-summary"
                hint={`سطرين عن المقال لنتايج جوجل والمشاركة. لو فاضي بيتاخد من أول المقال. (${value.summary.length}/160)`}
            >
                <Textarea
                    id="article-summary"
                    dir="auto"
                    rows={3}
                    value={value.summary}
                    onChange={(e) => onChange("summary", e.target.value)}
                    className="resize-none"
                />
            </Field>

            <Field label="الوسوم" htmlFor="article-tags" hint="افصل بينهم بفاصلة، مثلًا: ERP, Shopify, تسويق">
                <Input id="article-tags" dir="auto" value={value.tags} onChange={(e) => onChange("tags", e.target.value)} />
            </Field>

            <MediaUpload items={value.media} onChange={(media) => onChange("media", media)} labels={MEDIA_LABELS} />

            <Field label="المحتوى" htmlFor="article-content" hint="بيدعم Markdown (عناوين، قوايم، لينكات، صور)." error={errors.content}>
                <Textarea
                    id="article-content"
                    dir="auto"
                    value={value.content}
                    onChange={(e) => onChange("content", e.target.value)}
                    aria-invalid={Boolean(errors.content)}
                    className="h-80 font-mono"
                />
            </Field>
        </div>
    );
}
