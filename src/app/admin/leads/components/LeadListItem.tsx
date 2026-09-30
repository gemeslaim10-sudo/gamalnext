import { ChevronLeft, Phone } from "lucide-react";
import { SocialIcon } from "@/components/icons/SocialIcon";
import { Badge, ButtonLink, buttonVariants } from "@/components/ui";
import { leadContactLinks } from "@/lib/leads/schema";
import { SOURCE_LABEL, STATUS_BADGE, STATUS_LABEL, formatLeadDate, type LeadRow } from "../leadRows";

interface LeadListItemProps {
    lead: LeadRow;
    onOpen: (lead: LeadRow) => void;
}

/** One row of the leads list: who, how to reach them, when. The row opens the details. */
export function LeadListItem({ lead, onOpen }: LeadListItemProps) {
    const links = lead.dialPhone ? leadContactLinks(lead.dialPhone) : null;
    const name = lead.name || "من غير اسم";

    return (
        <li className="flex items-center gap-1 px-2 py-2 sm:px-3">
            <button
                type="button"
                onClick={() => onOpen(lead)}
                className="group flex min-h-14 min-w-0 flex-1 items-center gap-3 rounded-control px-2 py-2 text-start transition-colors hover:bg-surface-hover"
            >
                <span className="min-w-0 flex-1">
                    <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                        <span dir="auto" className="min-w-0 truncate text-sm font-semibold text-foreground">
                            {name}
                        </span>
                        <Badge variant={STATUS_BADGE[lead.status]}>{STATUS_LABEL[lead.status]}</Badge>
                    </span>
                    <span className="mt-1 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-subtle">
                        {lead.phone && (
                            <bdi dir="ltr" className="tabular-nums text-muted">
                                {lead.phone}
                            </bdi>
                        )}
                        <span>{SOURCE_LABEL[lead.source]}</span>
                        {lead.service && (
                            <span dir="auto" className="min-w-0 max-w-full truncate sm:max-w-56">
                                {lead.service}
                            </span>
                        )}
                        {lead.lastActivityMs > 0 && <time dateTime={new Date(lead.lastActivityMs).toISOString()}>{formatLeadDate(lead.lastActivityMs)}</time>}
                    </span>
                </span>
                <ChevronLeft aria-hidden className="size-4 shrink-0 text-subtle ltr:rotate-180" />
            </button>

            {links && (
                <div className="flex shrink-0 items-center">
                    <ButtonLink href={links.whatsapp} external variant="ghost" size="icon" aria-label={`واتساب: ${name}`} title="واتساب">
                        <SocialIcon kind="whatsapp" />
                    </ButtonLink>
                    <a href={links.call} aria-label={`اتصال: ${name}`} title="اتصال" className={buttonVariants({ variant: "ghost", size: "icon" })}>
                        <Phone />
                    </a>
                </div>
            )}
        </li>
    );
}
