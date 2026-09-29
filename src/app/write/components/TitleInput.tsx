import { Sparkles } from "lucide-react";
import { Button, Field, Input, Spinner } from "@/components/ui";
import { useCopy } from "@/components/providers/CopyProvider";
import { detectTextDir } from "@/lib/utils";
import type { WriteFormData } from "../types";

interface TitleInputProps {
    formData: WriteFormData;
    setFormData: React.Dispatch<React.SetStateAction<WriteFormData>>;
    enhancingTitle: boolean;
    generating: boolean;
    handleEnhanceTitle: () => void;
    handleAiGenerate: () => void;
}

export function TitleInput({
    formData,
    setFormData,
    enhancingTitle,
    generating,
    handleEnhanceTitle,
    handleAiGenerate
}: TitleInputProps) {
    const t = useCopy();
    return (
        <div className="flex flex-col gap-3">
            <Field label={t("account.writeTitleLabel")} htmlFor="article-title">
                <Input
                    id="article-title"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder={t("account.writeTitlePlaceholder")}
                    dir={detectTextDir(formData.title)}
                    className="h-12 text-lg font-medium"
                />
            </Field>

            {/* AI helpers: both work from the title */}
            <div className="flex flex-wrap gap-2">
                <Button
                    variant="secondary"
                    onClick={handleEnhanceTitle}
                    disabled={enhancingTitle || !formData.title}
                    title={t("account.writeEnhanceTitleTooltip")}
                >
                    {enhancingTitle ? <Spinner className="size-4" /> : <Sparkles />}
                    {t("account.writeEnhanceTitle")}
                </Button>
                <Button
                    variant="secondary"
                    onClick={handleAiGenerate}
                    disabled={generating || !formData.title}
                >
                    {generating ? <Spinner className="size-4" /> : <Sparkles />}
                    {t("account.writeGenerate")}
                </Button>
            </div>
        </div>
    );
}
