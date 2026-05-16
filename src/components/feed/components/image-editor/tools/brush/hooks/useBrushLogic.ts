import { useRef, useState, useEffect, PointerEvent } from "react";
import { applyCanvasOverlay } from "../../../shared/utils";

interface UseBrushLogicProps {
    imageSrc: string;
    isActive: boolean;
    onCommit: (newSrc: string, keepMode?: boolean) => void;
    color: string;
    size: number;
    opacity: number;
    hardness: number;
}

export function useBrushLogic({ imageSrc, isActive, onCommit, color, size, opacity, hardness }: UseBrushLogicProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const imageRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            imageRef.current = img;
            setImageLoaded(true);
            if (canvasRef.current) {
                canvasRef.current.width = img.width;
                canvasRef.current.height = img.height;
                const ctx = canvasRef.current.getContext("2d");
                if (ctx) {
                    ctx.lineCap = "round";
                    ctx.lineJoin = "round";
                }
            }
        };
        img.src = imageSrc;
    }, [imageSrc]);

    const handlePointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
        if (!isActive) return;
        setIsDrawing(true);
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx && canvasRef.current && containerRef.current) {
            const scaleX = canvasRef.current.width / containerRef.current.clientWidth;
            const scaleY = canvasRef.current.height / containerRef.current.clientHeight;
            const rect = canvasRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;
            ctx.beginPath();
            ctx.moveTo(x, y);
        }
    };

    const handlePointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !isActive || !canvasRef.current || !containerRef.current) return;
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
            const scaleX = canvasRef.current.width / containerRef.current.clientWidth;
            const scaleY = canvasRef.current.height / containerRef.current.clientHeight;
            const rect = canvasRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;
            
            ctx.lineWidth = size * scaleX;
            ctx.strokeStyle = color;
            ctx.globalAlpha = opacity / 100;
            
            const blurAmount = (100 - hardness) / 2;
            ctx.shadowBlur = blurAmount * scaleX;
            ctx.shadowColor = color;
            
            ctx.lineTo(x, y);
            ctx.stroke();
            
            ctx.globalAlpha = 1.0;
            ctx.shadowBlur = 0;
        }
    };

    const handlePointerUp = async () => {
        if (isActive && isDrawing) {
            setIsDrawing(false);
            const ctx = canvasRef.current?.getContext("2d");
            if (ctx) {
                ctx.closePath();
                if (canvasRef.current) {
                    try {
                        const newSrc = await applyCanvasOverlay(imageSrc, canvasRef.current);
                        onCommit(newSrc, true); // Keep mode active for next stroke
                    } catch (e) {
                        console.error("Failed to apply brush stroke", e);
                    }
                }
            }
        }
    };

    return {
        canvasRef,
        containerRef,
        imageLoaded,
        handlePointerDown,
        handlePointerMove,
        handlePointerUp
    };
}
