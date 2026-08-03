import { ArrowLeft } from "lucide-react";

interface EditPostHeaderProps {
    onBack: () => void;
}

export function EditPostHeader({ onBack }: EditPostHeaderProps) {
    return (
        <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-4 sm:px-6 py-4 flex items-center gap-4">
            <button 
                onClick={onBack} 
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
                type="button"
            >
                <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-white">Edit Post</h1>
        </div>
    );
}
