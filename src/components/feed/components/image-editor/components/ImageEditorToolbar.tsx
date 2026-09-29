import { AlignCenter, AlignLeft, AlignRight, Crop, Droplet, Paintbrush, Type, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui";
import { useCopy } from "@/components/providers/CopyProvider";
import type { CopyKey } from "@/config/copy";
import { cn } from "@/lib/utils";

// Names and hints are edited in the dashboard (Image editor texts); shortcuts match ImageEditorModal
const TOOLS: { id: string; labelKey: CopyKey; shortcut: string; icon: LucideIcon; hintKey: CopyKey }[] = [
    { id: "crop", labelKey: "account.editorCrop", shortcut: "C", icon: Crop, hintKey: "account.editorCropHint" },
    { id: "blur", labelKey: "account.editorBlur", shortcut: "R", icon: Droplet, hintKey: "account.editorBlurHint" },
    { id: "brush", labelKey: "account.editorBrush", shortcut: "B", icon: Paintbrush, hintKey: "account.editorBrushHint" },
    { id: "text", labelKey: "account.editorText", shortcut: "T", icon: Type, hintKey: "account.editorTextHint" },
];

export interface ImageEditorToolbarProps {
    mode: string;
    setMode: (mode: string) => void;
    brushColor: string;
    setBrushColor: (color: string) => void;
    brushSize: number;
    setBrushSize: (size: number) => void;
    brushOpacity: number;
    setBrushOpacity: (opacity: number) => void;
    brushHardness: number;
    setBrushHardness: (hardness: number) => void;
    textSize: number;
    setTextSize: (size: number) => void;
    textAlign: "left" | "center" | "right";
    setTextAlign: (align: "left" | "center" | "right") => void;
    textDir: "ltr" | "rtl";
    setTextDir: (dir: "ltr" | "rtl") => void;
}

export function ImageEditorToolbar({
    mode,
    setMode,
    brushColor,
    setBrushColor,
    brushSize,
    setBrushSize,
    brushOpacity,
    setBrushOpacity,
    brushHardness,
    setBrushHardness,
    textSize,
    setTextSize,
    textAlign,
    setTextAlign,
    textDir,
    setTextDir
}: ImageEditorToolbarProps) {
    const t = useCopy();
    const activeTool = TOOLS.find((tool) => tool.id === mode);

    return (
        <div className="shrink-0 border-t border-border px-3 py-3 sm:px-4">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <div role="toolbar" aria-label="Editing tools" className="flex items-center gap-1">
                    {TOOLS.map(({ id, labelKey, shortcut, icon: Icon }) => {
                        const active = mode === id;
                        const label = t(labelKey);
                        return (
                            <Button
                                key={id}
                                variant="ghost"
                                aria-pressed={active}
                                aria-label={label}
                                title={`${label} (${shortcut})`}
                                onClick={() => setMode(active ? "none" : id)}
                                className={cn("px-3", active && "bg-surface-hover text-foreground")}
                            >
                                <Icon />
                                <span className="hidden sm:inline">{label}</span>
                            </Button>
                        );
                    })}
                </div>

                {activeTool && (
                    <>
                        {/* On phones the hint drops to its own line under the tools */}
                        <p className="order-last w-full text-sm text-muted sm:order-none sm:w-auto sm:flex-1">
                            {t(activeTool.hintKey)}
                        </p>
                        <Button variant="secondary" className="ml-auto" onClick={() => setMode("none")}>
                            {t("account.editorDone")}
                        </Button>
                    </>
                )}
            </div>

            {(mode === "brush" || mode === "text") && (
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-border pt-3">
                    <label className="flex items-center gap-2 text-xs text-muted">
                        {t("account.editorColor")}
                        <input
                            type="color"
                            value={brushColor}
                            onChange={(e) => setBrushColor(e.target.value)}
                            className="h-8 w-10 cursor-pointer rounded-control border border-border bg-transparent p-0.5"
                        />
                    </label>

                    {mode === "brush" && (
                        <>
                            <RangeControl label={t("account.editorSize")} min={1} max={100} value={brushSize} onChange={setBrushSize} />
                            <RangeControl label={t("account.editorOpacity")} min={1} max={100} value={brushOpacity} onChange={setBrushOpacity} suffix="%" />
                            <RangeControl label={t("account.editorHardness")} min={0} max={100} value={brushHardness} onChange={setBrushHardness} suffix="%" />
                        </>
                    )}

                    {mode === "text" && (
                        <>
                            <RangeControl label={t("account.editorSize")} min={10} max={200} value={textSize} onChange={setTextSize} />
                            <Segmented
                                label="Text alignment"
                                value={textAlign}
                                onChange={setTextAlign}
                                options={[
                                    { value: "left", label: t("account.editorAlignLeft"), icon: AlignLeft },
                                    { value: "center", label: t("account.editorAlignCenter"), icon: AlignCenter },
                                    { value: "right", label: t("account.editorAlignRight"), icon: AlignRight },
                                ]}
                            />
                            <Segmented
                                label="Text direction"
                                value={textDir}
                                onChange={setTextDir}
                                options={[
                                    { value: "ltr", label: t("account.editorLtr") },
                                    { value: "rtl", label: t("account.editorRtl") },
                                ]}
                            />
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

interface RangeControlProps {
    label: string;
    min: number;
    max: number;
    value: number;
    onChange: (value: number) => void;
    suffix?: string;
}

function RangeControl({ label, min, max, value, onChange, suffix = "" }: RangeControlProps) {
    return (
        <label className="flex items-center gap-2 text-xs text-muted">
            {label}
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="w-24 accent-foreground"
            />
            <span className="w-9 tabular-nums text-foreground">
                {value}
                {suffix}
            </span>
        </label>
    );
}

interface SegmentedProps<T extends string> {
    label: string;
    value: T;
    onChange: (value: T) => void;
    options: { value: T; label: string; icon?: LucideIcon }[];
}

/** Small group of toggle buttons where exactly one option is active. */
function Segmented<T extends string>({ label, value, onChange, options }: SegmentedProps<T>) {
    return (
        <div role="group" aria-label={label} className="flex items-center gap-0.5 rounded-control border border-border p-0.5">
            {options.map(({ value: optionValue, label: optionLabel, icon: Icon }) => {
                const active = optionValue === value;
                return (
                    <button
                        key={optionValue}
                        type="button"
                        aria-pressed={active}
                        aria-label={optionLabel}
                        title={optionLabel}
                        onClick={() => onChange(optionValue)}
                        className={cn(
                            "flex h-8 min-w-8 items-center justify-center rounded-control px-2 text-xs font-medium transition-colors",
                            active ? "bg-surface-hover text-foreground" : "text-muted hover:text-foreground"
                        )}
                    >
                        {Icon ? <Icon className="size-4" /> : optionLabel}
                    </button>
                );
            })}
        </div>
    );
}
