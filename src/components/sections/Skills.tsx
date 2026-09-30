import { EmptyState, Section } from '@/components/ui';
import { getCopy } from '@/lib/copy/server';
import { MainSkillsGrid } from './skills/MainSkillsGrid';
import { TechStackProgress } from './skills/TechStackProgress';
import { LevelList } from './skills/LevelList';
import type { SkillsData } from './skills/data';

/** Removes the Section's own vertical padding; spacing comes from the wrapper instead. */
const FLUSH = 'py-0 sm:py-0';

/**
 * Body of the skills page. `data` is read on the server (getSkillsData), so the real content is there
 * on the first paint. Lists are edited in /admin/skills; titles are editable texts (/admin/copy → Skills page).
 */
export default async function Skills({ data }: { data: SkillsData }) {
    const t = await getCopy();

    const mainSkills = data.mainSkills || [];
    const techStack = data.techStack || [];
    const software = data.software || [];
    const tools = (data.tools || []).filter((tool) => tool.name?.trim());
    const hasSideLists = software.length > 0 || tools.length > 0;

    if (mainSkills.length === 0 && techStack.length === 0 && !hasSideLists) {
        return <EmptyState title={t('skills.empty')} />;
    }

    return (
        <div id="skills" className="space-y-10 sm:space-y-14">
            {mainSkills.length > 0 && (
                <section aria-labelledby="main-skills-title">
                    <h2 id="main-skills-title" className="sr-only">
                        Services
                    </h2>
                    <MainSkillsGrid skills={mainSkills} learnMore={t("skills.learnMore")} />
                </section>
            )}

            {(techStack.length > 0 || hasSideLists) && (
                <div className="grid gap-10 lg:grid-cols-2 lg:gap-8">
                    {techStack.length > 0 && (
                        <Section title={t('skills.techStackTitle')} className={FLUSH}>
                            <TechStackProgress techStack={techStack} />
                        </Section>
                    )}

                    {hasSideLists && (
                        <div className="space-y-10">
                            {software.length > 0 && (
                                <Section title={t('skills.softwareTitle')} className={FLUSH}>
                                    <LevelList items={software} />
                                </Section>
                            )}
                            {tools.length > 0 && (
                                <Section title={t('skills.toolsTitle')} className={FLUSH}>
                                    <LevelList items={tools} />
                                </Section>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
