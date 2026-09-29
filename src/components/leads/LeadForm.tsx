"use client";

import { useId, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Alert, Button, Field, Input, Spinner, Textarea } from "@/components/ui";
import { LEAD_LIMITS, validateLead, type LeadFieldErrors, type LeadSource } from "@/lib/leads/schema";
import { cn } from "@/lib/utils";
import { markLeadSubmitted } from "./events";
import { submitLead } from "./submitLead";

export interface LeadFormTexts {
    nameLabel: string;
    namePlaceholder: string;
    nameError: string;
    phoneLabel: string;
    phonePlaceholder: string;
    phoneError: string;
    serviceLabel?: string;
    servicePlaceholder?: string;
    messageLabel?: string;
    messagePlaceholder?: string;
    privacyNote: string;
    submitLabel: string;
    sendingLabel: string;
    errorMessage: string;
}

interface LeadFormProps {
    texts: LeadFormTexts;
    source: LeadSource;
    /** Adds the optional "What do you need?" field */
    showService?: boolean;
    serviceSuggestions?: string[];
    defaultService?: string;
    /** Adds an optional free-text message */
    showMessage?: boolean;
    /** "stacked": full-width buttons (popup). "inline": buttons side by side on wider screens (pages). */
    layout?: "stacked" | "inline";
    /** Extra buttons shown after the submit button */
    actions?: ReactNode;
    /** Validates and shows the thank-you state without saving anything (dashboard preview) */
    preview?: boolean;
    /** Called with the visitor's name once the lead is saved */
    onSuccess: (name: string) => void;
    className?: string;
}

type Values = { name: string; phone: string; service: string; message: string; company: string };
type ErrorField = keyof LeadFieldErrors;

const PHONE_INPUT_MAX = 24; // up to 15 digits plus spaces, dashes and "+"

