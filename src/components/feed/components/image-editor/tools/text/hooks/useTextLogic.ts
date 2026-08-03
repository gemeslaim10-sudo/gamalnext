import { useRef, useEffect, useState, PointerEvent } from "react";
import { applyCanvasOverlay } from "../../../shared/utils";

interface UseTextLogicProps {
    imageSrc: string;
    isActive: boolean;
    onCommit: (newSrc: string, keepMode?: boolean) => void;
    color: string;
    size: number;
    align: "left" | "center" | "right";
    dir: "ltr" | "rtl";
}

export function useTextLogic({ imageSrc, isActive, onCommit, color, size, align, dir }: UseTextLogicProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [textInput, setTextInput] = useState({ visible: false, x: 0, y: 0, text: "" });
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            setImageLoaded(true);
            if (canvasRef.current) {
                canvasRef.current.width = img.width;
                canvasRef.current.height = img.height;
            }
        };
        img.src = imageSrc;
    }, [imageSrc]);

    const handleApplyText = async () => {
        if (!textInput.visible || !canvasRef.current) return;
        
        const txt = textInput.text.trim();
        if (!txt) {
            setTextInput({ visible: false, x: 0, y: 0, text: "" });
            return;
        }

        const ctx = canvasRef.current.getContext("2d");
        if (ctx && containerRef.current) {
            const scaleX = canvasRef.current.width / containerRef.current.clientWidth;
            const scaleY = canvasRef.current.height / containerRef.current.clientHeight;

            ctx.font = `bold ${size * scaleX}px Arial`;
            ctx.fillStyle = color;
            ctx.textAlign = align;
            ctx.direction = dir;
            ctx.textBaseline = "middle";

            ctx.fillText(txt, textInput.x * scaleX, textInput.y * scaleY);
            
            try {
                const newSrc = await applyCanvasOverlay(imageSrc, canvasRef.current);
                onCommit(newSrc, true); // keep mode active for more text
            } catch (e) {
                console.error("Failed to apply text", e);
            }
        }
        setTextInput({ visible: false, x: 0, y: 0, text: "" });
    };

    const handlePointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
        if (!isActive) return;
        if (textInput.visible) {
            handleApplyText();
            return;
        }
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setTextInput({ visible: true, x, y, text: "" });
        setTimeout(() => inputRef.current?.focus(), 10);
    };

    return {
        canvasRef,
        containerRef,
        inputRef,
        imageLoaded,
        textInput,
        setTextInput,
        handlePointerDown,
        handleApplyText
    };
}
