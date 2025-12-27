import Skills from "@/components/Skills";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getDocument } from "@/lib/server-utils";

export const revalidate = 3600; // Revalidate every hour

export default async function SkillsPage() {
    const skillsData = await getDocument("site_content", "skills");

    return (
        <main className="min-h-screen bg-slate-950 text-slate-200">
            <Navbar />
            <div className="pt-20">
                <Skills initialData={skillsData} />
            </div>
            <Footer />
        </main>
    );
}
