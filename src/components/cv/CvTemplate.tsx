'use client';

import React from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

export interface CVData {
    personalInfo: {
        fullName: string;
        jobTitle: string;
        email: string;
        phone: string;
        location: string;
        website?: string;
        image?: string;
    };
    experience: {
        title: string;
        company: string;
        date: string;
        description: string[];
    }[];
    education: {
        degree: string;
        institution: string;
        date: string;
    }[];
    skills: string[];
    languages: string[];
    integrations?: string[];
}

function CvHeading({ children }: { children: React.ReactNode }) {
    return <h3 className="mb-3 border-b border-ink-border pb-1 text-sm font-semibold text-ink">{children}</h3>;
}

/**
 * The printable CV sheet. Uses only the paper/ink tokens so it prints as a clean white page.
 * The two-column layout follows the sheet's own width (container query), and print always
 * uses the A4 two-column layout.
 */
export const CvTemplate = React.forwardRef<HTMLDivElement, { data: CVData }>(({ data }, ref) => {
    const parsedSkills = React.useMemo(() => {
        if (!data.skills) return { withPercent: [], withoutPercent: [] };
        const withPercent: { name: string; percent: number }[] = [];
        const withoutPercent: string[] = [];

        data.skills.forEach(skill => {
            const match = skill.match(/^(.*?)\s*\((\d+)%\)$/);
            if (match && match[1] && match[2]) {
                withPercent.push({
                    name: match[1].trim(),
                    percent: parseInt(match[2].trim(), 10)
                });
            } else {
                withoutPercent.push(skill.trim());
            }
        });
        return { withPercent, withoutPercent };
    }, [data.skills]);

    const { personalInfo } = data;

    return (
        <div
            ref={ref}
            className="@container mx-auto w-full max-w-[210mm] overflow-hidden bg-paper text-ink sm:min-h-[297mm] print:m-0 print:h-[296mm] print:min-h-0 print:max-h-[296mm] print:w-[210mm] print:max-w-none print:overflow-hidden page-break-after-avoid"
        >
            <header className="flex flex-col-reverse gap-4 border-b border-ink-border p-5 @xl:flex-row @xl:items-start @xl:justify-between @xl:p-6 print:flex-row print:items-start print:justify-between print:p-6">
                <div className="min-w-0">
                    <h1 className="text-2xl font-bold tracking-tight text-ink @xl:text-3xl print:text-3xl">{personalInfo.fullName}</h1>
                    <p className="mt-1 text-base font-medium text-ink-muted @xl:text-lg print:text-lg">{personalInfo.jobTitle}</p>
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-ink-muted">
                        {personalInfo.email && (
                            <div className="flex min-w-0 items-center gap-1.5"><Mail className="size-3.5 shrink-0" /> <span className="break-all">{personalInfo.email}</span></div>
                        )}
                        {personalInfo.phone && (
                            <div className="flex items-center gap-1.5"><Phone className="size-3.5 shrink-0" /> {personalInfo.phone}</div>
                        )}
                        {personalInfo.location && (
                            <div className="flex items-center gap-1.5"><MapPin className="size-3.5 shrink-0" /> {personalInfo.location}</div>
                        )}
                        {personalInfo.website && (
                            <div className="flex min-w-0 items-center gap-1.5">
                                <Globe className="size-3.5 shrink-0" />
                                <a href={`https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="break-all hover:underline">
                                    {personalInfo.website}
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {personalInfo.image && (
                    <div className="size-24 shrink-0 overflow-hidden rounded-card border border-ink-border bg-ink-border @xl:size-28 print:size-28">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={personalInfo.image} alt={personalInfo.fullName} className="h-full w-full object-cover" />
                    </div>
                )}
            </header>

            <div className="grid gap-6 p-5 @xl:grid-cols-12 @xl:p-6 print:grid-cols-12 print:p-6">
                {/* Main column */}
                <div className="space-y-5 @xl:col-span-8 print:col-span-8">
                    {data.experience && data.experience.length > 0 && (
                        <section>
                            <CvHeading>Experience</CvHeading>
                            <div className="space-y-3">
                                {data.experience.map((exp, idx) => (
                                    <div key={idx}>
                                        <div className="flex items-baseline justify-between gap-3">
                                            <h4 className="text-sm font-semibold text-ink">{exp.title}</h4>
                                            {exp.date && (
                                                <span className="shrink-0 text-xs text-ink-muted">{exp.date}</span>
                                            )}
                                        </div>
                                        <p className="text-xs font-medium text-ink-muted">{exp.company}</p>
                                        <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs leading-snug text-ink-muted">
                                            {exp.description.map((desc, dIdx) => (
                                                <li key={dIdx}>{desc}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.integrations && data.integrations.length > 0 && (
                        <section>
                            <CvHeading>Specialized Solutions & Integrations</CvHeading>
                            <ul className="list-disc space-y-1.5 pl-4 text-xs leading-snug text-ink-muted">
                                {data.integrations.map((item, idx) => (
                                    <li key={idx}>
                                        {item.includes(':') ? (
                                            <>
                                                <strong className="font-semibold text-ink">{item.split(':')[0]}:</strong>
                                                {item.split(':').slice(1).join(':')}
                                            </>
                                        ) : (
                                            item
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>

                {/* Side column */}
                <div className="space-y-5 @xl:col-span-4 print:col-span-4">
                    {data.skills && data.skills.length > 0 && (
                        <section>
                            <CvHeading>Skills</CvHeading>
                            {parsedSkills.withPercent.length > 0 && (
                                <div className="space-y-2.5">
                                    {parsedSkills.withPercent.map((skill, idx) => (
                                        <div key={idx}>
                                            <div className="flex justify-between gap-2 text-xs">
                                                <span className="font-medium text-ink">{skill.name}</span>
                                                <span className="text-ink-muted">{skill.percent}%</span>
                                            </div>
                                            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-ink-border">
                                                <div className="h-full rounded-full bg-ink" style={{ width: `${skill.percent}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {parsedSkills.withoutPercent.length > 0 && (
                                <div className={parsedSkills.withPercent.length > 0 ? "mt-4" : undefined}>
                                    {parsedSkills.withPercent.length > 0 && (
                                        <h4 className="mb-2 text-xs font-medium text-ink-muted">Other Tools</h4>
                                    )}
                                    <div className="flex flex-wrap gap-1.5">
                                        {parsedSkills.withoutPercent.map((skill, idx) => (
                                            <span key={idx} className="rounded-full border border-ink-border px-2 py-0.5 text-xs text-ink">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    {data.education && data.education.length > 0 && (
                        <section>
                            <CvHeading>Education</CvHeading>
                            <div className="space-y-2">
                                {data.education.map((edu, idx) => (
                                    <div key={idx}>
                                        <h4 className="text-xs font-semibold leading-tight text-ink">{edu.degree}</h4>
                                        <p className="mt-0.5 text-xs text-ink-muted">{edu.institution}</p>
                                        <p className="mt-0.5 text-xs text-ink-muted">{edu.date}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.languages && data.languages.length > 0 && (
                        <section>
                            <CvHeading>Languages</CvHeading>
                            <ul className="list-disc space-y-1 pl-4 text-xs text-ink-muted">
                                {data.languages.map((lang, idx) => (
                                    <li key={idx}>{lang}</li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>
            </div>

            {/* Print: exactly one A4 page, keep the ink colors */}
            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    @page { size: A4; margin: 0; }
                    body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; margin: 0; padding: 0; }
                    html, body { background: var(--color-paper); height: 100%; overflow: hidden; }
                    .page-break-after-avoid { page-break-after: avoid; break-after: avoid; }
                }
            `}} />
        </div>
    );
});
CvTemplate.displayName = 'CvTemplate';
