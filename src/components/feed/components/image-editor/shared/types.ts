export type EditorMode = "none" | "crop" | "blur" | "brush" | "text" | string;

export interface ToolDisplayProps {
    imageSrc: string;
    isActive: boolean;
    onCommit: (newSrc: string, keepMode?: boolean) => void;
}
