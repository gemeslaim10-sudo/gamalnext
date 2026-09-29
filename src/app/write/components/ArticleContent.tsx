import { Field, Textarea } from "@/components/ui";
import { useCopy } from "@/components/providers/CopyProvider";
import { detectTextDir } from "@/lib/utils";
import type { WriteFormData } from "../types";

interface ArticleContentProps {
    formData: WriteFormData;
    setFormData: React.Dispatch<React.SetStateAction<WriteFormData>>;
}

export function ArticleContent({ formData, setFormData }: ArticleContentProps) {
    const t = useCopy();
    return (
        <Field label={t("account.writeContentLabel")} htmlFor="article-content">
            <Textarea
                id="article-content"
                required
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
                placeholder={t("account.writeContentPlaceholder")}
                dir={detectTextDir(formData.content)}
                className="min-h-96 resize-y"
            />
        </Field>
    );
}
