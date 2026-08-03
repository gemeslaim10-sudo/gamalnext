import { useState, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { EXCLUDED_PREFIXES, ALL_TOOLS, shuffleAndPick, getContextInfo } from './sidebar/sidebarConfig';
import type { SidebarArticle, SidebarProject, SidebarTool } from './sidebar/sidebarConfig';

export function useGlobalSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [articles, setArticles] = useState<SidebarArticle[]>([]);
    const [projects, setProjects] = useState<SidebarProject[]>([]);
    const [mounted, setMounted] = useState(false);

    const [randomArticles, setRandomArticles] = useState<SidebarArticle[]>([]);
    const [randomProjects, setRandomProjects] = useState<SidebarProject[]>([]);
    const [randomTools, setRandomTools] = useState<SidebarTool[]>([]);

    const isLargeScreen = () => typeof window !== 'undefined' && window.innerWidth >= 1024;

    const shouldHide = EXCLUDED_PREFIXES.some(p => pathname.startsWith(p));

    useEffect(() => {
        setMounted(true);
        if (isLargeScreen()) setIsOpen(true);
        setRandomTools(shuffleAndPick(ALL_TOOLS, 3));

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

    useEffect(() => {
        if (articles.length > 0) {
            setRandomArticles(shuffleAndPick(articles, 3));
        }
    }, [articles, pathname]);

    useEffect(() => {
        if (projects.length > 0) {
            setRandomProjects(shuffleAndPick(projects, 3));
        }
    }, [projects, pathname]);

    useEffect(() => {
        setRandomTools(shuffleAndPick(ALL_TOOLS, 3));
    }, [pathname]);

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
