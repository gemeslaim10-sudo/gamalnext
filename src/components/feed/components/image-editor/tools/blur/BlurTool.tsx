import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { ToolDisplayProps } from "../../shared/types";
import { useBlurLogic } from "./hooks/useBlurLogic";

export interface BlurToolProps extends ToolDisplayProps {}

export function BlurTool({ imageSrc, isActive, onCommit }: BlurToolProps) {
    const { crop, setCrop, imageRef, handleApplyBlur } = useBlurLogic(imageSrc, isActive, onCommit);

    if (!isActive) return null;

    return (
        <div className="relative inline-block max-w-full max-h-[65vh]">
            <ReactCrop
                crop={crop}
                onChange={c => setCrop(c)}
                className="max-w-full max-h-[65vh] shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-lg border border-white/10"
            >
                <img 
                    src={imageSrc} 
                    alt="Blur target" 
                    onLoad={(e) => imageRef.current = e.currentTarget}
                    className="max-w-full max-h-[65vh] object-contain block"
                    crossOrigin="anonymous"
                />
            </ReactCrop>
            {crop && crop.width > 0 && crop.height > 0 && (
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                    <button 
                        onClick={handleApplyBlur}
                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-medium shadow-lg"
                    >
                        Apply Blur
                    </button>
                </div>
            )}
        </div>
    );
}