/** Name + phone (+ optional service or message) form that saves a lead through `POST /api/leads`. */
export function LeadForm({
    texts,
    source,
    showService,
    serviceSuggestions = [],
    defaultService = "",
    showMessage,
    layout = "inline",
    actions,
    preview,
    onSuccess,
    className,
}: LeadFormProps) {
    const id = useId();
    const { user } = useAuth();
    const [values, setValues] = useState<Values>({ name: "", phone: "", service: defaultService, message: "", company: "" });
    const [errors, setErrors] = useState<LeadFieldErrors>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [sending, setSending] = useState(false);
    const [prefilled, setPrefilled] = useState(false);
    const nameRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);

    // Signed-in visitors get their Google name filled in (once, and never over what they typed)
    if (!prefilled && user) {
        setPrefilled(true);
        const displayName = user.displayName?.trim().slice(0, LEAD_LIMITS.nameMax);
        if (displayName) setValues((v) => (v.name ? v : { ...v, name: displayName }));
    }

    // The dashboard edits these messages; the schema's own texts are only used for rare cases
    const withTexts = (found: LeadFieldErrors): LeadFieldErrors => ({
        ...found,
        ...(found.name ? { name: texts.nameError } : {}),
        ...(found.phone ? { phone: texts.phoneError } : {}),
    });

    const update = (field: keyof Values) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { value } = event.target;
        setValues((v) => ({ ...v, [field]: value }));
        if (field !== "company" && errors[field as ErrorField]) setErrors((e) => ({ ...e, [field]: undefined }));
        if (formError) setFormError(null);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (sending) return;

        const lead = {
            name: values.name.trim(),
            phone: values.phone.trim(),
            service: showService ? values.service.trim() : "",
            message: showMessage ? values.message.trim() : "",
        };
        const found = validateLead(lead);
        if (Object.keys(found).length > 0) {
            setErrors(withTexts(found));
            if (found.name) nameRef.current?.focus();
            else if (found.phone) phoneRef.current?.focus();
            return;
        }

        if (preview) {
            onSuccess(lead.name);
            return;
        }

        setSending(true);
        setFormError(null);
        const result = await submitLead({
            name: lead.name,
            phone: lead.phone,
            service: lead.service || undefined,
            message: lead.message || undefined,
            source,
            page: window.location.pathname,
            company: values.company,
        });
        setSending(false);

        if (result.ok) {
            markLeadSubmitted();
            onSuccess(lead.name);
        } else if (result.errors && Object.keys(result.errors).length > 0) {
            setErrors(withTexts(result.errors));
        } else {
            setFormError(texts.errorMessage);
        }
    };

    const listId = `${id}-services`;
    const stacked = layout === "stacked";

    return (
        <form noValidate onSubmit={handleSubmit} className={cn("space-y-4", className)}>
            <Field label={texts.nameLabel} htmlFor={`${id}-name`} error={errors.name}>
                <Input
                    ref={nameRef}
                    id={`${id}-name`}
                    name="name"
                    autoComplete="name"
                    dir="auto"
                    required
                    maxLength={LEAD_LIMITS.nameMax}
                    placeholder={texts.namePlaceholder}
                    value={values.name}
                    onChange={update("name")}
                    aria-invalid={errors.name ? true : undefined}
                />
            </Field>

            <Field label={texts.phoneLabel} htmlFor={`${id}-phone`} error={errors.phone}>
                <Input
                    ref={phoneRef}
                    id={`${id}-phone`}
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    dir="ltr"
                    required
                    maxLength={PHONE_INPUT_MAX}
                    placeholder={texts.phonePlaceholder}
                    value={values.phone}
                    onChange={update("phone")}
                    aria-invalid={errors.phone ? true : undefined}
                />
            </Field>

            {showService && (
                <Field label={texts.serviceLabel} htmlFor={`${id}-service`} error={errors.service}>
                    <Input
                        id={`${id}-service`}
                        name="service"
                        list={serviceSuggestions.length > 0 ? listId : undefined}
                        autoComplete="off"
                        dir="auto"
                        maxLength={LEAD_LIMITS.serviceMax}
                        placeholder={texts.servicePlaceholder}
                        value={values.service}
                        onChange={update("service")}
                        aria-invalid={errors.service ? true : undefined}
                    />
                    {serviceSuggestions.length > 0 && (
                        <datalist id={listId}>
                            {serviceSuggestions.map((service) => (
                                <option key={service} value={service} />
                            ))}
                        </datalist>
                    )}
                </Field>
            )}

            {showMessage && (
                <Field label={texts.messageLabel} htmlFor={`${id}-message`} error={errors.message}>
                    <Textarea
                        id={`${id}-message`}
                        name="message"
                        rows={5}
                        dir="auto"
                        maxLength={LEAD_LIMITS.messageMax}
                        placeholder={texts.messagePlaceholder}
                        value={values.message}
                        onChange={update("message")}
                        aria-invalid={errors.message ? true : undefined}
                        className="resize-y"
                    />
                </Field>
            )}

            {/* Honeypot: hidden from people and from browser autofill; bots that fill every field get caught */}
            <div hidden aria-hidden="true">
                <label>
                    Company
                    <input
                        type="text"
                        name="company"
                        tabIndex={-1}
                        autoComplete="off"
                        value={values.company}
                        onChange={update("company")}
                    />
                </label>
            </div>

            <p className="flex items-start gap-2 text-xs leading-relaxed text-subtle">
                <Lock aria-hidden className="mt-0.5 size-3.5 shrink-0" />
                <span>{texts.privacyNote}</span>
            </p>

            {formError && <Alert variant="danger">{formError}</Alert>}

            <div className={stacked ? "flex flex-col gap-2" : "flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"}>
                <Button type="submit" disabled={sending} className={stacked ? "w-full" : "w-full sm:w-auto"}>
                    {sending && <Spinner className="size-4 text-current" />}
                    {sending ? texts.sendingLabel : texts.submitLabel}
                </Button>
                {actions}
            </div>

            {preview && <p className="text-center text-xs text-subtle">Preview: submitting here doesn&apos;t save anything.</p>}
        </form>
    );
}
