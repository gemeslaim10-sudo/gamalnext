import Image from "next/image";
import { Pencil, X } from "lucide-react";

interface EditPostMediaProps {
    images: string[];
    onEditImage: (index: number) => void;
    onRemoveImage: (index: number) => void;
}

const THUMB_ACTION =
    "flex size-8 items-center justify-center rounded-full bg-overlay text-foreground transition-colors hover:bg-background";

export function EditPostMedia({ images, onEditImage, onRemoveImage }: EditPostMediaProps) {
    if (images.length === 0) return null;

    return (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square overflow-hidden rounded-control border border-border bg-surface-hover">
                    <Image src={img} alt={`Upload ${idx + 1}`} fill sizes="(min-width: 640px) 160px, 50vw" className="object-cover" />
                    <div className="absolute right-1.5 top-1.5 flex gap-1.5">
                        <button
                            type="button"
                            onClick={() => onEditImage(idx)}
                            aria-label={`Edit image ${idx + 1}`}
                            className={THUMB_ACTION}
                        >
                            <Pencil className="size-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => onRemoveImage(idx)}
                            aria-label={`Remove image ${idx + 1}`}
                            className={THUMB_ACTION}
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
