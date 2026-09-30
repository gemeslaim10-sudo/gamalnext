"use client";

import { useState, useRef, useId } from "react";
import { Upload, Image as ImageIcon, ClipboardPaste, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useImageUpload } from "./hooks/useImageUpload";

interface ImageUploadProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
}

export function ImageUpload({ value, onChange, label = "صورة المشروع" }: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const labelId = useId();
    const { loading, uploadFile, handleUpload, handlePaste, handleSmartPaste } = useImageUpload(onChange);

    return (
        <div
            ref={containerRef}
            className="space-y-2 rounded-control"
            onPaste={handlePaste as unknown as React.ClipboardEventHandler}
            tabIndex={0}
            role="group"
            aria-labelledby={labelId}
        >
            <span id={labelId} className="block text-sm font-medium text-foreground">{label}</span>

            <div
                className="relative"
                onDrop={async (e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file && file.type.startsWith("image/")) {
                        await uploadFile(file);
                    } else {
                        const url = e.dataTransfer.getData("text/plain");
                        if (url && /^https?:\/\//.test(url)) {
                            onChange(url);
                            toast.success("اتحط الرابط");
                        } else {
                            toast.error("اسحب ملف صورة أو رابط صورة");
                        }
                    }
                }}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
            >
                {value ? (
                    <div className="h-32 w-full overflow-hidden rounded-control border border-border bg-surface-hover sm:h-40">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={value} alt="معاينة الصورة" className="size-full object-contain" />
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={handleUpload}
                        disabled={loading}
                        className={cn(
                            "flex h-32 w-full flex-col items-center justify-center gap-2 rounded-card border border-dashed border-border-strong bg-surface px-4 text-center transition-colors hover:bg-surface-hover disabled:opacity-50 sm:h-40",
                            isDragging && "bg-surface-hover"
                        )}
                    >
                        <ImageIcon aria-hidden className="size-6 text-subtle" />
                        <span className="text-xs leading-relaxed text-muted">
                            {isDragging ? "سيب الصورة هنا" : "اضغط عشان تختار صورة، أو اسحبها هنا، أو الصقها (Ctrl+V)"}
                        </span>
                    </button>
                )}

                {isDragging && value && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-control border border-dashed border-border-strong bg-overlay">
                        <span className="text-sm font-medium text-foreground">سيبها عشان تترفع</span>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" onClick={handleUpload} disabled={loading} className="flex-1">
                    <Upload />
                    {loading ? "جاري الرفع…" : value ? "تغيير الصورة" : "اختيار صورة"}
                </Button>

                <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleSmartPaste}
                    disabled={loading}
                    title="الصق صورة أو رابط من الحافظة (Ctrl+V كمان بيشتغل)"
                >
                    <ClipboardPaste />
                    لصق
                </Button>

                {value && (
                    <Button variant="danger" size="icon-sm" onClick={() => onChange("")} aria-label="شيل الصورة" title="شيل الصورة">
                        <Trash2 />
                    </Button>
                )}
            </div>
        </div>
    );
}
