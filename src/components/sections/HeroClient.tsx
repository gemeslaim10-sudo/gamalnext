'use client';

import { useBrandingContext } from '@/components/providers/BrandingProvider';
import { useCopy } from '@/components/providers/CopyProvider';
import { Avatar, Badge, ButtonLink, Section } from '@/components/ui';
import { defaultHeroData, HERO_STATS, type HeroData } from './hero/HeroConfig';

/**
 * The profile intro. `hero` is read on the server (Hero.tsx) and the texts come from the copy the layout
 * loaded, so everything is real on the first paint — no loading state and no placeholder swap.
 */
export default function HeroClient({ hero }: { hero: HeroData }) {
    const branding = useBrandingContext();
    const t = useCopy();

    // The hero document comes first; the dashboard settings fill in whatever it leaves empty
    const name = hero.heroTitle || branding?.ownerName || defaultHeroData.heroTitle;
    const title = hero.heroSubtitle || branding?.ownerTitle || '';
    const bio = hero.heroDescription || branding?.ownerBio || '';
    const photo = hero.avatarImage && hero.avatarImage !== "/gamal.jpg" ? hero.avatarImage : branding?.siteLogo;
    const availability = branding?.availabilityStatus || '';
    const resume = getResumeLink(hero.resumeLink);

    // An empty text in the dashboard hides that button or stat
    const contactLabel = t('profile.contactButton').trim();
    const projectsLabel = t('profile.projectsButton').trim();
    const resumeLabel = resume ? t(resume.isPdf ? 'profile.cvDownload' : 'profile.cvView').trim() : '';
    const stats = HERO_STATS.map(([value, label]) => ({ value: t(value).trim(), label: t(label).trim() })).filter(
        (stat) => stat.value
    );

    return (
        <Section>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
                <Avatar src={photo} alt={branding?.ownerName || name} size={112} priority />

                {/* dir="auto" keeps Arabic text in the right order; text-left keeps the intro lined up with the avatar */}
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <h1 dir="auto" className="break-words text-left text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                            {name}
                        </h1>
                        {availability && <Badge>{availability}</Badge>}
                    </div>
                    {title && (
                        <p dir="auto" className="mt-2 text-left text-base text-foreground sm:text-lg">
                            {title}
                        </p>
                    )}
                    {bio && (
                        <p dir="auto" className="mt-4 max-w-2xl text-left text-sm leading-relaxed text-muted sm:text-base">
                            {bio}
                        </p>
                    )}

                    {(contactLabel || projectsLabel || resumeLabel) && (
                        <div className="mt-6 flex flex-wrap gap-2">
                            {contactLabel && <ButtonLink href="/contact">{contactLabel}</ButtonLink>}
                            {projectsLabel && (
                                <ButtonLink href="/projects" variant="secondary">
                                    {projectsLabel}
                                </ButtonLink>
                            )}
                            {resume && resumeLabel && (
                                <ButtonLink href={resume.href} external={resume.external} variant="ghost">
                                    {resumeLabel}
                                </ButtonLink>
                            )}
                        </div>
                    )}

                    {stats.length > 0 && (
                        <dl className="mt-8 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-5 border-t border-border pt-6 md:grid-cols-4">
                            {stats.map((stat, index) => (
                                <div key={index} className="flex min-w-0 flex-col-reverse gap-1">
                                    <dt dir="auto" className="break-words text-left text-xs text-subtle">
                                        {stat.label}
                                    </dt>
                                    <dd dir="auto" className="break-words text-left text-xl font-semibold tabular-nums text-foreground">
                                        {stat.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    )}
                </div>
            </div>
        </Section>
    );
}

/** Only a real CV link gets a button (the default "#projects" anchor is not one). */
function getResumeLink(link: string | undefined) {
    const href = (link || '').trim();
    if (!href || /^\/?#/.test(href)) return null;
    const isPdf = /\.pdf($|[?#])/i.test(href);
    return { href, isPdf, external: isPdf || /^https?:\/\//i.test(href) };
}
