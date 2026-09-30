import { ExternalLink, RotateCw } from "lucide-react";
import { Alert, Button, ButtonLink } from "@/components/ui";
import { cn } from "@/lib/utils";

interface ReadErrorProps {
    message: string;
    onRetry: () => void;
    /** The read needs a Firestore index that doesn't exist yet: this link creates it (one time only) */
    indexUrl?: string;
    className?: string;
}

/** Shown instead of data that couldn't be read (a screen, a list), with a way to try again. */
export function ReadError({ message, onRetry, indexUrl, className }: ReadErrorProps) {
    return (
        <Alert
            variant={indexUrl ? "warning" : "danger"}
            className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", className)}
        >
            <span>
                {indexUrl
                    ? "القايمة دي محتاجة index في قاعدة البيانات، ودي حاجة بتتعمل مرة واحدة بس. اضغط «اعمل الـ index»، وفي صفحة Firebase اضغط Save، واستنى دقيقة أو اتنين وبعدين «جرّب تاني»."
                    : message}
            </span>
            <div className="flex shrink-0 flex-wrap gap-2 self-start sm:self-auto">
                {indexUrl && (
                    <ButtonLink href={indexUrl} external variant="secondary" size="sm" className="h-10 sm:h-8">
                        <ExternalLink /> اعمل الـ index
                    </ButtonLink>
                )}
                <Button variant="secondary" size="sm" onClick={onRetry} className="h-10 sm:h-8">
                    <RotateCw /> جرّب تاني
                </Button>
            </div>
        </Alert>
    );
}
