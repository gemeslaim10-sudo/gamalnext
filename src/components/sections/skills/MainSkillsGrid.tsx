import { BarChart, BarChart3, Code, Database, FileText, LineChart, Search, type LucideIcon } from 'lucide-react';
import { Badge, Card } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { SkillItem } from './data';

// Icon names the dashboard can save for a skill card
const ICONS: Record<string, LucideIcon> = { Code, Search, BarChart, BarChart3, Database, LineChart, FileText };

export function MainSkillsGrid({ skills }: { skills: SkillItem[] }) {
    // Two or four cards read best as a 2×n grid; other counts fill three columns on wide screens
    const twoColumns = skills.length === 2 || skills.length === 4;

    return (
        <div className={cn('grid gap-4 sm:grid-cols-2', !twoColumns && 'lg:grid-cols-3')}>
            {skills.map((skill, idx) => {
                const Icon = ICONS[skill.icon] || Code;
                const tags = (skill.tags || '')
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean);

                return (
                    <Card key={`${skill.title}-${idx}`} dir="auto" className="reveal flex flex-col gap-3">
                        <Icon aria-hidden className="size-5 text-muted" />
                        <div>
                            <h3 className="text-base font-semibold text-foreground">{skill.title}</h3>
                            {skill.description && (
                                <p className="mt-1.5 text-sm leading-relaxed text-muted">{skill.description}</p>
                            )}
                        </div>
                        {tags.length > 0 && (
                            <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                                {tags.map((tag, i) => (
                                    <Badge key={`${tag}-${i}`} variant="outline">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </Card>
                );
            })}
        </div>
    );
}
