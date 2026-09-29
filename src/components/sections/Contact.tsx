'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { useBrandingContext } from '@/components/providers/BrandingProvider';
import { useCopy } from '@/components/providers/CopyProvider';
import { SocialIcon } from '@/components/icons/SocialIcon';
import { LeadForm } from '@/components/leads/LeadForm';
import { LeadSuccess } from '@/components/leads/LeadSuccess';
import { fillName, type LeadCaptureSettings } from '@/components/leads/settings';
import { ButtonLink, Card } from '@/components/ui';
import type { CopyKey } from '@/config/copy';
import { getSocialLinks, type SocialKind } from '@/lib/social';
import { cn } from '@/lib/utils';

/** Labels above each value in the contact details column (/admin/copy → Contact page). */
const DETAIL_LABELS: Record<SocialKind, CopyKey> = {
    whatsapp: 'contact.whatsappLabel',
    email: 'contact.emailLabel',
    github: 'contact.githubLabel',
    linkedin: 'contact.linkedinLabel',
};

/**
 * Contact form + contact details. Form texts and headings come from `settings` (site_content/lead_capture,
 * /admin/leads/capture); the detail labels are editable texts; the values come from the owner settings.
 */
export default function Contact({ settings }: { settings: LeadCaptureSettings }) {
    const t = useCopy();
    const branding = useBrandingContext();
    const links = getSocialLinks(branding);
    const whatsapp = links.find((link) => link.kind === 'whatsapp');
    const location = branding?.ownerLocation || '';
    const hasDetails = links.length > 0 || Boolean(location);
    const [sentName, setSentName] = useState<string | null>(null);

    const whatsappButton = whatsapp && (
        <ButtonLink href={whatsapp.href} external variant="secondary" className="w-full sm:w-auto">
            <SocialIcon kind="whatsapp" />
            {settings.whatsappLabel}
        </ButtonLink>
    );

    return (
        <div className={cn('grid items-start gap-6', hasDetails ? 'lg:grid-cols-3' : 'max-w-content')}>
            <Card padding="lg" className={cn(hasDetails && 'lg:col-span-2')}>
                {sentName !== null ? (
                    <LeadSuccess
                        compact
                        title={fillName(settings.successTitle, sentName)}
                        message={settings.successMessage}
                        actions={whatsappButton && <div className="flex flex-wrap gap-2">{whatsappButton}</div>}
                    />
                ) : (
                    <>
                        <h2 className="text-base font-semibold text-foreground">{settings.contactFormTitle}</h2>
                        <p className="mt-1 text-sm text-muted">{settings.contactFormDescription}</p>
                        <LeadForm
                            className="mt-5"
                            source="contact"
                            showMessage
                            texts={{
                                ...settings,
                                messageLabel: settings.contactMessageLabel,
                                messagePlaceholder: settings.contactMessagePlaceholder,
                                submitLabel: settings.contactSubmitLabel,
                            }}
                            onSuccess={setSentName}
                            actions={whatsappButton}
                        />
                    </>
                )}
            </Card>

            {hasDetails && (
                <Card padding="none" className="overflow-hidden">
                    {/* Same top padding as the form card so both headings line up on wide screens */}
                    <h2 className="border-b border-border px-5 pb-4 pt-5 text-base font-semibold text-foreground sm:px-6 sm:pt-6">
                        {settings.contactDetailsTitle}
                    </h2>
                    <ul className="divide-y divide-border">
                        {links.map((link) => (
                            <li key={link.kind}>
                                <a
                                    href={link.href}
                                    target={link.kind === 'email' ? undefined : '_blank'}
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-surface-hover sm:px-6"
                                >
                                    <SocialIcon kind={link.kind} className="size-4 shrink-0 text-muted" />
                                    <DetailText label={t(DETAIL_LABELS[link.kind])} value={link.display} />
                                </a>
                            </li>
                        ))}
                        {location && (
                            <li className="flex items-center gap-3 px-5 py-3 sm:px-6">
                                <MapPin aria-hidden className="size-4 shrink-0 text-muted" />
                                <DetailText label={t('contact.locationLabel')} value={location} />
                            </li>
                        )}
                    </ul>
                </Card>
            )}
        </div>
    );
}

function DetailText({ label, value }: { label: string; value: string }) {
    return (
        <span className="min-w-0 flex-1">
            <span className="block text-xs text-subtle">{label}</span>
            {/* dir="auto" keeps Arabic values readable; text-left keeps them lined up with the label */}
            <span dir="auto" className="block truncate text-left text-sm text-foreground">
                {value}
            </span>
        </span>
    );
}
