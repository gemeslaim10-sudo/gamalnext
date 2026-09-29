"use client";

import { useState, useEffect } from 'react';
import { createPortal } from "react-dom";
import { toast } from "react-hot-toast";
import { OVERLAY_TRANSITION } from "@/components/ui";
import { usePresence } from "@/hooks/usePresence";
import { useCopy } from "@/components/providers/CopyProvider";
import { cn } from "@/lib/utils";
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
    onSave: (editedFile: File) => void | Promise<void>;
}

/**
 * Reads a color token from the design tokens (e.g. "--color-foreground").
 * The color picker and the canvas need a real color value, not a CSS variable,
 * and the picker only accepts the long hex form, so the value is normalized through a canvas.
 */
function readColorToken(name: string) {
    if (typeof document === "undefined") return "";
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const ctx = document.createElement("canvas").getContext("2d");
    if (!value || !ctx) return value;
    ctx.fillStyle = value;
    return String(ctx.fillStyle);
}

/** Full-screen editor (crop, blur, brush, text) used when creating or editing a post. */
export function ImageEditorModal({ imageUrl, isOpen, onClose, onSave }: ImageEditorModalProps) {
    const {
        mode,
        setMode,
        currentImageSrc,
        history,
        handleUndo,
        commitChange
    } = useImageEditor(imageUrl, isOpen);
    const t = useCopy();

    // Brush/text color is picked by the user; it starts as the UI foreground color
    const [brushColor, setBrushColor] = useState(() => readColorToken("--color-foreground"));
    const [brushSize, setBrushSize] = useState(5);
    const [brushOpacity, setBrushOpacity] = useState(100);
    const [brushHardness, setBrushHardness] = useState(100);

    const [textSize, setTextSize] = useState(24);
    const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("left");
    const [textDir, setTextDir] = useState<"ltr" | "rtl">("rtl");

    const [saving, setSaving] = useState(false);
    const presence = usePresence(isOpen);

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

    // Keep the page behind the editor from scrolling
    useEffect(() => {
        if (!isOpen) return undefined;
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previous;
        };
    }, [isOpen]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(currentImageSrc);
            const blob = await res.blob();
            const file = new File([blob], "edited-image.webp", { type: "image/webp" });
            await onSave(file);
        } catch (e) {
            console.error("Save failed", e);
            toast.error(t("account.editorSaveFailed"));
        } finally {
            setSaving(false);
        }
    };

    if (!presence.mounted) return null;

    return createPortal(
        <div
            role="dialog"
            aria-modal="true"
            aria-label={t("account.editorTitle")}
            data-state={presence.state}
            className={cn(
                "fixed inset-0 z-50 flex flex-col overscroll-contain bg-background",
                OVERLAY_TRANSITION,
                "data-[state=closed]:translate-y-3 data-[state=closed]:opacity-0"
            )}
        >
            <ImageEditorHeader
                canUndo={history.length > 1}
                onUndo={handleUndo}
                onCancel={onClose}
                onSave={handleSave}
                saving={saving}
            />

            {/* Canvas area. m-auto keeps the image centered without cutting it off when it is taller than the area */}
            <div className="flex min-h-0 flex-1 overflow-auto bg-surface-hover p-4 sm:p-6">
                <div className="relative m-auto flex items-center justify-center">
                    {mode === "none" && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={currentImageSrc}
                            alt="Current"
                            className="block max-h-[65vh] max-w-full object-contain"
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
        </div>,
        document.body
    );
}
