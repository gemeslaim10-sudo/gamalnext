"use client";

import { useEffect, useId, useState, type FormEvent, type KeyboardEvent } from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { Eye, Plus, Save, X } from "lucide-react";
import toast from "react-hot-toast";
import { db } from "@/lib/firebase";
import { refreshSite } from "@/lib/refreshSite";
import { cn } from "@/lib/utils";
import { SectionCard } from "@/components/admin/SectionCard";
import LeadCaptureModal from "@/components/leads/LeadCaptureModal";
import { openLeadModal } from "@/components/leads/events";
import {
    DEFAULT_LEAD_CAPTURE,
    LEAD_CAPTURE_DOC,
    LEAD_CAPTURE_LIMITS,
    cleanSuggestions,
    normalizeLeadCapture,
    type LeadCaptureSettings,
} from "@/components/leads/settings";
import { Alert, Button, Field, Input, Label, LoadingBlock, PageHeader, Textarea } from "@/components/ui";

type TextKey = { [K in keyof LeadCaptureSettings]: LeadCaptureSettings[K] extends string ? K : never }[keyof LeadCaptureSettings];

interface TextFieldConfig {
    key: TextKey;
    label: string;
    hint?: string;
    /** Spans the full width */
    wide?: boolean;
    /** Textarea (always full width) */
    multiline?: boolean;
}

const GREETING_FIELDS: TextFieldConfig[] = [
    { key: "title", label: "Greeting", wide: true },
    { key: "subtitle", label: "Your message", hint: "A short line from you, in the first person.", multiline: true },
];

const FORM_FIELDS: TextFieldConfig[] = [
    { key: "nameLabel", label: "Name label" },
    { key: "namePlaceholder", label: "Name placeholder" },
    { key: "phoneLabel", label: "Phone label" },
    { key: "phonePlaceholder", label: "Phone placeholder" },
    { key: "serviceLabel", label: "Service label", hint: "Popup only." },
    { key: "servicePlaceholder", label: "Service placeholder", hint: "Popup only." },
    { key: "submitLabel", label: "Send button", hint: "Popup only." },
    { key: "sendingLabel", label: "Send button while sending" },
    { key: "maybeLaterLabel", label: "“Maybe later” button", hint: "Popup only." },
    { key: "errorMessage", label: "Sending failed message" },
    { key: "nameError", label: "Missing name message" },
    { key: "phoneError", label: "Invalid phone message" },
    { key: "privacyNote", label: "Privacy note", multiline: true },
];

const THANKS_FIELDS: TextFieldConfig[] = [
    { key: "successTitle", label: "Title", hint: "{name} is replaced by the visitor's first name.", wide: true },
    { key: "successMessage", label: "Message", multiline: true },
    { key: "whatsappLabel", label: "WhatsApp button" },
    { key: "closeLabel", label: "Close button" },
];

const CONTACT_FIELDS: TextFieldConfig[] = [
    { key: "contactTitle", label: "Page title" },
    { key: "contactDetailsTitle", label: "Contact details title" },
    { key: "contactDescription", label: "Page description", multiline: true },
    { key: "contactFormTitle", label: "Form title" },
    { key: "contactSubmitLabel", label: "Send button" },
    { key: "contactFormDescription", label: "Form description", multiline: true },
    { key: "contactMessageLabel", label: "Message label" },
    { key: "contactMessagePlaceholder", label: "Message placeholder" },
];

