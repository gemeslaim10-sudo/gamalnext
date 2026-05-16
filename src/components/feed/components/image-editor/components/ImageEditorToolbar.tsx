import { Crop as CropIcon, Droplet, Check, Type, Paintbrush } from "lucide-react";

export interface ImageEditorToolbarProps {
    mode: string;
    setMode: (mode: string) => void;
    onCancel: () => void;
    onSave: () => void;
    brushColor?: string;
    setBrushColor?: (color: string) => void;
    brushSize?: number;
    setBrushSize?: (size: number) => void;
    brushOpacity?: number;
    setBrushOpacity?: (opacity: number) => void;
    brushHardness?: number;
    setBrushHardness?: (hardness: number) => void;
    textSize?: number;
    setTextSize?: (size: number) => void;
    textAlign?: "left" | "center" | "right";
    setTextAlign?: (align: "left" | "center" | "right") => void;
    textDir?: "ltr" | "rtl";
    setTextDir?: (dir: "ltr" | "rtl") => void;
}

export function ImageEditorToolbar({
    mode,
    setMode,
    onCancel,
    onSave,
    brushColor = "#ffffff",
    setBrushColor,
    brushSize = 5,
    setBrushSize,
    brushOpacity = 100,
    setBrushOpacity,
    brushHardness = 100,
    setBrushHardness,
    textSize = 24,
    setTextSize,
    textAlign = "left",
    setTextAlign,
    textDir = "ltr",
    setTextDir
}: ImageEditorToolbarProps) {
    return (
        <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-900/80 shrink-0">
            {mode === "none" ? (
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                        {/* Selection Tools */}
                        <div className="flex items-center gap-2 p-1.5 bg-slate-800/40 border border-slate-700/50 rounded-xl">
                            <button
                                onClick={() => setMode("crop")}
                                title="Crop (C)"
                                className="flex items-center gap-2 px-4 py-2 hover:bg-slate-700 text-white rounded-lg transition-colors"
                            >
                                <CropIcon className="w-4 h-4 text-blue-400" />
                                <span>Crop</span>
                            </button>
                            <button
                                onClick={() => setMode("blur")}
                                title="Blur (R)"
                                className="flex items-center gap-2 px-4 py-2 hover:bg-slate-700 text-white rounded-lg transition-colors"
                            >
                                <Droplet className="w-4 h-4 text-cyan-400" />
                                <span>Blur</span>
                            </button>
                        </div>
                        
                        <div className="w-px h-8 bg-slate-800 hidden sm:block"></div>

                        {/* Drawing Tools */}
                        <div className="flex items-center gap-2 p-1.5 bg-slate-800/40 border border-slate-700/50 rounded-xl">
                            <button
                                onClick={() => setMode("brush")}
                                title="Brush (B)"
                                className="flex items-center gap-2 px-4 py-2 hover:bg-slate-700 text-white rounded-lg transition-colors"
                            >
                                <Paintbrush className="w-4 h-4 text-emerald-400" />
                                <span>Brush</span>
                            </button>
                            <button
                                onClick={() => setMode("text")}
                                title="Text (T)"
                                className="flex items-center gap-2 px-4 py-2 hover:bg-slate-700 text-white rounded-lg transition-colors"
                            >
                                <Type className="w-4 h-4 text-amber-400" />
                                <span>Text</span>
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={onSave}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-medium transition-all shadow-lg shadow-blue-500/20"
                    >
                        <Check className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center justify-between w-full">
                        <p className="text-sm text-blue-400 font-medium whitespace-nowrap">
                            {mode === "crop" && "Drag to select crop area"}
                            {mode === "blur" && "Drag to select area to blur. You can apply multiple times."}
                            {mode === "brush" && "Draw on the image"}
                            {mode === "text" && "Click on the image to add text"}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                            {(mode === "brush" || mode === "text") && setBrushColor && (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-400">Color:</span>
                                    <input 
                                        type="color" 
                                        value={brushColor}
                                        onChange={(e) => setBrushColor(e.target.value)}
                                        className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                                    />
                                </div>
                            )}

                            {mode === "brush" && setBrushSize && setBrushOpacity && setBrushHardness && (
                                <>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-400">Size:</span>
                                        <input 
                                            type="range" min="1" max="100" 
                                            value={brushSize}
                                            onChange={(e) => setBrushSize(parseInt(e.target.value))}
                                            className="w-20 sm:w-24 accent-emerald-500"
                                        />
                                        <span className="text-xs text-slate-300 w-6">{brushSize}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-400">Opacity:</span>
                                        <input 
                                            type="range" min="1" max="100" 
                                            value={brushOpacity}
                                            onChange={(e) => setBrushOpacity(parseInt(e.target.value))}
                                            className="w-20 sm:w-24 accent-emerald-500"
                                        />
                                        <span className="text-xs text-slate-300 w-8">{brushOpacity}%</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-400">Hardness:</span>
                                        <input 
                                            type="range" min="0" max="100" 
                                            value={brushHardness}
                                            onChange={(e) => setBrushHardness(parseInt(e.target.value))}
                                            className="w-20 sm:w-24 accent-emerald-500"
                                        />
                                        <span className="text-xs text-slate-300 w-8">{brushHardness}%</span>
                                    </div>
                                </>
                            )}

                            {mode === "text" && setTextSize && setTextAlign && setTextDir && (
                                <>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-400">Size:</span>
                                        <input 
                                            type="range" min="10" max="200" 
                                            value={textSize}
                                            onChange={(e) => setTextSize(parseInt(e.target.value))}
                                            className="w-20 sm:w-24 accent-amber-500"
                                        />
                                        <span className="text-xs text-slate-300 w-8">{textSize}</span>
                                    </div>
                                    <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
                                        <button onClick={() => setTextAlign("left")} className={`px-2 py-1 text-xs rounded ${textAlign === "left" ? "bg-slate-700 text-white" : "text-slate-400"}`}>L</button>
                                        <button onClick={() => setTextAlign("center")} className={`px-2 py-1 text-xs rounded ${textAlign === "center" ? "bg-slate-700 text-white" : "text-slate-400"}`}>C</button>
                                        <button onClick={() => setTextAlign("right")} className={`px-2 py-1 text-xs rounded ${textAlign === "right" ? "bg-slate-700 text-white" : "text-slate-400"}`}>R</button>
                                    </div>
                                    <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
                                        <button onClick={() => setTextDir("ltr")} className={`px-2 py-1 text-xs rounded ${textDir === "ltr" ? "bg-slate-700 text-white" : "text-slate-400"}`}>LTR</button>
                                        <button onClick={() => setTextDir("rtl")} className={`px-2 py-1 text-xs rounded ${textDir === "rtl" ? "bg-slate-700 text-white" : "text-slate-400"}`}>RTL</button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => setMode("none")}
                            className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-medium transition-colors shadow-lg shadow-emerald-500/20"
                        >
                            <Check className="w-4 h-4" />
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
