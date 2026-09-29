"use client";

import { useId } from "react";
import { Plus, X, ClipboardPaste } from "lucide-react";
import { Button } from "@/components/ui";
import { useMultiImageUpload } from "./hooks/useMultiImageUpload";

interface MultiImageUploadProps {
    value: string[];
    onChange: (urls: string[]) => void;
    label?: string;
}

const TILE =
    "flex h-24 flex-col items-center justify-center gap-1.5 rounded-card border border-dashed border-border-strong bg-surface px-2 text-center text-xs text-muted transition-colors hover:bg-surface-hover hover:text-foreground disabled:opacity-50";

export function MultiImageUpload({ value = [], onChange, label = "معرض الصور (Gallery)" }: MultiImageUploadProps) {
    const labelId = useId();
    const {
        loading,
        containerRef,
        handleUpload,
        handlePaste,
        handleSmartPaste,
        removeImage
    } = useMultiImageUpload(value, onChange);

    return (
        <div
            ref={containerRef}
            className="space-y-2 rounded-control"
            onPaste={handlePaste as unknown as React.ClipboardEventHandler}
            tabIndex={0}
            role="group"
            aria-labelledby={labelId}
        >
            <div className="flex items-center justify-between gap-2">
                <span id={labelId} className="text-sm font-medium text-foreground">{label}</span>
                <span className="shrink-0 text-xs text-subtle">{value.length} صور</span>
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] gap-2">
                <button type="button" onClick={handleUpload} disabled={loading} className={TILE}>
                    <Plus aria-hidden className="size-4" />
                    {loading ? "جاري الرفع..." : "إضافة صور"}
                </button>

                <button
                    type="button"
                    onClick={handleSmartPaste}
                    disabled={loading}
                    className={TILE}
                    title="Paste from clipboard"
                >
                    <ClipboardPaste aria-hidden className="size-4" />
                    {loading ? "..." : "لصق (Paste)"}
                </button>

                {value.map((url, index) => (
                    <div key={index} className="relative h-24 overflow-hidden rounded-control border border-border bg-surface-hover">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt={`Gallery ${index + 1}`} className="size-full object-contain" />
                        <Button
                            variant="secondary"
                            size="icon-sm"
                            onClick={() => removeImage(index)}
                            aria-label={`حذف الصورة ${index + 1}`}
                            title="حذف الصورة"
                            className="absolute right-1.5 top-1.5 hover:text-danger"
                        >
                            <X />
                        </Button>
                    </div>
                ))}
            </div>

            <p className="text-xs leading-relaxed text-subtle">
                اضغط هنا ثم اضغط Ctrl+V، أو استخدم زر اللصق لرفع الصور مباشرة من الحافظة (الـ Clipboard).
            </p>
        </div>
    );
}
