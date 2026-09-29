import { Save } from "lucide-react";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { useCopy } from "@/components/providers/CopyProvider";
import { Button, Field, Input, Spinner, Textarea } from "@/components/ui";

interface EditArticleFormProps {
    formData: {
        title: string;
        content: string;
        summary: string;
        tags: string;
        media: { url: string; type: 'image' | 'video' }[];
    };
    setFormData: (data: React.SetStateAction<{
        title: string;
        content: string;
        summary: string;
        tags: string;
        media: { url: string; type: 'image' | 'video' }[];
    }>) => void;
    saving: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

export function EditArticleForm({ formData, setFormData, saving, onSubmit }: EditArticleFormProps) {
    const t = useCopy();

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <Field label={t("blog.fieldTitle")} htmlFor="article-title">
                <Input
                    id="article-title"
                    required
                    dir="auto"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder={t("blog.fieldTitlePlaceholder")}
                />
            </Field>

            <MediaUpload
                items={formData.media}
                onChange={(media) => setFormData({ ...formData, media })}
            />

            <Field label={t("blog.fieldContent")} htmlFor="article-content">
                <Textarea
                    id="article-content"
                    required
                    dir="auto"
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                    className="h-96 font-mono"
                    placeholder={t("blog.fieldContentPlaceholder")}
                />
            </Field>

            <div className="grid gap-6 sm:grid-cols-2">
                <Field
                    label={t("blog.fieldSummary")}
                    htmlFor="article-summary"
                    hint={`${formData.summary.length}/160`}
                >
                    <Textarea
                        id="article-summary"
                        dir="auto"
                        value={formData.summary}
                        onChange={e => setFormData({ ...formData, summary: e.target.value })}
                        className="h-32"
                        placeholder={t("blog.fieldSummaryPlaceholder")}
                        maxLength={160}
                    />
                </Field>
                <Field label={t("blog.fieldTags")} htmlFor="article-tags">
                    <Textarea
                        id="article-tags"
                        dir="auto"
                        value={formData.tags}
                        onChange={e => setFormData({ ...formData, tags: e.target.value })}
                        className="h-32"
                        placeholder={t("blog.fieldTagsPlaceholder")}
                    />
                </Field>
            </div>

            <div className="flex justify-end border-t border-border pt-6">
                <Button type="submit" disabled={saving} className="w-full sm:w-auto">
                    {saving ? <Spinner className="size-4 text-primary-foreground" /> : <Save />}
                    {t("blog.save")}
                </Button>
            </div>
        </form>
    );
}
