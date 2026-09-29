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
        <div ref={containerRef} className="relative inline-flex max-h-[65vh] max-w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={imageSrc}
                alt="Draw target"
                className="pointer-events-none block max-h-[65vh] max-w-full"
                crossOrigin="anonymous"
            />
            {imageLoaded && (
                <canvas
                    ref={canvasRef}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                    className="absolute inset-0 h-full w-full cursor-crosshair touch-none"
                />
            )}
        </div>
    );
}
