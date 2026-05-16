import { Undo2, X } from "lucide-react";

interface ImageEditorHeaderProps {
    canUndo: boolean;
    onUndo: () => void;
    onClose: () => void;
}

export function ImageEditorHeader({ canUndo, onUndo, onClose }: ImageEditorHeaderProps) {
    return (
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-800 bg-slate-900/50 shrink-0">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Edit Image
            </h2>
            <div className="flex items-center gap-2">
                <button 
                    onClick={onUndo} 
                    disabled={!canUndo} 
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                >
                    <Undo2 className="w-5 h-5" />
                </button>
                <button 
                    onClick={onClose} 
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
