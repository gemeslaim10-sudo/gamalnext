import { ImagePlus, Trash2 } from "lucide-react";
import { Button, Spinner } from "@/components/ui";
import { useCopy } from "@/components/providers/CopyProvider";

interface EditPostControlsProps {
    imagesCount: number;
    isUploading: boolean;
    isSubmitting: boolean;
    isDeleting: boolean;
    isFormEmpty: boolean;
    onAddImageClick: () => void;
    onDelete: () => void;
}

export function EditPostControls({
    imagesCount,
    isUploading,
    isSubmitting,
    isDeleting,
    isFormEmpty,
    onAddImageClick,
    onDelete
}: EditPostControlsProps) {
    const t = useCopy();
    return (
        <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <Button
                variant="ghost"
                className="self-start sm:self-auto"
                onClick={onAddImageClick}
                disabled={imagesCount >= 4 || isUploading}
            >
                {isUploading ? <Spinner className="size-4" /> : <ImagePlus />}
                {t("account.editPhotos")} {imagesCount}/4
            </Button>

            <div className="flex gap-2">
                <Button
                    variant="danger"
                    className="flex-1 sm:flex-none"
                    onClick={onDelete}
                    disabled={isDeleting || isSubmitting || isUploading}
                >
                    {isDeleting ? <Spinner className="size-4 text-danger" /> : <Trash2 />}
                    {t("account.editDelete")}
                </Button>
                <Button
                    type="submit"
                    className="flex-1 sm:flex-none"
                    disabled={isFormEmpty || isSubmitting || isUploading}
                >
                    {isSubmitting && <Spinner className="size-4 text-primary-foreground" />}
                    {t("account.editSave")}
                </Button>
            </div>
        </div>
    );
}
