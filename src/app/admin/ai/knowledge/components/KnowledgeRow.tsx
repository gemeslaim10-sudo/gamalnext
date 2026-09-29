import { Eye, EyeOff, Pencil, Pin, PinOff, Trash2 } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { cardChars, type KnowledgeCard } from "@/lib/ai/assistant/shared";
import { cn } from "@/lib/utils";

interface KnowledgeRowProps {
    card: KnowledgeCard;
    busy: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onToggle: (field: "active" | "pinned") => void;
}

export function KnowledgeRow({ card, busy, onEdit, onDelete, onToggle }: KnowledgeRowProps) {
    const updated = card.updatedAt
        ? new Date(card.updatedAt).toLocaleDateString("ar-EG", { day: "numeric", month: "short", year: "numeric" })
        : null;

    return (
        <li className={cn("flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-start", !card.active && "opacity-60")}>
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <h3 dir="auto" className="min-w-0 break-words text-sm font-semibold text-foreground">
                        {card.title || "بدون عنوان"}
                    </h3>
                    {card.category && (
                        <Badge variant="outline" dir="auto">
                            {card.category}
                        </Badge>
                    )}
                    {card.pinned && (
                        <Badge>
                            <Pin aria-hidden /> مثبّتة
                        </Badge>
                    )}
                    {!card.active && <Badge variant="warning">متوقفة</Badge>}
                </div>
                <p dir="auto" className="mt-1.5 line-clamp-2 whitespace-pre-line break-words text-sm leading-relaxed text-muted">
                    {card.content}
                </p>
                <p className="mt-1.5 text-xs text-subtle">
                    {cardChars(card).toLocaleString("en-US")} حرف
                    {card.tags.length > 0 && <> · {card.tags.length} كلمة مفتاحية</>}
                    {updated && <> · آخر تعديل {updated}</>}
                </p>
            </div>

            <div className="-ms-2 flex shrink-0 items-center gap-0.5 sm:ms-0">
                <Button
                    variant="ghost"
                    size="icon"
                    disabled={busy}
                    onClick={() => onToggle("active")}
                    aria-label={card.active ? "إيقاف البطاقة" : "تفعيل البطاقة"}
                    title={card.active ? "إيقاف" : "تفعيل"}
                >
                    {card.active ? <Eye /> : <EyeOff />}
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    disabled={busy}
                    onClick={() => onToggle("pinned")}
                    aria-label={card.pinned ? "إلغاء التثبيت" : "تثبيت البطاقة"}
                    title={card.pinned ? "إلغاء التثبيت" : "تثبيت"}
                >
                    {card.pinned ? <PinOff /> : <Pin />}
                </Button>
                <Button variant="ghost" size="icon" disabled={busy} onClick={onEdit} aria-label="تعديل البطاقة" title="تعديل">
                    <Pencil />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    disabled={busy}
                    onClick={onDelete}
                    aria-label="حذف البطاقة"
                    title="حذف"
                    className="hover:bg-danger/10 hover:text-danger"
                >
                    <Trash2 />
                </Button>
            </div>
        </li>
    );
}
