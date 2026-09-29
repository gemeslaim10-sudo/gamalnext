import { ToolDisplayProps } from "../../shared/types";
import { useCopy } from "@/components/providers/CopyProvider";
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
    const t = useCopy();

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
                    className="absolute inset-0 h-full w-full cursor-text touch-none"
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
                    className="absolute border-b-2 border-dashed border-foreground bg-transparent outline-none"
                    style={{
                        // Text color and size are the user's choices from the toolbar
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
                    placeholder={t("account.editorTextPlaceholder")}
                />
            )}
        </div>
    );
}
