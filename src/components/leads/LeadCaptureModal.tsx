"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { X } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { ALLOWED_ADMINS } from "@/lib/constants";
import { getSocialLinks } from "@/lib/social";
import { LEAD_LIMITS, type LeadSource } from "@/lib/leads/schema";
import { useBrandingContext } from "@/components/providers/BrandingProvider";
import { SocialIcon } from "@/components/icons/SocialIcon";
import { Avatar, Button, ButtonLink, Modal } from "@/components/ui";
import { LeadForm } from "./LeadForm";
import { LeadSuccess } from "./LeadSuccess";
import { LEAD_MODAL_EVENT, hasSubmittedLead, markPopupShown, wasPopupShownThisVisit, type OpenLeadModalDetail } from "./events";
import { LEAD_CAPTURE_DOC, fillName, normalizeLeadCapture, type LeadCaptureSettings } from "./settings";

const SOURCES: readonly LeadSource[] = ["popup", "contact", "pricing", "chat", "other"];

/** When the visitor is busy (typing, another dialog open, tab in the background), look again after this long. */
const RETRY_MS = 4000;

interface OpenRequest {
    /** Changes on every open so the form starts fresh */
    key: number;
    source: LeadSource;
    service: string;
}

interface LeadCaptureModalProps {
    /** Dashboard preview: shows these (unsaved) settings, never opens by itself and never saves */
    preview?: LeadCaptureSettings;
}

/**
 * Welcome popup that asks for a name and phone number, mounted once in the site shell.
 * Opens by itself once per visit (after `delaySeconds`) until the visitor leaves their number,
 * and anytime on the "open-lead-modal" event (see ./events.ts).
 */
