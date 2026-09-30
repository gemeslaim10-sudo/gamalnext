"use client";

import { Button, type ButtonVariant } from "@/components/ui";
import type { LeadSource } from "@/lib/leads/schema";

interface RequestButtonProps {
    /** Package, service or add-on name, passed to the lead form */
    service: string;
    label: string;
    variant?: ButtonVariant;
    className?: string;
    /** Where the lead came from, shown in the dashboard (default: the pricing page) */
    source?: LeadSource;
}

/** Opens the site-wide lead capture modal, prefilled with what the visitor picked. */
export function RequestButton({ service, label, variant = "secondary", className, source = "pricing" }: RequestButtonProps) {
    const openLeadModal = () => {
        document.dispatchEvent(new CustomEvent("open-lead-modal", { detail: { service, source } }));
    };

    return (
        <Button
            variant={variant}
            onClick={openLeadModal}
            aria-haspopup="dialog"
            aria-label={`${label}: ${service}`}
            className={className}
        >
            {label}
        </Button>
    );
}
