import { Section } from '@/components/ui';
import { getCopy } from '@/lib/copy/server';
import { MainSkillsGrid } from './skills/MainSkillsGrid';
import { getSkillsData } from './skills/data';

/**
 * "What I do" on the profile page: the main services from the skills document (/admin/skills),
 * read on the server. The title and text above them are editable texts (/admin/copy → Profile page).
 */
export default async function Services() {
    const [skills, t] = await Promise.all([getSkillsData(), getCopy()]);
    const services = skills.mainSkills || [];
    if (services.length === 0) return null;

    return (
        <Section id="services" title={t('profile.servicesTitle')} description={t('profile.servicesDescription')}>
            <MainSkillsGrid skills={services} />
        </Section>
    );
}
