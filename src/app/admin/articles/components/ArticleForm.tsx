import { X, Save } from "lucide-react";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { Button, Card, Field, Input, Textarea } from "@/components/ui";
import type { MediaItem } from "../types";

interface ArticleFormProps {
    currentId: string | null;
    formData: {
        title: string;
        slug: string;
        summary: string;
        content: string;
        media: MediaItem[];
    };
    setFormData: React.Dispatch<React.SetStateAction<{
        title: string;
        slug: string;
        summary: string;
        content: string;
        media: MediaItem[];
    }>>;
    generateSlug: (title: string) => string;
    resetForm: () => void;
    handleSubmit: (e: React.FormEvent) => void;
}

export function ArticleForm({
    currentId,
    formData,
    setFormData,
    generateSlug,
    resetForm,
    handleSubmit
}: ArticleFormProps) {
    return (
        <Card padding="lg" className="mb-6">
            <div className="mb-5 flex items-center justify-between gap-4">
                <h2 className="text-base font-semibold text-foreground">{currentId ? "Edit Article" : "Create New Article"}</h2>
                <Button variant="ghost" size="icon-sm" onClick={resetForm} aria-label="Close editor">
                    <X />
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Title" htmlFor="article-title">
                        <Input
                            id="article-title"
                            dir="auto"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </Field>
                    <Field label="Slug (Auto-generated if empty)" htmlFor="article-slug">
                        <Input
                            id="article-slug"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            placeholder={formData.title ? generateSlug(formData.title) : ""}
                            className="font-mono"
                        />
                    </Field>
                </div>

                <Field label="Summary (SEO Description)" htmlFor="article-summary">
                    <Textarea
                        id="article-summary"
                        dir="auto"
                        value={formData.summary}
                        onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                        rows={3}
                        className="resize-none"
                        required
                    />
                </Field>

                {/* Media Upload */}
                <MediaUpload
                    items={formData.media}
                    onChange={(media) => setFormData({ ...formData, media })}
                />

                <Field label="Content (Supports Markdown/HTML)" htmlFor="article-content">
                    <Textarea
                        id="article-content"
                        dir="auto"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="h-64 font-mono"
                        placeholder="Write your article content here..."
                        required
                    />
                </Field>

                <div className="flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:justify-end">
                    <Button variant="ghost" onClick={resetForm}>Cancel</Button>
                    <Button type="submit">
                        <Save /> Save Article
                    </Button>
                </div>
            </form>
        </Card>
    );
}
