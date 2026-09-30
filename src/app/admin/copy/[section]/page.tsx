"use client";

import { use } from "react";
import { FileQuestion } from "lucide-react";
import { AdminPage } from "@/components/admin/kit";
import { ButtonLink, EmptyState } from "@/components/ui";
import { findCopySection } from "../copyAdmin";
import { CopySectionEditor } from "./CopySectionEditor";

interface CopySectionPageProps {
    params: Promise<{ section: string }>;
    /** `?field=<key>` opens the editor at that text (links from the search on /admin/copy) */
    searchParams: Promise<{ field?: string | string[] }>;
}

export default function CopySectionPage({ params, searchParams }: CopySectionPageProps) {
    const { section: sectionId } = use(params);
    const { field } = use(searchParams);
    const section = findCopySection(sectionId);

    if (!section) {
        return (
            <AdminPage title="القسم مش موجود" breadcrumbs={[{ label: "نصوص الموقع", href: "/admin/copy" }]}>
                <EmptyState
                    icon={<FileQuestion />}
                    title="مفيش قسم نصوص بالاسم ده"
                    description="يمكن الرابط اتغيّر. ارجع لنصوص الموقع واختار القسم من هناك."
                    action={
                        <ButtonLink href="/admin/copy" variant="secondary">
                            نصوص الموقع
                        </ButtonLink>
                    }
                />
            </AdminPage>
        );
    }

    return <CopySectionEditor key={section.id} section={section} focusKey={typeof field === "string" ? field : undefined} />;
}
