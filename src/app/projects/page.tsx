import Projects from "@/components/projects/Projects";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getDocument } from "@/lib/server-utils";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Portfolio | Gamal Abdelaty - Gamal Tech",
    description: "A review of the most prominent projects and applications I have developed using Next.js, React, and CMS.",
    keywords: ["Gamal Abdelaty", "Gamal Tech", "Portfolio", "Web Projects", "Websites", "CMS"],
    alternates: {
        canonical: './',
    },
    openGraph: {
        title: "Portfolio | Gamal Abdelaty - Gamal Tech",
        description: "A review of the most prominent projects and applications I have developed using the latest technologies.",
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
                            "name": "Home",
                            "item": "https://gamaltech.info"
                        }, {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Portfolio",
                            "item": "https://gamaltech.info/projects"
                        }]
                    })
                }}
            />
        </main>
    );
}
