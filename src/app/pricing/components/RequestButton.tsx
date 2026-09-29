"use client";

import { Button, type ButtonVariant } from "@/components/ui";

interface RequestButtonProps {
    /** Package, service or add-on name, passed to the lead form */
    service: string;
    label: string;
    variant?: ButtonVariant;
    className?: string;
}

/** Opens the site-wide lead capture modal, prefilled with what the visitor picked. */
export function RequestButton({ service, label, variant = "secondary", className }: RequestButtonProps) {
    const openLeadModal = () => {
        document.dispatchEvent(new CustomEvent("open-lead-modal", { detail: { service, source: "pricing" } }));
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
