import Experience from "@/components/Experience";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getDocument } from "@/lib/server-utils";

export const revalidate = 3600; // Revalidate every hour

export default async function ExperiencePage() {
    const experienceData = await getDocument("site_content", "experience");

    return (
        <main className="min-h-screen bg-slate-950 text-slate-200">
            <Navbar />
            <div className="pt-20">
                <Experience initialData={experienceData} />
            </div>
            <Footer />
        </main>
    );
}
