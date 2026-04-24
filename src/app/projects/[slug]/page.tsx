import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { notFound } from "next/navigation";
import Image from "next/image";
import ImageZoom from "@/components/projects/ImageZoom";
import Link from "next/link";
import { slugify } from "@/lib/utils";
import { ArrowLeft, ExternalLink, ChevronRight, LayoutGrid, Sparkles, MonitorPlay, Layers } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import RelatedProjectsCarousel from "./RelatedProjectsCarousel";

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
        const project = projects.find((p: { title?: string; name?: string; slug?: string; id?: string; [key: string]: unknown }) => {
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
    const allImages = [project.image, ...(project.gallery || [])].filter(Boolean);
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

            {/* HEADER SECTION */}
            <section className="relative z-10 pt-32 pb-16 lg:pt-48 lg:pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
                <Link 
                    href="/projects"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-all mb-12 group bg-slate-900/50 border border-white/5 hover:border-white/10 rounded-full px-5 py-2 text-sm backdrop-blur-md"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Portfolio
                </Link>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black tracking-widest uppercase mb-8 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                    <Sparkles className="w-4 h-4" />
                    {project.category || 'CASE STUDY'}
                </div>
                
                <h1 className="text-5xl sm:text-7xl lg:text-[6rem] font-black tracking-tighter leading-[1.1] mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-400 drop-shadow-sm max-w-5xl">
                    {project.title}
                </h1>

                <p className="text-lg sm:text-xl lg:text-2xl text-slate-400 leading-relaxed max-w-3xl font-light mb-12">
                    {project.description}
                </p>

                {project.link && (
                    <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group relative inline-flex items-center justify-center gap-3 bg-white text-slate-950 px-8 py-4 rounded-full font-black text-sm lg:text-base tracking-wide uppercase overflow-hidden transition-transform hover:scale-105"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative z-10 flex items-center gap-2">
                            Launch Project <ExternalLink className="w-5 h-5" />
                        </span>
                    </a>
                )}
            </section>

            {/* MAIN SHOWCASE IMAGE */}
            {mainImage && (
                <section className="relative z-10 px-6 max-w-[1400px] mx-auto mb-24 lg:mb-40">
                    <ImageZoom
                        src={mainImage}
                        alt={`${project.title} - Main Showcase`}
                        priority={true}
                        containerClassName="relative rounded-[2rem] lg:rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(59,130,246,0.15)] bg-slate-900/50 flex justify-center items-center p-4 md:p-12"
                        className="rounded-2xl shadow-2xl"
                        sizes="(max-width: 1400px) 100vw, 1400px"
                    />
                </section>
            )}

            {/* BENTO BOX METADATA */}
            <section className="relative z-10 px-6 max-w-7xl mx-auto mb-24 lg:mb-40">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {/* Tech Stack Bento */}
                    <div className="md:col-span-2 bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 lg:p-12 hover:bg-slate-900/80 transition-colors shadow-2xl">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                <Layers className="w-6 h-6 text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white tracking-tight">Technologies Used</h3>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {tags.map((tag: string) => (
                                <span key={tag} className="bg-slate-950 text-slate-300 border border-slate-800 px-5 py-2.5 rounded-xl text-sm font-semibold tracking-wide shadow-inner">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Quick Info / Video Bento */}
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 lg:p-12 flex flex-col justify-center items-center text-center hover:bg-slate-900/80 transition-colors shadow-2xl">
                        {project.category === 'video' && project.videoUrl ? (
                            <>
                                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 mb-6">
                                    <MonitorPlay className="w-8 h-8 text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white tracking-tight mb-4">Video Overview</h3>
                                <a href={project.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 font-bold transition-colors">
                                    Watch Full Video <ChevronRight className="w-4 h-4" />
                                </a>
                            </>
                        ) : (
                            <>
                                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-6">
                                    <LayoutGrid className="w-8 h-8 text-emerald-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white tracking-tight mb-2">{project.category?.toUpperCase()}</h3>
                                <p className="text-slate-500 text-sm">Category Focus</p>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* EMBED CODE */}
            {project.embedCode && (
                <section className="relative z-10 px-6 max-w-7xl mx-auto mb-24 lg:mb-40">
                    <div className="w-full rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 bg-slate-950 aspect-video" dangerouslySetInnerHTML={{ __html: project.embedCode }} />
                </section>
            )}

            {/* GALLERY SECTION (Dynamic Bento Grid) */}
            {galleryImages.length > 0 && (
                <section className="relative z-10 px-6 max-w-7xl mx-auto mb-32 lg:mb-48">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">Project Gallery</h2>
                        <p className="text-slate-400 text-lg">A closer look at the details</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                        {galleryImages.map((img: string, index: number) => {
                            // Dynamic bento layout:
                            // Every 3rd image spans full width to break the pattern nicely
                            const isFullWidth = index % 3 === 0;

                            return (
                                <ImageZoom
                                    key={index}
                                    src={img}
                                    alt={`${project.title} - Gallery ${index + 1}`}
                                    containerClassName={`relative rounded-[2rem] overflow-hidden bg-slate-900/50 border border-white/5 shadow-xl flex justify-center items-center p-4 md:p-8 h-full ${
                                        isFullWidth ? 'md:col-span-2' : ''
                                    }`}
                                    className="rounded-xl shadow-lg"
                                    sizes={isFullWidth ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
                                />
                            );
                        })}
                    </div>
                </section>
            )}

            {/* RELATED PROJECTS CAROUSEL */}
            <RelatedProjectsCarousel currentProjectSlug={resolvedParams.slug} allProjects={allProjects} />

            <Footer />
            </div>
        </main>
    );
}
