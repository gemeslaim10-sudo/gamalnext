import { Eye, EyeOff, Pencil, Pin, PinOff, Trash2 } from "lucide-react";
import { Badge, Button, Spinner } from "@/components/ui";
import { cardChars, type KnowledgeCard } from "@/lib/ai/assistant/shared";
import { cn } from "@/lib/utils";

interface KnowledgeRowProps {
    card: KnowledgeCard;
    /** Another change is being saved */
    disabled: boolean;
    /** This card is being saved */
    saving: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onToggle: (field: "active" | "pinned") => void;
}

const dateFormat = new Intl.DateTimeFormat("ar-EG", { day: "numeric", month: "short", year: "numeric" });

export function KnowledgeRow({ card, disabled, saving, onEdit, onDelete, onToggle }: KnowledgeRowProps) {
    return (
        <li className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-start">
            <button
                type="button"
                onClick={onEdit}
                disabled={disabled}
                className={cn("min-w-0 flex-1 rounded-control text-start disabled:cursor-default", !card.active && "opacity-60")}
            >
                <span className="flex flex-wrap items-center gap-2">
                    <span dir="auto" className="min-w-0 break-words text-sm font-semibold text-foreground">
                        {card.title || "من غير عنوان"}
                    </span>
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
                </span>
                <span dir="auto" className="mt-1.5 line-clamp-2 block whitespace-pre-line break-words text-sm leading-relaxed text-muted">
                    {card.content}
                </span>
                <span className="mt-1.5 block text-xs text-subtle">
                    <span dir="ltr">{cardChars(card).toLocaleString("en-US")}</span> حرف
                    {card.tags.length > 0 && <> · {card.tags.length} كلمة مفتاحية</>}
                    {card.updatedAt && <> · آخر تعديل {dateFormat.format(card.updatedAt)}</>}
                </span>
            </button>

            <div className="-ms-2 flex shrink-0 items-center gap-0.5 sm:ms-0">
                {saving && <Spinner className="me-1 size-4" />}
                <Button
                    variant="ghost"
                    size="icon"
                    disabled={disabled}
                    onClick={() => onToggle("active")}
                    aria-label={card.active ? "إيقاف البطاقة" : "تفعيل البطاقة"}
                    title={card.active ? "إيقاف" : "تفعيل"}
                >
                    {card.active ? <Eye /> : <EyeOff />}
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    disabled={disabled}
                    onClick={() => onToggle("pinned")}
                    aria-label={card.pinned ? "إلغاء التثبيت" : "تثبيت البطاقة"}
                    title={card.pinned ? "إلغاء التثبيت" : "تثبيت"}
                >
                    {card.pinned ? <PinOff /> : <Pin />}
                </Button>
                <Button variant="ghost" size="icon" disabled={disabled} onClick={onEdit} aria-label="تعديل البطاقة" title="تعديل">
                    <Pencil />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    disabled={disabled}
                    onClick={onDelete}
                    aria-label="مسح البطاقة"
                    title="مسح"
                    className="hover:bg-danger/10 hover:text-danger"
                >
                    <Trash2 />
                </Button>
            </div>
        </li>
    );
}
