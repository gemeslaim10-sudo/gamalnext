"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { AdminHub, AdminPage, useAdminDocPeek, type HubGroup } from "@/components/admin/kit";
import { Card, EmptyState } from "@/components/ui";
import { COPY_SECTIONS } from "@/config/copy";
import { SearchBox } from "./components/SearchBox";
import { COPY_DOC, copyFieldMatches, copyKey, copySectionHref, normalizeCopy, normalizeQuery, sectionInfo, textCount } from "./copyAdmin";

const MAX_RESULTS = 50;

// One card per section; the numbers come from the definitions in code, not the database
const GROUPS: HubGroup[] = [
    {
        items: COPY_SECTIONS.map((section) => {
            const info = sectionInfo(section);
            return {
                href: copySectionHref(section),
                title: info.title,
                description: info.description,
                icon: info.icon,
                meta: textCount(section.fields.length),
            };
        }),
    },
];

/** Start screen of the site texts: the sections, and a search across every text that links straight to it. */
export default function CopyHubPage() {
    const [query, setQuery] = useState("");
    // Current texts only if an editor already loaded them this visit; the hub itself reads nothing
    // The current texts, only if a section editor already loaded them this visit (the hub reads nothing)
    const loaded = useAdminDocPeek(COPY_DOC);
    const current = useMemo(() => (loaded ? normalizeCopy(loaded) : null), [loaded]);
    const q = normalizeQuery(query);

    const results = useMemo(
        () =>
            q
                ? COPY_SECTIONS.flatMap((section) =>
                      section.fields
                          .filter((field) => copyFieldMatches(section, field, q, current?.[copyKey(section, field)]))
                          .map((field) => ({ section, field }))
                  )
                : [],
        [q, current]
    );

    return (
        <AdminPage title="نصوص الموقع" description="كل الكلام الثابت اللي بيظهر للزوار، مقسّم حسب الصفحة. افتح صفحة، أو دوّر على أي نص.">
            <div className="mb-6">
                <SearchBox value={query} onChange={setQuery} placeholder="دوّر في كل النصوص…" label="دوّر في كل نصوص الموقع" />
            </div>

            {!q ? (
                <AdminHub groups={GROUPS} />
            ) : results.length === 0 ? (
                <EmptyState icon={<SearchX />} title="مفيش نص مطابق" description="جرّب كلمة تانية، أو اكتبها بالإنجليزي زي ما هي مكتوبة في الموقع." />
            ) : (
                <Card padding="none">
                    <p className="border-b border-border px-4 py-3 text-xs text-subtle" role="status">
                        {results.length > MAX_RESULTS
                            ? `أول ${MAX_RESULTS} من ${results.length} نتيجة. كمّل كتابة عشان تضيّق البحث.`
                            : `${results.length} نتيجة`}
                    </p>
                    <ul className="divide-y divide-border">
                        {results.slice(0, MAX_RESULTS).map(({ section, field }) => {
                            const key = copyKey(section, field);
                            const value = current?.[key] ?? field.default;
                            return (
                                <li key={key}>
                                    <Link href={copySectionHref(section, field)} className="block px-4 py-3 transition-colors hover:bg-surface-hover">
                                        <span className="block text-xs text-subtle">{sectionInfo(section).title}</span>
                                        <span className="mt-0.5 block text-sm text-foreground">
                                            <bdi dir="ltr">{field.label}</bdi>
                                        </span>
                                        {value && (
                                            <span dir="auto" className="mt-0.5 block truncate text-xs text-muted">
                                                {value}
                                            </span>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </Card>
            )}
        </AdminPage>
    );
}