export default function LeadCaptureSettingsPage() {
    const [draft, setDraft] = useState<LeadCaptureSettings | null>(null);
    const [loadError, setLoadError] = useState(false);
    const [attempt, setAttempt] = useState(0);
    const [saving, setSaving] = useState(false);
    const [newSuggestion, setNewSuggestion] = useState("");
    const switchId = useId();
    const delayId = useId();

    useEffect(() => {
        let active = true;
        getDoc(doc(db, LEAD_CAPTURE_DOC.collection, LEAD_CAPTURE_DOC.id))
            .then((snapshot) => {
                if (active) setDraft(normalizeLeadCapture(snapshot.data()));
            })
            .catch((error: unknown) => {
                console.error("Loading lead popup settings failed:", error);
                if (active) setLoadError(true);
            });
        return () => {
            active = false;
        };
    }, [attempt]);

    const retry = () => {
        setLoadError(false);
        setAttempt((n) => n + 1);
    };

    const setField = <K extends keyof LeadCaptureSettings>(key: K, value: LeadCaptureSettings[K]) =>
        setDraft((current) => (current ? { ...current, [key]: value } : current));

    const addSuggestion = () => {
        if (!draft) return;
        const value = newSuggestion.trim();
        if (!value) return;
        if (draft.serviceSuggestions.some((item) => item.toLowerCase() === value.toLowerCase())) {
            toast.error("That service is already in the list");
            return;
        }
        if (draft.serviceSuggestions.length >= LEAD_CAPTURE_LIMITS.suggestionsMax) {
            toast.error(`Up to ${LEAD_CAPTURE_LIMITS.suggestionsMax} suggestions`);
            return;
        }
        setField("serviceSuggestions", cleanSuggestions([...draft.serviceSuggestions, value]));
        setNewSuggestion("");
    };

    const removeSuggestion = (index: number) => {
        if (!draft) return;
        setField(
            "serviceSuggestions",
            draft.serviceSuggestions.filter((_, i) => i !== index)
        );
    };

    // Enter adds the suggestion instead of submitting the whole form
    const onSuggestionKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            addSuggestion();
        }
    };

    const save = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!draft || saving) return;
        // Trims texts, puts the default back into empty fields and keeps the delay in range
        const clean = normalizeLeadCapture(draft);
        setSaving(true);
        try {
            await setDoc(
                doc(db, LEAD_CAPTURE_DOC.collection, LEAD_CAPTURE_DOC.id),
                { ...clean, updatedAt: serverTimestamp() },
                { merge: true }
            );
            await refreshSite();
            setDraft(clean);
            toast.success("Popup settings saved");
        } catch (error) {
            console.error("Saving lead popup settings failed:", error);
            toast.error("Couldn't save the settings");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-content">
            <PageHeader
                title="Lead popup"
                description="The welcome popup that asks visitors for their name and phone number, and the same form on the Contact page."
                actions={
                    draft && (
                        <Button variant="secondary" onClick={() => openLeadModal({ source: "other" })} className="w-full sm:w-auto">
                            <Eye />
                            Preview
                        </Button>
                    )
                }
            />

            {loadError ? (
                <Alert variant="danger" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span>Couldn&apos;t load the popup settings.</span>
                    <Button variant="secondary" size="sm" onClick={retry}>
                        Try again
                    </Button>
                </Alert>
            ) : !draft ? (
                <LoadingBlock />
            ) : (
                <form onSubmit={save} className="space-y-6">
                    <SectionCard
                        title="Behavior"
                        description="Opens once per visit, after the delay, until the visitor leaves their number. It never opens by itself on the Contact page or for admins."
                    >
                        <div className="space-y-5">
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <Label htmlFor={switchId}>Show the popup automatically</Label>
                                    <p className="mt-1 text-xs text-subtle">
                                        When off, it only opens from buttons that ask for it, like the ones on Pricing.
                                    </p>
                                </div>
                                <Switch id={switchId} checked={draft.enabled} onChange={(value) => setField("enabled", value)} />
                            </div>
                            <Field
                                label="Delay (seconds)"
                                htmlFor={delayId}
                                hint={`0–${LEAD_CAPTURE_LIMITS.delayMax}. Gives the page time to appear first.`}
                            >
                                <Input
                                    id={delayId}
                                    type="number"
                                    inputMode="numeric"
                                    min={0}
                                    max={LEAD_CAPTURE_LIMITS.delayMax}
                                    step={1}
                                    value={String(draft.delaySeconds)}
                                    onChange={(e) =>
                                        setField(
                                            "delaySeconds",
                                            Math.min(LEAD_CAPTURE_LIMITS.delayMax, Math.max(0, Math.round(Number(e.target.value) || 0)))
                                        )
                                    }
                                    className="w-28"
                                />
                            </Field>
                        </div>
                    </SectionCard>

                    <SectionCard title="Greeting" description="Your photo, name and title above it come from Site settings.">
                        <TextFields fields={GREETING_FIELDS} draft={draft} onChange={setField} />
                    </SectionCard>

                    <SectionCard
                        title="Form"
                        description="Shared by the popup and the Contact page. An empty field goes back to the default shown in grey."
                    >
                        <TextFields fields={FORM_FIELDS} draft={draft} onChange={setField} />
                    </SectionCard>

                    <SectionCard
                        title="Suggested services"
                        description="Offered while the visitor fills in “What do you need?”. They can still type anything."
                    >
                        {draft.serviceSuggestions.length > 0 ? (
                            <ul className="divide-y divide-border rounded-control border border-border">
                                {draft.serviceSuggestions.map((item, index) => (
                                    <li key={item} className="flex items-center gap-2 py-1 pl-3 pr-1">
                                        <span dir="auto" className="min-w-0 flex-1 truncate text-sm text-foreground">
                                            {item}
                                        </span>
                                        <Button variant="ghost" size="icon" onClick={() => removeSuggestion(index)} aria-label={`Remove ${item}`}>
                                            <X />
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-subtle">No suggestions. Visitors type what they need.</p>
                        )}
                        <div className="mt-3 flex gap-2">
                            <Input
                                value={newSuggestion}
                                onChange={(e) => setNewSuggestion(e.target.value)}
                                onKeyDown={onSuggestionKeyDown}
                                maxLength={LEAD_CAPTURE_LIMITS.suggestionMax}
                                dir="auto"
                                placeholder="Add a service"
                                aria-label="New service suggestion"
                            />
                            <Button variant="secondary" onClick={addSuggestion} disabled={!newSuggestion.trim()} className="shrink-0">
                                <Plus />
                                Add
                            </Button>
                        </div>
                    </SectionCard>

                    <SectionCard title="Thank-you message" description="Shown after the visitor sends their number, in the popup and on the Contact page.">
                        <TextFields fields={THANKS_FIELDS} draft={draft} onChange={setField} />
                    </SectionCard>

                    <SectionCard
                        title="Contact page"
                        description="The name and phone fields, privacy note and thank-you message above are used there too."
                    >
                        <TextFields fields={CONTACT_FIELDS} draft={draft} onChange={setField} />
                    </SectionCard>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={saving} className="w-full sm:w-auto">
                            <Save />
                            {saving ? "Saving…" : "Save changes"}
                        </Button>
                    </div>
                </form>
            )}

            {/* The real popup, fed with the unsaved edits; the Preview button opens it */}
            {draft && <LeadCaptureModal preview={draft} />}
        </div>
    );
}

interface TextFieldsProps {
    fields: TextFieldConfig[];
    draft: LeadCaptureSettings;
    onChange: (key: TextKey, value: string) => void;
}

function TextFields({ fields, draft, onChange }: TextFieldsProps) {
    const id = useId();
    return (
        <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((field) => {
                const inputId = `${id}-${field.key}`;
                const common = {
                    id: inputId,
                    dir: "auto" as const,
                    value: draft[field.key],
                    placeholder: DEFAULT_LEAD_CAPTURE[field.key],
                };
                return (
                    <Field
                        key={field.key}
                        label={field.label}
                        htmlFor={inputId}
                        hint={field.hint}
                        className={cn((field.wide || field.multiline) && "sm:col-span-2")}
                    >
                        {field.multiline ? (
                            <Textarea {...common} className="resize-y" onChange={(e) => onChange(field.key, e.target.value)} />
                        ) : (
                            <Input {...common} onChange={(e) => onChange(field.key, e.target.value)} />
                        )}
                    </Field>
                );
            })}
        </div>
    );
}

/** On/off toggle (no shared primitive exists yet). */
function Switch({ id, checked, onChange }: { id: string; checked: boolean; onChange: (checked: boolean) => void }) {
    return (
        <button
            id={id}
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={cn(
                "inline-flex h-6 w-11 shrink-0 items-center rounded-full border px-0.5 transition-colors duration-(--motion-fast)",
                checked ? "border-primary bg-primary" : "border-border-strong bg-surface-hover"
            )}
        >
            <span
                aria-hidden
                className={cn(
                    "size-4.5 rounded-full transition-transform duration-(--motion-fast) ease-out",
                    checked ? "translate-x-5 bg-primary-foreground" : "translate-x-0 bg-muted"
                )}
            />
        </button>
    );
}
