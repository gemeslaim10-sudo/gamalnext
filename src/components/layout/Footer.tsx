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

    return (
        <footer className="mt-auto border-t border-border">
            <Container className="flex flex-col items-center gap-4 py-8 sm:flex-row sm:justify-between">
                <p className="text-sm text-subtle">{t("footer.copyright", { year: new Date().getFullYear(), siteName })}</p>
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
