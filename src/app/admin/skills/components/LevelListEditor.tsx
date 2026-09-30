"use client";

import type { ReactNode } from "react";
import { Plus } from "lucide-react";
import { Button, Card, EmptyState, Input } from "@/components/ui";
import { focusSoon, rowKey } from "../rowKeys";
import { levelItemError } from "../skillsDoc";
import { SkillsListEditor } from "../SkillsListEditor";
import { RowMenu } from "./RowMenu";

interface LevelListEditorProps {
    list: "software" | "tools";
    title: string;
    description: ReactNode;
    /** One item, e.g. "برنامج" (used in buttons and screen-reader labels) */
    noun: string;
    empty: string;
    levelPlaceholder: string;
}

/** A plain "name + level" list (software proficiency, daily tools), one row per item. */
export function LevelListEditor({ list, title, description, noun, empty, levelPlaceholder }: LevelListEditorProps) {
    return (
        <SkillsListEditor list={list} title={title} description={description} validate={levelItemError}>
            {({ items, change, add, remove, move, error }) => {
                const addRow = () => {
                    const item = { name: "", level: "" };
                    add(item);
                    focusSoon(`${list}-${rowKey(item)}-name`);
                };
                const addButton = (
                    <Button variant="secondary" onClick={addRow}>
                        <Plus /> إضافة {noun}
                    </Button>
                );

                if (items.length === 0) {
                    return <EmptyState title={empty} description="القسم ده مش هيظهر في صفحة المهارات لحد ما تضيف حاجة." action={addButton} />;
                }

                return (
                    <Card padding="none">
                        <ul className="divide-y divide-border">
                            {items.map((item, index) => {
                                const id = `${list}-${rowKey(item)}`;
                                const problem = error(index);
                                return (
                                    <li key={id} className="flex items-start gap-2 p-3 sm:px-4">
                                        <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,13rem)]">
                                            <Input
                                                id={`${id}-name`}
                                                value={item.name}
                                                onChange={(event) => change(index, { name: event.target.value })}
                                                placeholder="الاسم"
                                                aria-label={`اسم ${noun} رقم ${index + 1}`}
                                                aria-invalid={problem ? true : undefined}
                                                dir="auto"
                                            />
                                            <Input
                                                value={item.level}
                                                onChange={(event) => change(index, { level: event.target.value })}
                                                placeholder={levelPlaceholder}
                                                aria-label={`مستوى ${noun} رقم ${index + 1}`}
                                                dir="auto"
                                            />
                                            {problem && <p className="text-xs text-danger sm:col-span-2">{problem}</p>}
                                        </div>
                                        <RowMenu
                                            label={item.name || `${noun} رقم ${index + 1}`}
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
