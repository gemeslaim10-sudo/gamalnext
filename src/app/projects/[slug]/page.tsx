import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { notFound } from "next/navigation";
import ImageZoom from "@/components/projects/ImageZoom";
import { slugify } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import RelatedProjectsCarousel from "./RelatedProjectsCarousel";
import ProjectHeader from "./components/ProjectHeader";
import ProjectBentoMeta from "./components/ProjectBentoMeta";
import ProjectGallery from "./components/ProjectGallery";
import type { ProjectData } from "./types";

export const revalidate = 3600; // Cache for 1 hour

async function getProjectData(slug: string) {
    try {
        const snap = await getDoc(doc(db, "site_content", "projects"));
        if (!snap.exists()) return { project: null, allProjects: [] };
        const data = snap.data();
        const projects = data.items || [];
        
        const searchSlug = decodeURIComponent(slug);
        
        // Handle sidebar generated IDs (e.g. proj-1)
        const idxMatch = searchSlug.match(/^proj-(\d+)$/);
        if (idxMatch) {
            const idx = parseInt(idxMatch[1], 10);
            if (projects[idx]) return { project: projects[idx], allProjects: projects };
        }
        
        // Find matching project by slug, id, or slugified title
        const project = projects.find((p: ProjectData) => {
            const titleSlug = p.title || p.name ? decodeURIComponent(slugify(p.title || p.name || '')) : '';
            const pSlug = p.slug ? decodeURIComponent(p.slug) : titleSlug;
            return pSlug === searchSlug || titleSlug === searchSlug || p.id === searchSlug;
        }) || null;

        return { project, allProjects: projects };
    } catch (e) {
        console.error("Error fetching project:", e);
        return { project: null, allProjects: [] };
    }
}

export default async function ProjectDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const { project, allProjects } = await getProjectData(resolvedParams.slug);

    if (!project) {
        notFound();
    }

    const tags = project.tags ? project.tags.split(',').map((t: string) => t.trim()) : [];
    
    // Combine main image with gallery for the full masonry view
    const allImages = [project.image, ...(project.gallery || [])].filter(Boolean) as string[];
    const mainImage = allImages[0];
    const galleryImages = allImages.slice(1);

    return (
        <main className="h-screen w-full flex flex-col bg-[#030712] text-slate-200 selection:bg-blue-500/30 font-sans overflow-hidden">
            <Navbar isStatic={true} />
            
            <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col w-full">
                {/* Ambient Background Glow */}
                <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
                    <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-purple-600/10 blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-cyan-600/10 blur-[120px]" />
                    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5" />
                </div>

                <ProjectHeader project={project} />

                {/* MAIN SHOWCASE IMAGE */}
                {mainImage && (
                    <section className="relative z-10 px-6 max-w-[1400px] mx-auto mb-24 lg:mb-40">
                        <ImageZoom
                            src={mainImage}
                            alt={`${project.title || project.name} - Main Showcase`}
                            priority={true}
                            containerClassName="relative rounded-[2rem] lg:rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(59,130,246,0.15)] bg-slate-900/50 flex justify-center items-center p-4 md:p-12"
                            className="rounded-2xl shadow-2xl"
                            sizes="(max-width: 1400px) 100vw, 1400px"
                        />
                    </section>
                )}

                <ProjectBentoMeta project={project} tags={tags} />

                {/* EMBED CODE */}
                {project.embedCode && (
                    <section className="relative z-10 px-6 max-w-7xl mx-auto mb-24 lg:mb-40">
                        <div className="w-full rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 bg-slate-950 aspect-video" dangerouslySetInnerHTML={{ __html: project.embedCode }} />
                    </section>
                )}

                <ProjectGallery project={project} galleryImages={galleryImages} />

                {/* RELATED PROJECTS CAROUSEL */}
                <RelatedProjectsCarousel currentProjectSlug={resolvedParams.slug} allProjects={allProjects} />

                <Footer />
            </div>
        </main>
    );
}
