import { RefreshCcw, Wand2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button, ButtonLink, Field, Input, Spinner } from "@/components/ui";
import { useCopy } from "@/components/providers/CopyProvider";
import type { WriteFormData } from "../types";

interface ImageHelperProps {
    formData: WriteFormData;
    setFormData: React.Dispatch<React.SetStateAction<WriteFormData>>;
    regeneratingImage: boolean;
    imageQuery: string;
    handleAiImageRegenerate: () => void;
}

export function ImageHelper({
    formData,
    setFormData,
    regeneratingImage,
    imageQuery,
    handleAiImageRegenerate
}: ImageHelperProps) {
    const t = useCopy();
    const coverUrl = formData.media[0]?.url;
    // Shuffle only works for LoremFlickr/Pollinations (client-side URL tweak)
    const canShuffle = !!coverUrl && (coverUrl.includes('loremflickr') || coverUrl.includes('pollinations'));

    const shuffleImage = () => {
        const currentUrl = formData.media[0].url;
        let newUrl = currentUrl;
        if (currentUrl.includes('seed=')) {
            newUrl = currentUrl.replace(/seed=\d+/, `seed=${Math.floor(Math.random() * 1000000)}`);
        } else if (currentUrl.includes('random=')) {
            newUrl = currentUrl.replace(/random=\d+/, `random=${Date.now()}`);
        } else {
            const separator = currentUrl.includes('?') ? '&' : '?';
            newUrl = `${currentUrl}${separator}seed=${Math.floor(Math.random() * 1000000)}`;
        }
        setFormData(prev => ({ ...prev, media: [{ url: newUrl, type: 'image' }] }));
        toast.success(t("account.writeImageShuffled"));
    };

    return (
        <>
            {/* Auto-image controls */}
            {formData.media.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {canShuffle && (
                        <Button variant="secondary" onClick={shuffleImage}>
                            <RefreshCcw />
                            {t("account.writeShuffleImage")}
                        </Button>
                    )}
                    <Button variant="secondary" onClick={handleAiImageRegenerate} disabled={regeneratingImage}>
                        {regeneratingImage ? <Spinner className="size-4" /> : <Wand2 />}
                        {t("account.writeAiImage")}
                    </Button>
                </div>
            )}

            {/* Manual image search helper */}
            <Field label={t("account.writeImageUrlLabel")} htmlFor="article-image-url">
                <Input
                    id="article-image-url"
                    type="text"
                    placeholder={t("account.writeImageUrlPlaceholder")}
                    value={coverUrl || ""}
                    onChange={(e) => {
                        const url = e.target.value;
                        if (!url) {
                            setFormData({ ...formData, media: [] });
                        } else {
                            setFormData({ ...formData, media: [{ url, type: 'image' }] });
                        }
                    }}
                />
            </Field>

            {imageQuery && (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="min-w-0 break-words text-xs text-subtle">
                        {t("account.writeImageSuggestion", { query: imageQuery })}
                    </span>
                    <ButtonLink
                        external
                        variant="ghost"
                        href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(imageQuery)}`}
                    >
                        {t("account.writeSearchGoogle")}
                    </ButtonLink>
                    <ButtonLink
                        external
                        variant="ghost"
                        href={`https://unsplash.com/s/photos/${encodeURIComponent(imageQuery)}`}
                    >
                        {t("account.writeSearchUnsplash")}
                    </ButtonLink>
                </div>
            )}
        </>
    );
}
