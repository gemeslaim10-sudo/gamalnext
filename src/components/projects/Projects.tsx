'use client';

import { useState } from 'react';
import { FolderOpen } from 'lucide-react';
import { Chip, EmptyState, Skeleton } from '@/components/ui';
import { useCopy } from '@/components/providers/CopyProvider';
import ProjectCard, { ProjectCardSkeleton } from './ProjectCard';
import { PROJECT_CATEGORIES } from './categories';
import { useProjects } from './hooks/useProjects';
import type { ProjectsData } from '@/types';

const ALL = 'all';
const GRID = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3';

export default function Projects({ initialData }: { initialData?: ProjectsData }) {
    const t = useCopy();
    const { loading, getItemsByCategory } = useProjects(initialData);
    const [active, setActive] = useState<string>(ALL);

    if (loading) {
        return (
            <div className="space-y-6" aria-busy="true">
                <div className="flex gap-2 py-1 sm:p-0">
                    {[0, 1, 2].map((i) => (
                        <Skeleton key={i} className="h-8 w-20 rounded-full" />
                    ))}
                </div>
                <div className={GRID}>
                    {[0, 1, 2].map((i) => (
                        <ProjectCardSkeleton key={i} className={i === 2 ? 'sm:max-lg:hidden' : undefined} />
                    ))}
                </div>
            </div>
        );
    }

    // Only the known categories are listed, in the same order as before (designs, videos, software)
    const groups = PROJECT_CATEGORIES.map((cat) => ({ ...cat, items: getItemsByCategory(cat.id) })).filter(
        (group) => group.items.length > 0
    );
    const activeGroup = groups.find((group) => group.id === active);
    const items = activeGroup ? activeGroup.items : groups.flatMap((group) => group.items);

    if (groups.length === 0) {
        return <EmptyState icon={<FolderOpen />} title={t('projects.empty')} />;
    }

    return (
        <div className="space-y-6">
            {/* Scrolls sideways on narrow phones instead of wrapping (py-1 keeps focus rings visible) */}
            <div
                role="group"
                aria-label="Filter projects by category"
                className="-mx-4 flex gap-2 overflow-x-auto px-4 py-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:p-0"
            >
                <Chip active={!activeGroup} onClick={() => setActive(ALL)}>
                    {t('projects.filterAll')}
                </Chip>
                {groups.map((group) => (
                    <Chip key={group.id} active={activeGroup?.id === group.id} onClick={() => setActive(group.id)}>
                        {t(group.label)}
                    </Chip>
                ))}
            </div>

            {/* Keyed by the filter so switching categories fades the new set in */}
            <div key={active} className={`${GRID} animate-fade-in`}>
                {items.map((project, index) => (
                    <ProjectCard
                        key={`${project.title}-${index}`}
                        project={{ ...project, image: project.image || project.images?.[0] }}
                    />
                ))}
            </div>
        </div>
    );
}
