"use client";

import { useState, useEffect } from 'react';
import { toast } from "react-hot-toast";
import { useImageEditor } from "./image-editor/hooks/useImageEditor";
import { ImageEditorHeader } from "./image-editor/components/ImageEditorHeader";
import { ImageEditorToolbar } from "./image-editor/components/ImageEditorToolbar";

import { CropTool } from "./image-editor/tools/crop/CropTool";
import { BlurTool } from "./image-editor/tools/blur/BlurTool";
import { BrushTool } from "./image-editor/tools/brush/BrushTool";
import { TextTool } from "./image-editor/tools/text/TextTool";

interface ImageEditorModalProps {
    imageUrl: string;
    isOpen: boolean;
    onClose: () => void;
    onSave: (editedFile: File) => void;
}

export function ImageEditorModal({ imageUrl, isOpen, onClose, onSave }: ImageEditorModalProps) {
    const {
        mode,
        setMode,
        currentImageSrc,
        history,
        handleUndo,
        commitChange
    } = useImageEditor(imageUrl, isOpen);

    const [brushColor, setBrushColor] = useState("#3b82f6");
    const [brushSize, setBrushSize] = useState(5);
    const [brushOpacity, setBrushOpacity] = useState(100);
    const [brushHardness, setBrushHardness] = useState(100);

    const [textSize, setTextSize] = useState(24);
    const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("left");
    const [textDir, setTextDir] = useState<"ltr" | "rtl">("rtl");

    // Keyboard Shortcuts
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't trigger shortcuts if user is typing in text input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            if (e.ctrlKey && e.key === 'z') {
                e.preventDefault();
                handleUndo();
            } else if (e.key === 'c') setMode('crop');
            else if (e.key === 'b') setMode('brush');
            else if (e.key === 't') setMode('text');
            else if (e.key === 'r') setMode('blur');
            else if (e.key === 'Escape') {
                if (mode !== 'none') setMode('none');
                else onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, handleUndo, setMode, mode, onClose]);

    const handleSave = async () => {
        try {
            const res = await fetch(currentImageSrc);
            const blob = await res.blob();
            const file = new File([blob], "edited-image.webp", { type: "image/webp" });
            onSave(file);
        } catch (e) {
            console.error("Save failed", e);
            toast.error("Failed to save image");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex flex-col bg-[#020617] animate-in fade-in duration-200 overflow-hidden">
            <ImageEditorHeader 
                canUndo={history.length > 1}
                onUndo={handleUndo}
                onClose={onClose}
            />

            {/* Dashboard Editor Area */}
            <div className="flex-1 overflow-auto p-4 sm:p-6 bg-[#020617] bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0.1))] flex flex-col items-center justify-center min-h-[300px]">
                <div className="relative flex items-center justify-center">
                    {mode === "none" && (
                        <img 
                            src={currentImageSrc} 
                            alt="Current" 
                            className="max-w-full max-h-[65vh] object-contain rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
                            crossOrigin="anonymous"
                        />
                    )}

                    <CropTool 
                        imageSrc={currentImageSrc} 
                        isActive={mode === "crop"} 
                        onCommit={commitChange} 
                    />
                    
                    <BlurTool 
                        imageSrc={currentImageSrc} 
                        isActive={mode === "blur"} 
                        onCommit={commitChange} 
                    />

                    <BrushTool 
                        imageSrc={currentImageSrc} 
                        isActive={mode === "brush"} 
                        onCommit={commitChange} 
                        color={brushColor}
                        size={brushSize}
                        opacity={brushOpacity}
                        hardness={brushHardness}
                    />

                    <TextTool 
                        imageSrc={currentImageSrc} 
                        isActive={mode === "text"} 
                        onCommit={commitChange} 
                        color={brushColor}
                        size={textSize}
                        align={textAlign}
                        dir={textDir}
                    />
                </div>
            </div>

            <ImageEditorToolbar
                mode={mode}
                setMode={setMode}
                onCancel={() => setMode("none")}
                onSave={handleSave}
                brushColor={brushColor}
                setBrushColor={setBrushColor}
                brushSize={brushSize}
                setBrushSize={setBrushSize}
                brushOpacity={brushOpacity}
                setBrushOpacity={setBrushOpacity}
                brushHardness={brushHardness}
                setBrushHardness={setBrushHardness}
                textSize={textSize}
                setTextSize={setTextSize}
                textAlign={textAlign}
                setTextAlign={setTextAlign}
                textDir={textDir}
                setTextDir={setTextDir}
            />
        </div>
    );
}
