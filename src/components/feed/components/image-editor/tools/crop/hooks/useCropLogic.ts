import { useState, useRef, useEffect } from "react";
import { type Crop } from "react-image-crop";
import { toast } from "react-hot-toast";

export function useCropLogic(imageSrc: string, isActive: boolean, onCommit: (newSrc: string, keepMode?: boolean) => void) {
    const [crop, setCrop] = useState<Crop>();
    const imageRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        if (!isActive) setCrop(undefined);
    }, [isActive, imageSrc]);

    const handleApplyCrop = async () => {
        if (!imageRef.current || !crop || crop.width === 0 || crop.height === 0) return;
        
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
            
            const newSrc = canvas.toDataURL("image/webp");
            onCommit(newSrc, false); // Crop usually exits mode after apply
        } catch (e) {
            console.error("Crop failed", e);
            toast.error("Failed to crop image");
        }
    };

    return {
        crop,
        setCrop,
        imageRef,
        handleApplyCrop
    };
}
