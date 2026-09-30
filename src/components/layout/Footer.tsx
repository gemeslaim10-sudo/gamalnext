"use client";

import { useBrandingContext } from "@/components/providers/BrandingProvider";
import { SocialIcon } from "@/components/icons/SocialIcon";
import { Container, buttonVariants } from "@/components/ui";
import { getSocialLinks } from "@/lib/social";
import { useCopy } from "@/components/providers/CopyProvider";

export default function Footer() {
    const branding = useBrandingContext();
    const t = useCopy();
    const siteName = branding?.siteName || "GTech";
    const links = getSocialLinks(branding);
    const phoneDigits = String(branding?.whatsappNumber || "").replace(/\D/g, "");
    const phone = phoneDigits ? String(branding?.phoneDisplay || `+${phoneDigits}`) : "";
    const location = String(branding?.ownerLocation || "").trim();

    return (
        <footer className="mt-auto border-t border-border">
            <Container className="flex flex-col items-center gap-4 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
                <div className="space-y-1">
                    <p className="text-sm text-subtle">{t("footer.copyright", { year: new Date().getFullYear(), siteName })}</p>
                    {/* The phone number as text on every page: visitors can tap it, and search engines and
                        AI assistants (which read the page text) can find it */}
                    {(phone || location) && (
                        <p className="text-xs text-subtle">
                            {phone && (
                                <a href={`tel:+${phoneDigits}`} className="transition-colors hover:text-foreground">
                                    {phone}
                                </a>
                            )}
                            {phone && location && <span aria-hidden> · </span>}
                            {location}
                        </p>
                    )}
                </div>
                {links.length > 0 && (
                    <div className="flex items-center gap-1">
                        {links.map((link) => (
                            <a
                                key={link.kind}
                                href={link.href}
                                target={link.kind === "email" ? undefined : "_blank"}
                                rel="noopener noreferrer"
                                aria-label={link.label}
                                title={link.label}
                                className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
                            >
                                <SocialIcon kind={link.kind} className="size-4" />
                            </a>
                        ))}
                    </div>
                )}
            </Container>
        </footer>
    );
}
