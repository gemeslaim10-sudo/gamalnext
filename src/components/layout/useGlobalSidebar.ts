import { useState, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { EXCLUDED_PREFIXES, ALL_TOOLS, shuffleAndPick, getContextInfo } from './sidebar/sidebarConfig';
import type { SidebarArticle, SidebarProject } from './sidebar/sidebarConfig';

export function useGlobalSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [articles, setArticles] = useState<SidebarArticle[]>([]);
    const [projects, setProjects] = useState<SidebarProject[]>([]);
    const [mounted, setMounted] = useState(false);

    const isLargeScreen = () => typeof window !== 'undefined' && window.innerWidth >= 1024;

    const shouldHide = EXCLUDED_PREFIXES.some(p => pathname.startsWith(p));

    useEffect(() => {

        setMounted(true);
        if (isLargeScreen()) setIsOpen(true);

        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsOpen(true);
            } else {
                setIsOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/sidebar-data');
                if (!res.ok) return;
                const data = await res.json();
                setArticles(data.articles || []);
                setProjects(data.projects || []);
            } catch {
                // Silent fail
            }
        };
        fetchData();
    }, []);

    const randomArticles = useMemo(
        () => shuffleAndPick(articles, 3),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [articles, pathname]
    );
    const randomProjects = useMemo(
        () => shuffleAndPick(projects, 3),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [projects, pathname]
    );
    const randomTools = useMemo(
        () => shuffleAndPick(ALL_TOOLS, 3),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [pathname]
    );

    const contextInfo = useMemo(() => getContextInfo(pathname), [pathname]);

    useEffect(() => {
        if (!isLargeScreen()) {

            setIsOpen(false);
        }
    }, [pathname]);

    return {
        isOpen,
        setIsOpen,
        mounted,
        shouldHide,
        isLargeScreen,
        randomArticles,
        randomProjects,
        randomTools,
        contextInfo
    };
}
