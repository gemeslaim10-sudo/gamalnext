"use client";

import { Plus } from "lucide-react";
import { Button, Card, EmptyState, Input } from "@/components/ui";
import { RowMenu } from "../components/RowMenu";
import { focusSoon, rowKey } from "../rowKeys";
import { percentNumber, techError } from "../skillsDoc";
import { SkillsListEditor } from "../SkillsListEditor";

/** Technologies with a level bar each (saved like the site reads them: "90%"). */
export default function TechStackEditorPage() {
    return (
        <SkillsListEditor
            list="techStack"
            title="التقنيات"
            description="التقنيات اللي بتشتغل بيها ونسبة إتقانك لكل واحدة، وبتظهر كشريط في صفحة المهارات."
            validate={techError}
        >
            {({ items, change, add, remove, move, error }) => {
                const addRow = () => {
                    const item = { name: "", val: "" };
                    add(item);
                    focusSoon(`tech-${rowKey(item)}-name`);
                };
                const addButton = (
                    <Button variant="secondary" onClick={addRow}>
                        <Plus /> إضافة تقنية
                    </Button>
                );

                if (items.length === 0) {
                    return (
                        <EmptyState
                            title="لسه مفيش تقنيات"
                            description="القسم ده مش هيظهر في صفحة المهارات لحد ما تضيف حاجة."
                            action={addButton}
                        />
                    );
                }

                return (
                    <Card padding="none">
                        <ul className="divide-y divide-border">
                            {items.map((item, index) => {
                                const id = `tech-${rowKey(item)}`;
                                const problem = error(index);
                                return (
                                    <li key={id} className="flex items-start gap-2 p-3 sm:px-4">
                                        <div className="min-w-0 flex-1 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    id={`${id}-name`}
                                                    value={item.name}
                                                    onChange={(event) => change(index, { name: event.target.value })}
                                                    placeholder="اسم التقنية"
                                                    aria-label={`اسم التقنية رقم ${index + 1}`}
                                                    aria-invalid={problem && !item.name.trim() ? true : undefined}
                                                    dir="auto"
                                                    className="min-w-0 flex-1"
                                                />
                                                <div className="flex shrink-0 items-center gap-1.5">
                                                    <Input
                                                        type="number"
                                                        inputMode="numeric"
                                                        min={0}
                                                        max={100}
                                                        value={percentNumber(item.val)}
                                                        onChange={(event) => change(index, { val: event.target.value ? `${event.target.value}%` : "" })}
                                                        aria-label={`نسبة إتقان التقنية رقم ${index + 1}`}
                                                        aria-invalid={problem && item.name.trim() ? true : undefined}
                                                        dir="ltr"
                                                        className="w-20"
                                                    />
                                                    <span aria-hidden className="text-sm text-subtle">
                                                        %
                                                    </span>
                                                </div>
                                            </div>
                                            {problem && <p className="text-xs text-danger">{problem}</p>}
                                        </div>
                                        <RowMenu
                                            label={item.name || `التقنية رقم ${index + 1}`}
                                            index={index}
                                            count={items.length}
                                            onMove={(offset) => move(index, offset)}
                                            onRemove={() => remove(index)}
                                        />
                                    </li>
                                );
                            })}
                        </ul>
                        <div className="border-t border-border p-3 sm:px-4">{addButton}</div>
                    </Card>
                );
            }}
        </SkillsListEditor>
    );
}
