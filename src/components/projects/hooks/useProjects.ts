import { useState, useEffect } from 'react';
import { useContent } from '@/hooks/useContent';

const defaultProjectsData = {
    items: [
        {
            title: 'Brand Identity Design',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
            tags: 'Branding, UI/UX',
            link: '#',
            description: 'Complete identity design for a startup',
            category: 'design'
        },
        {
            title: 'Smart Store App',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
            tags: 'Next.js, Tailwind',
            link: '#',
            description: 'Advanced store management software',
            category: 'software'
        },
        {
            title: 'Motion Graphics Promo',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
            tags: 'Motion Graphics, AE',
            link: '#',
            description: 'Professional ad for digital products',
            category: 'video'
        }
    ]
};

export function useProjects(initialData?: any) {
    const { data } = useContent("site_content", "projects", defaultProjectsData);
    const projects = initialData || data || defaultProjectsData;
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const getItemsByCategory = (catId: string) => {
        return projects.items?.filter((item: any) => item.category === catId) || [];
    };

    return {
        mounted,
        getItemsByCategory
    };
}
