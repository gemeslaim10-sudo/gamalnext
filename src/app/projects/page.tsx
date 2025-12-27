import Projects from "@/components/Projects";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getDocument } from "@/lib/server-utils";

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
