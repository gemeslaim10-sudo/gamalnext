import { useContent } from '@/hooks/useContent';
import type { ProjectsData, ProjectItem } from '@/types';

// Safety net only: shown when the projects can't be read at all (or none were ever saved)
const defaultProjectsData: ProjectsData = {
    items: [
        {
            title: 'ERP & CRM systems',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
            tags: 'Business analysis, ERP, CRM',
            link: '#',
            description: 'Business systems built around how a company actually works',
            category: 'software'
        },
        {
            title: 'Company websites',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
            tags: 'Websites, WordPress, Hosting',
            link: '#',
            description: 'Fast, search-friendly websites with hosting included',
            category: 'software'
        },
        {
            title: 'Shopify themes',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
            tags: 'Shopify, E-commerce',
            link: '#',
            description: 'Professional store themes for much less than the Shopify Theme Store',
            category: 'design'
        }
    ]
};

/**
 * The projects list. The server's data renders on the first paint and the live subscription keeps it
 * current. Without server data it reports `loading` (show a skeleton) until the subscription answers;
 * the defaults above only appear if that read fails or finds nothing.
 */
export function useProjects(initialData?: ProjectsData) {
    const { data, loading } = useContent<ProjectsData>("site_content", "projects", initialData);
    const projects = data ?? (loading ? null : defaultProjectsData);

    const getItemsByCategory = (catId: string): ProjectItem[] => {
        return projects?.items?.filter((item) => item.category === catId) || [];
    };

    return {
        loading: !projects,
        getItemsByCategory
    };
}
