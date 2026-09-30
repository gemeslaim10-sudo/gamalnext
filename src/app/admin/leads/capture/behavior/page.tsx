"use client";

import { useId } from "react";
import { SectionCard } from "@/components/admin/SectionCard";
import { Field, Input, Label, Switch } from "@/components/ui";
import { LEAD_CAPTURE_LIMITS } from "@/components/leads/settings";
import { CaptureEditor, useCapturePart } from "../components/CaptureEditor";

const KEYS = ["enabled", "delaySeconds"] as const;

/** Whether the popup opens by itself, and after how long. */
export default function CaptureBehaviorEditor() {
    const part = useCapturePart(KEYS);
    const switchId = useId();
    const delayId = useId();

    return (
        <CaptureEditor
            title="التوقيت والتشغيل"
            description="النافذة بتفتح مرة واحدة في الزيارة بعد الوقت ده، لحد ما الزائر يسيب رقمه. عمرها ما بتفتح لوحدها في صفحة التواصل أو ليك إنت كأدمن."
            part={part}
        >
            {(draft) => (
                <SectionCard title="التشغيل">
                    <div className="space-y-6">
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                                <Label htmlFor={switchId} className="cursor-pointer">
                                    النافذة تفتح لوحدها
                                </Label>
                                <p className="mt-1 text-xs text-subtle">لو قفلتها، بتفتح بس من الأزرار اللي بتطلبها، زي أزرار صفحة الأسعار.</p>
                            </div>
                            <Switch id={switchId} checked={draft.enabled} onCheckedChange={(enabled) => part.set({ enabled })} />
                        </div>
                        <Field
                            label="تفتح بعد (ثانية)"
                            htmlFor={delayId}
                            hint={`من 0 لـ ${LEAD_CAPTURE_LIMITS.delayMax}. بيدّي الصفحة وقت تظهر الأول.`}
                        >
                            <Input
                                id={delayId}
                                type="number"
                                inputMode="numeric"
                                dir="ltr"
                                min={0}
                                max={LEAD_CAPTURE_LIMITS.delayMax}
                                step={1}
                                value={String(draft.delaySeconds)}
                                disabled={!draft.enabled}
                                onChange={(e) =>
                                    part.set({
                                        delaySeconds: Math.min(LEAD_CAPTURE_LIMITS.delayMax, Math.max(0, Math.round(Number(e.target.value) || 0))),
                                    })
                                }
                                className="w-28 tabular-nums"
                            />
                        </Field>
                    </div>
                </SectionCard>
            )}
        </CaptureEditor>
    );
}