export default function LeadCaptureModal({ preview }: LeadCaptureModalProps) {
    const pathname = usePathname();
    const branding = useBrandingContext();
    const [loaded, setLoaded] = useState<LeadCaptureSettings | null>(null);
    const [open, setOpen] = useState(false);
    const [request, setRequest] = useState<OpenRequest>({ key: 0, source: "popup", service: "" });
    const [sentName, setSentName] = useState<string | null>(null);
    const [lastPathname, setLastPathname] = useState(pathname);
    const pageStartedAt = useRef(0);
    const returnFocusTo = useRef<HTMLElement | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const isPreview = Boolean(preview);
    const settings = preview ?? loaded;
    // An open request that arrives before the texts have loaded waits for them
    const isOpen = open && settings !== null;

    // Following a link (or the back button) closes the popup, so it never stands in the way
    if (lastPathname !== pathname) {
        setLastPathname(pathname);
        if (open) setOpen(false);
    }

    const show = useCallback(
        (source: LeadSource, service = "") => {
            returnFocusTo.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
            setRequest((current) => ({ key: current.key + 1, source, service }));
            setSentName(null);
            setOpen(true);
            if (!isPreview) markPopupShown();
        },
        [isPreview]
    );

    const close = useCallback(() => {
        setOpen(false);
        const target = returnFocusTo.current;
        returnFocusTo.current = null;
        if (target?.isConnected) target.focus({ preventScroll: true });
    }, []);

    // Load the texts right away, well before the popup is due, so it never shows placeholder text
    useEffect(() => {
        if (isPreview) return undefined;
        let active = true;
        getDoc(doc(db, LEAD_CAPTURE_DOC.collection, LEAD_CAPTURE_DOC.id))
            .then((snapshot) => {
                if (active) setLoaded(normalizeLeadCapture(snapshot.data()));
            })
            .catch((error: unknown) => {
                console.error("Lead popup settings could not be loaded:", error);
                if (active) setLoaded(normalizeLeadCapture(null)); // code defaults: only when the read fails
            });
        return () => {
            active = false;
        };
    }, [isPreview]);

    // Pricing buttons, the dashboard preview, etc. open it on demand, even after the visitor submitted
    useEffect(() => {
        const onOpen = (event: Event) => {
            const detail = (event as CustomEvent<OpenLeadModalDetail | null | undefined>).detail ?? {};
            const source = SOURCES.find((known) => known === detail.source) ?? "other";
            const service = typeof detail.service === "string" ? detail.service.trim().slice(0, LEAD_LIMITS.serviceMax) : "";
            show(source, service);
        };
        document.addEventListener(LEAD_MODAL_EVENT, onOpen);
        return () => document.removeEventListener(LEAD_MODAL_EVENT, onOpen);
    }, [show]);

    // The delay counts from when each page appears
    useEffect(() => {
        pageStartedAt.current = Date.now();
    }, [pathname]);

    // Automatic popup: once per visit, never on the contact page, never after the visitor submitted
    useEffect(() => {
        if (isPreview || !loaded?.enabled || isContactPage(pathname)) return undefined;
        if (hasSubmittedLead() || wasPopupShownThisVisit()) return undefined;

        let timer = 0;
        const attempt = () => {
            if (hasSubmittedLead() || wasPopupShownThisVisit() || isAdmin()) return;
            if (isVisitorBusy()) {
                timer = window.setTimeout(attempt, RETRY_MS);
                return;
            }
            show("popup");
        };
        const remaining = loaded.delaySeconds * 1000 - (Date.now() - pageStartedAt.current);
        timer = window.setTimeout(attempt, Math.max(0, remaining));
        return () => window.clearTimeout(timer);
    }, [isPreview, loaded, pathname, show]);

    // Move keyboard focus into the dialog without popping up the phone keyboard
    useEffect(() => {
        if (!isOpen) return undefined;
        const frame = requestAnimationFrame(() => contentRef.current?.focus({ preventScroll: true }));
        return () => cancelAnimationFrame(frame);
    }, [isOpen, request.key]);

    if (!settings) return null;

    const whatsapp = getSocialLinks(branding).find((link) => link.kind === "whatsapp");
    const ownerName = branding?.ownerName?.trim() || "";
    const ownerTitle = branding?.ownerTitle?.trim() || "";

    return (
        <Modal open={isOpen} onClose={close} size="sm" ariaLabel={settings.title}>
            <div ref={contentRef} tabIndex={-1} className="relative p-5 outline-none sm:p-6">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={close}
                    aria-label={settings.closeLabel}
                    className="absolute right-2 top-2 sm:right-3 sm:top-3"
                >
                    <X className="size-5" />
                </Button>

                {/* Who's asking: the owner's photo and name make it feel like a person, not a form */}
                <div className="flex items-center gap-3 pr-10">
                    <Avatar src={branding?.siteLogo} alt={ownerName} size={48} />
                    {(ownerName || ownerTitle) && (
                        <div className="min-w-0">
                            {ownerName && <p className="truncate text-sm font-semibold text-foreground">{ownerName}</p>}
                            {ownerTitle && <p className="mt-0.5 text-xs leading-snug text-subtle">{ownerTitle}</p>}
                        </div>
                    )}
                </div>

                {sentName !== null ? (
                    <LeadSuccess
                        className="mt-5"
                        title={fillName(settings.successTitle, sentName)}
                        message={settings.successMessage}
                        actions={
                            <div className="flex flex-col gap-2 sm:flex-row-reverse">
                                <Button onClick={close} className="w-full sm:w-auto">
                                    {settings.closeLabel}
                                </Button>
                                {whatsapp && (
                                    <ButtonLink href={whatsapp.href} external variant="secondary" className="w-full sm:w-auto">
                                        <SocialIcon kind="whatsapp" />
                                        {settings.whatsappLabel}
                                    </ButtonLink>
                                )}
                            </div>
                        }
                    />
                ) : (
                    <>
                        <h2 className="mt-5 text-xl font-semibold tracking-tight text-foreground">{settings.title}</h2>
                        <p className="mt-2 text-sm leading-relaxed text-muted">{settings.subtitle}</p>
                        <LeadForm
                            key={request.key}
                            className="mt-5"
                            layout="stacked"
                            texts={settings}
                            source={request.source}
                            showService
                            serviceSuggestions={settings.serviceSuggestions}
                            defaultService={request.service}
                            preview={isPreview}
                            onSuccess={setSentName}
                            actions={
                                <Button variant="ghost" onClick={close} className="w-full">
                                    {settings.maybeLaterLabel}
                                </Button>
                            }
                        />
                    </>
                )}
            </div>
        </Modal>
    );
}

function isContactPage(pathname: string) {
    return pathname === "/contact" || pathname.startsWith("/contact/");
}

/** The owner browsing his own site shouldn't be asked for his number. */
function isAdmin() {
    const email = auth.currentUser?.email;
    return Boolean(email && ALLOWED_ADMINS.includes(email));
}

/** Typing, another dialog (or the chat) open, or the tab in the background: not a good moment. */
function isVisitorBusy() {
    if (document.hidden || document.querySelector('[role="dialog"], [aria-modal="true"]')) return true;
    const active = document.activeElement;
    return active instanceof HTMLElement && (active.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(active.tagName));
}
