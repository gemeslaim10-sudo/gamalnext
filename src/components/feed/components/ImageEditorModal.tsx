"use client";

import { useState, useRef, useEffect } from "react";
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { X, Crop as CropIcon, Droplet, Check, Undo2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface ImageEditorModalProps {
    imageUrl: string;
    isOpen: boolean;
    onClose: () => void;
    onSave: (editedFile: File) => void;
}

export function ImageEditorModal({ imageUrl, isOpen, onClose, onSave }: ImageEditorModalProps) {
    const [mode, setMode] = useState<"none" | "crop" | "blur">("none");
    const [crop, setCrop] = useState<Crop>();
    const [currentImageSrc, setCurrentImageSrc] = useState(imageUrl);
    const [history, setHistory] = useState<string[]>([imageUrl]);
    const imageRef = useRef<HTMLImageElement | null>(null);

    // Reset when opened with a new image
    useEffect(() => {
        if (isOpen) {
            setCurrentImageSrc(imageUrl);
            setHistory([imageUrl]);
            setMode("none");
            setCrop(undefined);
        }
    }, [isOpen, imageUrl]);

    if (!isOpen) return null;

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        imageRef.current = e.currentTarget;
    };

    const pushToHistory = (newSrc: string) => {
        setHistory(prev => [...prev, newSrc]);
        setCurrentImageSrc(newSrc);
        setMode("none");
        setCrop(undefined);
    };

    const handleUndo = () => {
        if (history.length > 1) {
            const newHistory = [...history];
            newHistory.pop(); // Remove current
            const previous = newHistory[newHistory.length - 1];
            setHistory(newHistory);
            setCurrentImageSrc(previous);
            setMode("none");
            setCrop(undefined);
        }
    };

    const applyCrop = async () => {
        if (!imageRef.current || !crop || crop.width === 0 || crop.height === 0) {
            setMode("none");
            return;
        }

        try {
            const canvas = document.createElement("canvas");
            const image = imageRef.current;
            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;

            canvas.width = crop.width * scaleX;
            canvas.height = crop.height * scaleY;
            const ctx = canvas.getContext("2d");

            if (!ctx) throw new Error("No 2d context");

            ctx.drawImage(
                image,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                crop.width * scaleX,
                crop.height * scaleY
            );

            const base64Image = canvas.toDataURL("image/webp");
            pushToHistory(base64Image);
        } catch (e) {
            console.error("Crop failed", e);
            toast.error("Failed to crop image");
        }
    };

    const applyBlur = async () => {
        if (!imageRef.current || !crop || crop.width === 0 || crop.height === 0) {
            setMode("none");
            return;
        }

        try {
            const canvas = document.createElement("canvas");
            const image = imageRef.current;
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            const ctx = canvas.getContext("2d");

            if (!ctx) throw new Error("No 2d context");

            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;

            // 1. Draw original full image
            ctx.drawImage(image, 0, 0);

            // 2. Setup clipping to strictly the crop region
            ctx.save();
            ctx.beginPath();
            ctx.rect(
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY
            );
            ctx.clip();

            // 3. Set a very dense blur filter
            ctx.filter = "blur(40px) brightness(0.8)";

            // 4. Draw the ENTIRE image again, clipped to the rect
            // This prevents the blur from feathering at the selection edges
            ctx.drawImage(image, 0, 0);

            // 5. Add a semi-transparent overlay for extra text obscuring
            ctx.filter = "none";
            ctx.fillStyle = "rgba(15, 23, 42, 0.4)";
            ctx.fill();

            // 6. Reset clip and filter
            ctx.restore();

            const base64Image = canvas.toDataURL("image/webp");
            pushToHistory(base64Image);
        } catch (e) {
            console.error("Blur failed", e);
            toast.error("Failed to blur image");
        }
    };

    const handleSave = async () => {
        try {
            const res = await fetch(currentImageSrc);
            const blob = await res.blob();
            const file = new File([blob], `edited_${Date.now()}.webp`, { type: "image/webp" });
            onSave(file);
        } catch (e) {
            toast.error("Failed to save image");
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex flex-col bg-slate-950 animate-in fade-in duration-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-800 bg-slate-900/50 shrink-0">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        Edit Image
                    </h2>
                    <div className="flex items-center gap-2">
                        <button onClick={handleUndo} disabled={history.length <= 1} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent">
                            <Undo2 className="w-5 h-5" />
                        </button>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Editor Area */}
                <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-950/50 flex flex-col items-center justify-center min-h-[300px]">
                    {mode === "none" ? (
                        <img 
                            src={currentImageSrc} 
                            alt="Current" 
                            className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-xl"
                            crossOrigin="anonymous"
                        />
                    ) : (
                        <ReactCrop
                            crop={crop}
                            onChange={c => setCrop(c)}
                            className="max-w-full max-h-[60vh] shadow-xl rounded-lg"
                        >
                            <img 
                                src={currentImageSrc} 
                                alt="Crop target" 
                                onLoad={onImageLoad}
                                className="max-w-full max-h-[60vh] object-contain"
                                crossOrigin="anonymous"
                            />
                        </ReactCrop>
                    )}
                </div>

                {/* Toolbar */}
                <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-900/80 shrink-0">
                    {mode === "none" ? (
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setMode("crop")}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                                >
                                    <CropIcon className="w-4 h-4" />
                                    <span>Crop</span>
                                </button>
                                <button
                                    onClick={() => setMode("blur")}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                                >
                                    <Droplet className="w-4 h-4" />
                                    <span>Blur Region</span>
                                </button>
                            </div>
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-medium transition-all shadow-lg shadow-blue-500/20"
                            >
                                <Check className="w-4 h-4" />
                                Save Changes
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <p className="text-sm text-blue-400 font-medium">
                                {mode === "crop" ? "Drag to select crop area" : "Drag to select area to blur"}
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => { setMode("none"); setCrop(undefined); }}
                                    className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={mode === "crop" ? applyCrop : applyBlur}
                                    className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-medium transition-colors shadow-lg shadow-emerald-500/20"
                                >
                                    <Check className="w-4 h-4" />
                                    {mode === "crop" ? "Apply Crop" : "Apply Blur"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
        </div>
    );
}
