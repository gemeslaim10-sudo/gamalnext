import ImageZoom from "@/components/projects/ImageZoom";
import type { ProjectData } from "../types";

interface ProjectGalleryProps {
    project: ProjectData;
    galleryImages: string[];
}

export default function ProjectGallery({ project, galleryImages }: ProjectGalleryProps) {
    if (!galleryImages || galleryImages.length === 0) return null;

    return (
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
                            alt={`${project.title || project.name} - Gallery ${index + 1}`}
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
    );
}
