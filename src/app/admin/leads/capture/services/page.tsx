"use client";

import { useState, type KeyboardEvent } from "react";
import { Plus, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { SectionCard } from "@/components/admin/SectionCard";
import { Button, Input } from "@/components/ui";
import { LEAD_CAPTURE_LIMITS, cleanSuggestions } from "@/components/leads/settings";
import { CaptureEditor, useCapturePart } from "../components/CaptureEditor";
import { TextFields, type TextFieldConfig } from "../components/TextFields";

const FIELDS: TextFieldConfig<"serviceLabel" | "servicePlaceholder">[] = [
    { key: "serviceLabel", label: "عنوان الخانة" },
    { key: "servicePlaceholder", label: "مثال جوه الخانة" },
];

const KEYS = ["serviceLabel", "servicePlaceholder", "serviceSuggestions"] as const;

/** The "What do you need?" field of the popup and the services suggested while typing in it. */
export default function CaptureServicesEditor() {
    const part = useCapturePart(KEYS);
    const [newSuggestion, setNewSuggestion] = useState("");

    const addSuggestion = (current: string[]) => {
        const value = newSuggestion.trim();
        if (!value) return;
        if (current.some((item) => item.toLowerCase() === value.toLowerCase())) {
            toast.error("الخدمة دي موجودة في القايمة.");
            return;
        }
        if (current.length >= LEAD_CAPTURE_LIMITS.suggestionsMax) {
            toast.error(`بحد أقصى ${LEAD_CAPTURE_LIMITS.suggestionsMax} اقتراح.`);
            return;
        }
        part.set({ serviceSuggestions: cleanSuggestions([...current, value]) });
        setNewSuggestion("");
    };

    return (
        <CaptureEditor
            title="الخدمات المقترحة"
            description="خانة «محتاج إيه؟» في النافذة (اختيارية للزائر)، والاقتراحات اللي بتظهر وهو بيكتب فيها."
            part={part}
            withPreview
        >
            {(draft) => {
                const suggestions = draft.serviceSuggestions;
                // Enter adds the suggestion instead of doing nothing
                const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
                    if (event.key === "Enter") {
                        event.preventDefault();
                        addSuggestion(suggestions);
                    }
                };

                return (
                    <>
                        <SectionCard title="الاقتراحات" description="الزائر يقدر يختار منها أو يكتب أي حاجة تانية.">
                            {suggestions.length > 0 ? (
                                <ul className="divide-y divide-border rounded-control border border-border">
                                    {suggestions.map((item) => (
                                        <li key={item} className="flex items-center gap-2 py-1 ps-3 pe-1">
                                            <span dir="auto" className="min-w-0 flex-1 truncate text-sm text-foreground">
                                                {item}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => part.set({ serviceSuggestions: suggestions.filter((entry) => entry !== item) })}
                                                aria-label={`شيل ${item}`}
                                                title="شيل"
                                            >
                                                <X />
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="rounded-control border border-border px-4 py-5 text-center text-sm text-subtle">
                                    مفيش اقتراحات؛ الزائر بيكتب اللي محتاجه.
                                </p>
                            )}
                            <div className="mt-3 flex gap-2">
                                <Input
                                    value={newSuggestion}
                                    onChange={(e) => setNewSuggestion(e.target.value)}
                                    onKeyDown={onKeyDown}
                                    maxLength={LEAD_CAPTURE_LIMITS.suggestionMax}
                                    dir="auto"
                                    placeholder="خدمة جديدة"
                                    aria-label="خدمة جديدة"
                                    className="min-w-0"
                                />
                                <Button variant="secondary" onClick={() => addSuggestion(suggestions)} disabled={!newSuggestion.trim()} className="shrink-0">
                                    <Plus />
                                    إضافة
                                </Button>
                            </div>
                            <p className="mt-2 text-xs text-subtle">
                                {newSuggestion.trim() ? (
                                    <span className="text-warning">لسه ما اتضافتش — دوس «إضافة» الأول.</span>
                                ) : (
                                    `${suggestions.length} من ${LEAD_CAPTURE_LIMITS.suggestionsMax}.`
                                )}
                            </p>
                        </SectionCard>

                        <SectionCard title="الخانة">
                            <TextFields fields={FIELDS} values={draft} onChange={(key, value) => part.set({ [key]: value })} />
                        </SectionCard>
                    </>
                );
            }}
        </CaptureEditor>
    );
}
