import { useState, useEffect, useCallback } from "react";
import { EditorMode } from "../shared/types";

export function useImageEditor(imageUrl: string, isOpen: boolean) {
    const [mode, setMode] = useState<EditorMode>("none");
    const [currentImageSrc, setCurrentImageSrc] = useState(imageUrl);
    const [history, setHistory] = useState<string[]>([imageUrl]);

    // Reset when opened with a new image
    useEffect(() => {
        if (isOpen) {
            setCurrentImageSrc(imageUrl);
            setHistory([imageUrl]);
            setMode("none");
        }
    }, [isOpen, imageUrl]);

    const handleUndo = useCallback(() => {
        if (history.length > 1) {
            const newHistory = history.slice(0, -1);
            setHistory(newHistory);
            setCurrentImageSrc(newHistory[newHistory.length - 1]);
        }
    }, [history]);

    const commitChange = useCallback((newSrc: string, keepMode = false) => {
        setHistory(prev => [...prev, newSrc]);
        setCurrentImageSrc(newSrc);
        if (!keepMode) setMode("none");
    }, []);

    return {
        mode,
        setMode,
        currentImageSrc,
        history,
        handleUndo,
        commitChange
    };
}
