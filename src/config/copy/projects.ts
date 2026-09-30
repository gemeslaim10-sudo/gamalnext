import type { CopySection } from "@/lib/copy/types";

export const projectsCopy = {
    id: "projects",
    title: "Projects (list, project page, featured)",
    fields: [
        // Projects page (/projects)
        { key: "title", label: "Projects page: title", default: "Projects" },
        {
            key: "description",
            label: "Projects page: text under the title",
            type: "textarea",
            default: "A selection of prominent projects executed with the highest standards of quality and professionalism in various technical and creative fields.",
        },
        { key: "filterAll", label: "Projects page: filter showing all projects", default: "All" },
        { key: "filterDesign", label: "Projects page: filter for design projects", default: "Designs" },
        { key: "filterVideo", label: "Projects page: filter for video projects", default: "Videos" },
        { key: "filterSoftware", label: "Projects page: filter for software projects", default: "Software" },
        { key: "empty", label: "Projects page: message when there are no projects", default: "No projects yet" },

        // Category name on a single project (project cards and the project page)
        { key: "categoryDesign", label: "Category name of a design project (cards and project page)", default: "Design" },
        { key: "categoryVideo", label: "Category name of a video project (cards and project page)", default: "Video" },
        { key: "categorySoftware", label: "Category name of a software project (cards and project page)", default: "Software" },

        // Featured projects (profile page) and related projects (project page)
        { key: "featuredTitle", label: "Profile page: featured projects heading", default: "Featured projects" },
        { key: "viewAll", label: "View all button next to featured and related projects", default: "View all" },

        // Project page (/projects/…)
        { key: "notFoundTitle", label: "Google title when a project doesn't exist", default: "Project not found" },
        { key: "backToProjects", label: "Project page: back link", default: "Back to projects" },
        { key: "visitSite", label: "Project page: Visit site button", default: "Visit site" },
        { key: "aboutTitle", label: "Project page: heading above the description", default: "About this project" },
        { key: "detailsTitle", label: "Project page: title of the details box", default: "Project details" },
        { key: "detailCategory", label: "Project page: details box, category row", default: "Category" },
        { key: "detailWebsite", label: "Project page: details box, website row", default: "Website" },
        { key: "detailVideo", label: "Project page: details box, video row", default: "Video" },
        { key: "watchVideo", label: "Project page: details box, video link", default: "Watch video" },
        { key: "relatedTitle", label: "Project page: related projects heading", default: "Related projects" },
    ],
} as const satisfies CopySection;
