import Projects from "@/components/projects/Projects";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getDocument } from "@/lib/server-utils";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "أعمالي | جمال عبد العاطي - جمال تك",
    description: "استعراض لأبرز المشاريع والتطبيقات (جمال مواقع ويب) التي قمت بتطويرها باستخدام Next.js و React و CMS.",
    keywords: ["جمال عبد العاطي", "جمال تك", "أعمالي", "مشاريع ويب", "جمال مواقع ويب", "جمال cms"],
    alternates: {
        canonical: './',
    },
    openGraph: {
        title: "أعمالي | جمال عبد العاطي - جمال تك",
        description: "استعراض لأبرز المشاريع والتطبيقات التي قمت بتطويرها باستخدام أحدث التقنيات.",
        images: ["/og-image.png"],
        url: 'https://gamaltech.info/projects',
    },
};

export const revalidate = 0; // Revalidate immediately (dynamic)

export default async function ProjectsPage() {
    const projectsData = await getDocument("site_content", "projects");

    return (
        <main className="min-h-screen bg-slate-950 text-slate-200">
            <Navbar />
            <div className="pt-20">
                <Projects initialData={projectsData} />
            </div>
            <Footer />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [{
                            "@type": "ListItem",
                            "position": 1,
                            "name": "الرئيسية",
                            "item": "https://gamaltech.info"
                        }, {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "أعمالي",
                            "item": "https://gamaltech.info/projects"
                        }]
                    })
                }}
            />
        </main>
    );
}
