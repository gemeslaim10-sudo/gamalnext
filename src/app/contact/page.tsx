import type { Metadata } from "next";
import Contact from "@/components/sections/Contact";
import { Page, PageHeader } from "@/components/ui";
import { LEAD_CAPTURE_DOC, normalizeLeadCapture } from "@/components/leads/settings";
import { getCopy } from "@/lib/copy/server";
import { getDocument } from "@/lib/server-utils";

// Texts are edited in the dashboard (/admin/leads/capture), so always render the latest
export const revalidate = 0;

// Google title/description: /admin/copy → Contact page (shared-link data follows them)
export async function generateMetadata(): Promise<Metadata> {
    const t = await getCopy();
    return {
        title: t("contact.seoTitle") || undefined,
        description: t("contact.seoDescription") || undefined,
        alternates: {
            canonical: './',
        },
    };
}

export default async function ContactPage() {
    // Falls back to the code defaults only if the read fails
    const settings = normalizeLeadCapture(
        await getDocument<Record<string, unknown>>(LEAD_CAPTURE_DOC.collection, LEAD_CAPTURE_DOC.id)
    );

    return (
        <Page>
            <PageHeader title={settings.contactTitle} description={settings.contactDescription} />
            <Contact settings={settings} />
        </Page>
    );
}
