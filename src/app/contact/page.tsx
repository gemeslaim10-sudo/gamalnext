import type { Metadata } from "next";
import Contact from "@/components/sections/Contact";
import { Page, PageHeader } from "@/components/ui";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCopy } from "@/lib/copy/server";
import { getLeadCaptureSettings } from "@/lib/content/server";
import { pageMetadata } from "@/lib/seo/server";
import { ORGANIZATION_ID, breadcrumbs, pageGraph, webPage } from "@/lib/seo/structured-data";

// Title, description and keywords: /admin/seo → Pages → Contact
export async function generateMetadata(): Promise<Metadata> {
    return pageMetadata("contact");
}

export default async function ContactPage() {
    // Texts from /admin/leads/capture (cached; code defaults only if the read fails)
    const [settings, t] = await Promise.all([getLeadCaptureSettings(), getCopy()]);

    return (
        <Page>
            {/* The company's phone, email and address are in the site-wide data this page points to */}
            <JsonLd
                data={pageGraph(
                    webPage("ContactPage", "/contact", settings.contactTitle, settings.contactDescription, {
                        mainEntity: { "@id": ORGANIZATION_ID },
                    }),
                    breadcrumbs([
                        { name: t("nav.home"), path: "/" },
                        { name: t("nav.contact"), path: "/contact" },
                    ])
                )}
            />
            <PageHeader title={settings.contactTitle} description={settings.contactDescription} />
            <Contact settings={settings} />
        </Page>
    );
}
