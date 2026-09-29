import { Field, Textarea } from "@/components/ui";
import { useCopy } from "@/components/providers/CopyProvider";
import type { WriteFormData } from "../types";

interface ArticleMetaProps {
    formData: WriteFormData;
    setFormData: React.Dispatch<React.SetStateAction<WriteFormData>>;
}

/** SEO fields: meta description and tags (both filled by the AI generator too). */
export function ArticleMeta({ formData, setFormData }: ArticleMetaProps) {
    const t = useCopy();
    return (
        <div className="grid gap-6 sm:grid-cols-2">
            <Field
                label={t("account.writeSummaryLabel")}
                htmlFor="article-summary"
                hint={`${formData.summary.length}/160`}
            >
                <Textarea
                    id="article-summary"
                    value={formData.summary}
                    onChange={e => setFormData({ ...formData, summary: e.target.value })}
                    placeholder={t("account.writeSummaryPlaceholder")}
                    maxLength={160}
                    dir="auto"
                    className="min-h-32"
                />
            </Field>
            <Field label={t("account.writeTagsLabel")} htmlFor="article-tags">
                <Textarea
                    id="article-tags"
                    value={formData.tags}
                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                    placeholder={t("account.writeTagsPlaceholder")}
                    dir="auto"
                    className="min-h-32"
                />
            </Field>
        </div>
    );
}
