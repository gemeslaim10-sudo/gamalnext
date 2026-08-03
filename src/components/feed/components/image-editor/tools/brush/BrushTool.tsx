import { ToolDisplayProps } from "../../shared/types";
import { useBrushLogic } from "./hooks/useBrushLogic";

export interface BrushToolProps extends ToolDisplayProps {
    color: string;
    size: number;
    opacity: number;
    hardness: number;
}

export function BrushTool({ imageSrc, isActive, onCommit, color, size, opacity, hardness }: BrushToolProps) {
    const {
        canvasRef,
        containerRef,
        imageLoaded,
        handlePointerDown,
        handlePointerMove,
        handlePointerUp
    } = useBrushLogic({ imageSrc, isActive, onCommit, color, size, opacity, hardness });

    if (!isActive) return null;

    return (
        <div ref={containerRef} className="relative inline-flex max-w-full max-h-[65vh] rounded-lg overflow-hidden shadow-xl">
            <img 
                src={imageSrc} 
                alt="Draw target" 
                className="max-w-full max-h-[65vh] block pointer-events-none"
                crossOrigin="anonymous"
            />
            {imageLoaded && (
                <canvas
                    ref={canvasRef}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                    className="absolute inset-0 w-full h-full cursor-crosshair"
                    style={{ touchAction: "none" }}
                />
            )}
        </div>
    );
}
