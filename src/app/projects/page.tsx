import Projects from "@/components/Projects";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getDocument } from "@/lib/server-utils";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "أعمالي | جمال عبد العاطي - جمال تك",
    description: "استعراض لأبرز المشاريع والتطبيقات (جمال مواقع ويب) التي قمت بتطويرها باستخدام Next.js و React و CMS.",
    keywords: ["جمال عبد العاطي", "جمال تك", "أعمالي", "مشاريع ويب", "جمال مواقع ويب", "جمال cms"],
    openGraph: {
        title: "أعمالي | جمال عبد العاطي - جمال تك",
        description: "استعراض لأبرز المشاريع والتطبيقات التي قمت بتطويرها باستخدام أحدث التقنيات.",
        images: ["/og-image.png"],
        url: 'https://gamaltech.info/projects',
    },
};

export const revalidate = 3600; // Revalidate every hour

export default async function ProjectsPage() {
    const projectsData = await getDocument("site_content", "projects");

    return (
        <main className="min-h-screen bg-slate-950 text-slate-200">
            <Navbar />
            <div className="pt-20">
                <Projects initialData={projectsData} />
            </div>
            <Footer />
        </main>
    );
}
