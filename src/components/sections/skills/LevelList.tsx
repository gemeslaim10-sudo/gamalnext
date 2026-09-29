import { Card } from '@/components/ui';

interface LevelItem {
    name: string;
    level: string;
}

/** A plain "name … level" list, used for software proficiency and daily tools. */
export function LevelList({ items }: { items: LevelItem[] }) {
    return (
        <Card padding="none">
            <ul className="divide-y divide-border">
                {items.map((item, i) => (
                    <li key={`${item.name}-${i}`} className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5">
                        <span dir="auto" className="min-w-0 break-words text-sm text-foreground">
                            {item.name}
                        </span>
                        <span dir="auto" className="shrink-0 text-xs text-subtle">
                            {item.level}
                        </span>
                    </li>
                ))}
            </ul>
        </Card>
    );
}
