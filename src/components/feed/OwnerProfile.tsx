"use client";

import { useState, type ReactNode } from "react";
import { Briefcase, Check, Copy, Mail, MapPin } from "lucide-react";
import { useBrandingContext } from "@/components/providers/BrandingProvider";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { SocialIcon } from "@/components/icons/SocialIcon";
import { Avatar, Badge, Card, buttonVariants } from "@/components/ui";
import { getSocialLinks } from "@/lib/social";

/**
 * The owner's card on the home page. Everything comes from the dashboard settings.
 * Phones get the compact version (photo, name, title, contact buttons); wide screens get the full card.
 */
export default function OwnerProfile() {
    const branding = useBrandingContext();

    const name = branding?.ownerName || "";
    const title = branding?.ownerTitle || "";
    const bio = branding?.ownerBio || "";
    const role = branding?.ownerRole || "";
    const location = branding?.ownerLocation || "";
    const availability = branding?.availabilityStatus || "";
    const avatar = branding?.siteLogo || "";
    const badges = (branding?.ownerBadges || "")
        .split(",")
        .map((b) => b.trim())
        .filter(Boolean);

    const links = getSocialLinks(branding);
    const whatsapp = links.find((l) => l.kind === "whatsapp");
    const email = links.find((l) => l.kind === "email");
    const profiles = links.filter((l) => l.kind === "github" || l.kind === "linkedin");

    return (
        <Card padding="lg" className="flex flex-col gap-5">
            <div className="flex items-center gap-4 lg:flex-col lg:items-start">
                <Avatar src={avatar} alt={name} size={64} priority />
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-lg font-semibold text-foreground">{name}</h1>
                        {availability && <Badge>{availability}</Badge>}
                    </div>
                    {title && <p className="mt-1 text-sm leading-relaxed text-muted">{title}</p>}
                </div>
            </div>

            {/* Phones: one row of contact buttons instead of the full details */}
            {links.length > 0 && (
                <div className="flex flex-wrap gap-2 lg:hidden">
                    {links.map((link) => (
                        <a
                            key={link.kind}
                            href={link.href}
                            target={link.kind === "email" ? undefined : "_blank"}
                            rel="noopener noreferrer"
                            aria-label={link.label}
                            className={buttonVariants({ variant: "secondary", size: "icon" })}
                        >
                            <SocialIcon kind={link.kind} className="size-4" />
                        </a>
                    ))}
                </div>
            )}

            <div className="hidden flex-col gap-5 lg:flex">
                {bio && <p className="text-sm leading-relaxed text-muted">{bio}</p>}

                {badges.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {badges.map((badge, i) => (
                            <Badge key={`${badge}-${i}`} variant="outline">
                                {badge}
                            </Badge>
                        ))}
                    </div>
                )}

                {(role || location || whatsapp || email) && (
                    <ul className="flex flex-col gap-3 border-t border-border pt-5 text-sm">
                        {role && <InfoRow icon={<Briefcase />}>{role}</InfoRow>}
                        {location && <InfoRow icon={<MapPin />}>{location}</InfoRow>}
                        {whatsapp && (
                            <InfoRow icon={<WhatsAppIcon />} copyValue={whatsapp.display}>
                                <a href={whatsapp.href} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                                    {whatsapp.display}
                                </a>
                            </InfoRow>
                        )}
                        {email && (
                            <InfoRow icon={<Mail />} copyValue={email.display}>
                                <a href={email.href} className="hover:text-foreground">
                                    {email.display}
                                </a>
                            </InfoRow>
                        )}
                    </ul>
                )}

                {profiles.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                        {profiles.map((link) => (
                            <a
                                key={link.kind}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={buttonVariants({ variant: "secondary", size: "sm" })}
                            >
                                <SocialIcon kind={link.kind} className="size-4" />
                                {link.label}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
}

function InfoRow({ icon, copyValue, children }: { icon: ReactNode; copyValue?: string; children: ReactNode }) {
    const [copied, setCopied] = useState(false);

    const copy = () => {
        if (!copyValue) return;
        navigator.clipboard.writeText(copyValue);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <li className="flex items-center gap-3 text-muted">
            <span className="flex text-subtle [&_svg]:size-4">{icon}</span>
            <span className="min-w-0 flex-1 truncate">{children}</span>
            {copyValue && (
                <button
                    type="button"
                    onClick={copy}
                    aria-label={copied ? "Copied" : "Copy"}
                    title={copied ? "Copied" : "Copy"}
                    className="flex size-7 shrink-0 items-center justify-center rounded-control text-subtle transition-colors hover:bg-surface-hover hover:text-foreground"
                >
                    {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                </button>
            )}
        </li>
    );
}
