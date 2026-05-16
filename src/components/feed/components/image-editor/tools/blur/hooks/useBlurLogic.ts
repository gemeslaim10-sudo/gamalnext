import { useState, useRef, useEffect } from "react";
import { type Crop } from "react-image-crop";
import { toast } from "react-hot-toast";

export function useBlurLogic(imageSrc: string, isActive: boolean, onCommit: (newSrc: string, keepMode?: boolean) => void) {
    const [crop, setCrop] = useState<Crop>();
    const imageRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        if (!isActive) setCrop(undefined);
    }, [isActive, imageSrc]);

    const handleApplyBlur = async () => {
        if (!imageRef.current || !crop || crop.width === 0 || crop.height === 0) return;
        
        try {
            const canvas = document.createElement("canvas");
            const image = imageRef.current;
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("No 2d context");

            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;

            ctx.drawImage(image, 0, 0);
            
            ctx.save();
            ctx.beginPath();
            ctx.rect(
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY
            );
            ctx.clip();
            
            ctx.filter = "blur(40px) brightness(0.8)";
            ctx.drawImage(image, 0, 0);
            ctx.restore();
            
            const newSrc = canvas.toDataURL("image/webp");
            onCommit(newSrc, true); // Keep mode active to allow multiple blurs
            setCrop(undefined); // Reset selection
        } catch (e) {
            console.error("Blur failed", e);
            toast.error("Failed to blur image");
        }
    };

    return {
        crop,
        setCrop,
        imageRef,
        handleApplyBlur
    };
}
