import { notFound } from "next/navigation";
import { SEO_PAGE_IDS } from "@/lib/seo/settings";
import { PageSeoEditor } from "../../components/PageSeoEditor";

export const dynamicParams = false;

export function generateStaticParams() {
    return SEO_PAGE_IDS.map((page) => ({ page }));
}

export default async function SeoPageRoute({ params }: { params: Promise<{ page: string }> }) {
    const { page } = await params;
    const id = SEO_PAGE_IDS.find((known) => known === page);
    if (!id) notFound();
    return <PageSeoEditor id={id} />;
}
