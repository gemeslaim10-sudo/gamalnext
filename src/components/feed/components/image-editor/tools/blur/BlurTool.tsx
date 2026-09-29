import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui";
import { useCopy } from "@/components/providers/CopyProvider";
import { cn } from "@/lib/utils";
import { ToolDisplayProps } from "../../shared/types";
import { useBlurLogic } from "./hooks/useBlurLogic";

export type BlurToolProps = ToolDisplayProps;

export function BlurTool({ imageSrc, isActive, onCommit }: BlurToolProps) {
    const { crop, setCrop, imageRef, handleApplyBlur } = useBlurLogic(imageSrc, isActive, onCommit);
    const t = useCopy();

    if (!isActive) return null;

    const hasSelection = !!crop && crop.width > 0 && crop.height > 0;

    return (
        <div className="flex max-w-full flex-col items-center gap-3">
            <ReactCrop
                crop={crop}
                onChange={c => setCrop(c)}
                className="max-h-[65vh] max-w-full [--rc-focus-color:var(--color-foreground)]"
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={imageSrc}
                    alt="Blur target"
                    onLoad={(e) => imageRef.current = e.currentTarget}
                    className="block max-h-[65vh] max-w-full object-contain"
                    crossOrigin="anonymous"
                />
            </ReactCrop>
            {/* Space is always reserved so the image doesn't move when a selection starts */}
            <Button variant="secondary" onClick={handleApplyBlur} className={cn(!hasSelection && "invisible")}>
                {t("account.editorApplyBlur")}
            </Button>
        </div>
    );
}
