import { Card } from '@/components/ui';
import type { TechStackItem } from './data';

export function TechStackProgress({ techStack }: { techStack: TechStackItem[] }) {
    return (
        <Card padding="lg">
            <ul className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-1">
                {techStack.map((item, i) => {
                    const value = toPercent(item.val);
                    return (
                        <li key={`${item.name}-${i}`}>
                            <div className="flex items-baseline justify-between gap-4">
                                <span dir="auto" className="min-w-0 truncate text-sm text-foreground">
                                    {item.name}
                                </span>
                                <span className="shrink-0 text-xs tabular-nums text-subtle">{value}%</span>
                            </div>
                            <div aria-hidden className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-hover">
                                <div className="reveal-bar h-full rounded-full bg-foreground" style={{ width: `${value}%` }} />
                            </div>
                        </li>
                    );
                })}
            </ul>
        </Card>
    );
}

/** "95%", "95" or 95 → 95, clamped to 0–100. */
function toPercent(val: string | number | undefined) {
    const n = parseFloat(String(val ?? ''));
    return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0;
}
