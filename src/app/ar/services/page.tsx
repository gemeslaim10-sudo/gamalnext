import type { Metadata } from "next";
import { ServicesIndexPage, servicesIndexMetadata } from "@/components/services/servicePages";

// The Arabic services list (/ar/services); texts: /admin/services
export async function generateMetadata(): Promise<Metadata> {
    return servicesIndexMetadata("ar");
}

export default function ArabicServicesPage() {
    return <ServicesIndexPage lang="ar" />;
}
