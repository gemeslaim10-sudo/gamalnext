import Image from "next/image";
import { Edit2, X } from "lucide-react";

interface EditPostMediaProps {
    images: string[];
    onEditImage: (index: number) => void;
    onRemoveImage: (index: number) => void;
}

export function EditPostMedia({ images, onEditImage, onRemoveImage }: EditPostMediaProps) {
    if (images.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-3 mt-6">
            {images.map((img, idx) => (
                <div key={idx} className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border border-slate-700 group shadow-lg">
                    <Image src={img} alt={`Upload ${idx + 1}`} fill sizes="128px" className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                        <button
                            type="button"
                            onClick={() => onEditImage(idx)}
                            className="bg-blue-500 hover:bg-blue-400 text-white rounded-full p-2.5 transition-colors shadow-lg"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => onRemoveImage(idx)}
                            className="bg-red-500 hover:bg-red-400 text-white rounded-full p-2.5 transition-colors shadow-lg"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
