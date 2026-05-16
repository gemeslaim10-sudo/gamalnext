import { Loader2, Trash2, Save, Image as ImageIcon } from "lucide-react";

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
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-8 pt-6 border-t border-slate-800 gap-4">
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={onAddImageClick}
                    disabled={imagesCount >= 4 || isUploading}
                    className="flex items-center gap-2 text-slate-400 hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-6 h-6" />}
                    <span className="text-sm font-medium">{imagesCount}/4 Images</span>
                </button>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                    type="button"
                    onClick={onDelete}
                    disabled={isDeleting || isSubmitting || isUploading}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full font-medium transition-all disabled:opacity-50"
                >
                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    Delete
                </button>
                <button
                    type="submit"
                    disabled={isFormEmpty || isSubmitting || isUploading}
                    className="flex-2 sm:flex-none flex items-center justify-center gap-2 px-8 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20"
                >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Post
                </button>
            </div>
        </div>
    );
}
