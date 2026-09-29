import { Undo2 } from "lucide-react";
import { Button, Spinner } from "@/components/ui";
import { useCopy } from "@/components/providers/CopyProvider";

interface ImageEditorHeaderProps {
    canUndo: boolean;
    onUndo: () => void;
    onCancel: () => void;
    onSave: () => void;
    saving: boolean;
}

export function ImageEditorHeader({ canUndo, onUndo, onCancel, onSave, saving }: ImageEditorHeaderProps) {
    const t = useCopy();
    return (
        <div className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-3 sm:px-4">
            <h2 className="min-w-0 truncate text-base font-semibold text-foreground">{t("account.editorTitle")}</h2>
            <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onUndo}
                    disabled={!canUndo || saving}
                    aria-label="Undo"
                    title={t("account.editorUndo")}
                >
                    <Undo2 />
                </Button>
                <Button variant="ghost" onClick={onCancel} disabled={saving}>
                    {t("account.editorCancel")}
                </Button>
                <Button onClick={onSave} disabled={saving}>
                    {saving && <Spinner className="size-4 text-primary-foreground" />}
                    {t("account.editorSave")}
                </Button>
            </div>
        </div>
    );
}
