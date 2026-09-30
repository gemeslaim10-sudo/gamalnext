"use client";

import { useRef } from "react";
import { ArrowDown, ArrowUp, Ellipsis, Pencil, Trash2 } from "lucide-react";
import { Button, Dropdown, MenuDivider, MenuItem } from "@/components/ui";

interface RowMenuProps {
    /** What the row is, for screen readers (e.g. the item's name) */
    label: string;
    index: number;
    count: number;
    onMove: (offset: -1 | 1) => void;
    onRemove: () => void;
    onEdit?: () => void;
}

/** The "…" button at the end of a list row: edit, move up or down, delete. */
export function RowMenu({ label, index, count, onMove, onRemove, onEdit }: RowMenuProps) {
    const trigger = useRef<HTMLButtonElement>(null);

    // Rows keep their key when they move, so focus can return to this same button afterwards
    const moveAndRefocus = (offset: -1 | 1) => {
        onMove(offset);
        requestAnimationFrame(() => trigger.current?.focus());
    };

    return (
        <Dropdown
            trigger={({ open, toggle }) => (
                <Button ref={trigger} variant="ghost" size="icon" onClick={toggle} aria-expanded={open} aria-label={`خيارات: ${label}`} title="خيارات">
                    <Ellipsis />
                </Button>
            )}
        >
            {(close) => (
                <>
                    {onEdit && (
                        <MenuItem
                            onClick={() => {
                                close();
                                onEdit();
                            }}
                        >
                            <Pencil /> تعديل
                        </MenuItem>
                    )}
                    {index > 0 && (
                        <MenuItem
                            onClick={() => {
                                close();
                                moveAndRefocus(-1);
                            }}
                        >
                            <ArrowUp /> لفوق
                        </MenuItem>
                    )}
                    {index < count - 1 && (
                        <MenuItem
                            onClick={() => {
                                close();
                                moveAndRefocus(1);
                            }}
                        >
                            <ArrowDown /> لتحت
                        </MenuItem>
                    )}
                    {(onEdit || count > 1) && <MenuDivider />}
                    <MenuItem
                        danger
                        onClick={() => {
                            close();
                            onRemove();
                        }}
                    >
                        <Trash2 /> حذف
                    </MenuItem>
                </>
            )}
        </Dropdown>
    );
}
