import { Mail, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { Card, buttonVariants } from "@/components/ui";
import type { PricingContent, PricingLabels } from "@/lib/pricing/types";
import { phoneLinks } from "@/lib/pricing/utils";

interface ContactBlockProps {
    contact: PricingContent["contact"];
    labels: PricingLabels;
}

const ACTION = buttonVariants({ variant: "secondary", className: "min-w-0 flex-1" });

/** One card per phone number (call + optional WhatsApp), plus the email when it's set. */
export function ContactBlock({ contact, labels }: ContactBlockProps) {
    const numbers = contact.numbers
        .map((entry) => ({ entry, links: phoneLinks(entry.number, contact.countryCode) }))
        .filter((row): row is { entry: typeof row.entry; links: NonNullable<typeof row.links> } => row.links !== null);
    const email = contact.email.trim();

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {numbers.map(({ entry, links }) => (
                <Card key={entry.id} className="reveal flex flex-col gap-4">
                    <div className="min-w-0">
                        {entry.label && (
                            <p dir="auto" className="text-xs text-subtle">
                                {entry.label}
                            </p>
                        )}
                        <p dir="ltr" className="mt-1 break-words text-lg font-semibold tracking-tight text-foreground">
                            {entry.number}
                        </p>
                    </div>
                    <div className="mt-auto flex flex-wrap gap-2">
                        <a href={links.tel} className={ACTION}>
                            <Phone aria-hidden />
                            {labels.call}
                        </a>
                        {entry.whatsapp && (
                            <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className={ACTION}>
                                <WhatsAppIcon />
                                {labels.whatsapp}
                            </a>
                        )}
                    </div>
                </Card>
            ))}

            {email && (
                <Card className="reveal flex flex-col gap-4">
                    <div className="min-w-0">
                        {labels.email && <p className="text-xs text-subtle">{labels.email}</p>}
                        <p dir="ltr" className="mt-1 break-all text-lg font-semibold tracking-tight text-foreground">
                            {email}
                        </p>
                    </div>
                    <div className="mt-auto flex flex-wrap gap-2">
                        <a href={`mailto:${email}`} className={ACTION}>
                            <Mail aria-hidden />
                            {labels.sendEmail}
                        </a>
                    </div>
                </Card>
            )}
        </div>
    );
}
