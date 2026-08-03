import { ToolDisplayProps } from "../../shared/types";
import { useTextLogic } from "./hooks/useTextLogic";

export interface TextToolProps extends ToolDisplayProps {
    color: string;
    size: number;
    align: "left" | "center" | "right";
    dir: "ltr" | "rtl";
}

export function TextTool({ imageSrc, isActive, onCommit, color, size, align, dir }: TextToolProps) {
    const {
        canvasRef,
        containerRef,
        inputRef,
        imageLoaded,
        textInput,
        setTextInput,
        handlePointerDown,
        handleApplyText
    } = useTextLogic({ imageSrc, isActive, onCommit, color, size, align, dir });

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
                    className="absolute inset-0 w-full h-full cursor-text"
                    style={{ touchAction: "none" }}
                />
            )}
            
            {textInput.visible && (
                <input
                    ref={inputRef}
                    type="text"
                    value={textInput.text}
                    onChange={(e) => setTextInput({ ...textInput, text: e.target.value })}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleApplyText();
                    }}
                    onBlur={() => {
                        setTimeout(handleApplyText, 150);
                    }}
                    className="absolute bg-transparent border-b-2 border-blue-500 border-dashed outline-none"
                    style={{
                        left: textInput.x,
                        top: textInput.y,
                        color: color,
                        fontSize: `${size}px`,
                        fontWeight: 'bold',
                        minWidth: '50px',
                        transform: align === 'center' ? 'translateX(-50%) translateY(-50%)' : align === 'right' ? 'translateX(-100%) translateY(-50%)' : 'translateY(-50%)',
                        textAlign: align,
                        direction: dir
                    }}
                    placeholder="Type..."
                />
            )}
        </div>
    );
}
