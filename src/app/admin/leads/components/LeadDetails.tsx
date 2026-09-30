"use client";

import { Fragment, useState } from "react";
import { Copy, Phone, Send, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { SocialIcon } from "@/components/icons/SocialIcon";
import { Button, ButtonLink, Chip, Modal, Spinner, buttonVariants } from "@/components/ui";
import { leadContactLinks, type LeadStatus } from "@/lib/leads/schema";
import { SOURCE_LABEL, STATUSES, STATUS_LABEL, formatLeadDate, type LeadRow } from "../leadRows";

interface LeadDetailsProps {
    lead: LeadRow | null;
    open: boolean;
    onClose: () => void;
    onStatus: (lead: LeadRow, status: LeadStatus) => Promise<void>;
    onDelete: (lead: LeadRow) => Promise<boolean>;
}

/** Everything about one lead, with the ways to reach them, the status and delete. */
export function LeadDetails({ lead, open, onClose, onStatus, onDelete }: LeadDetailsProps) {
    const [confirming, setConfirming] = useState(false);
    const [pendingStatus, setPendingStatus] = useState<LeadStatus | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [shownId, setShownId] = useState<string | null>(null);

    // Opening another lead starts without the delete question
    if (lead && lead.id !== shownId) {
        setShownId(lead.id);
        setConfirming(false);
    }

    const changeStatus = async (next: LeadStatus) => {
        if (!lead || next === lead.status || pendingStatus) return;
        setPendingStatus(next);
        await onStatus(lead, next);
        setPendingStatus(null);
    };

    const remove = async () => {
        if (!lead) return;
        setDeleting(true);
        const removed = await onDelete(lead);
        setDeleting(false);
        if (removed) setConfirming(false);
    };

    const copyPhone = async (phone: string) => {
        try {
            await navigator.clipboard.writeText(phone);
            toast.success("الرقم اتنسخ.");
        } catch {
            toast.error("مقدرناش ننسخ الرقم.");
        }
    };

    const links = lead?.dialPhone ? leadContactLinks(lead.dialPhone) : null;
    const details = lead
        ? [
              { label: "الخدمة", value: lead.service },
              { label: "الرسالة", value: lead.message },
              { label: "النشاط", value: lead.activity },
              { label: "أنسب وقت", value: lead.preferredTime },
              { label: "إيميل الحساب", value: lead.userEmail },
              { label: "الصفحة", value: lead.page },
              { label: "المصدر", value: SOURCE_LABEL[lead.source] },
              { label: "أول تواصل", value: formatLeadDate(lead.firstContactMs) },
              { label: "آخر نشاط", value: formatLeadDate(lead.lastActivityMs) },
          ].filter((detail) => detail.value)
        : [];

    return (
        <Modal open={open} onClose={onClose} title={lead?.name || "من غير اسم"} size="md">
            {lead && (
                <div className="space-y-6 p-5">
                    {lead.phone && (
                        <section aria-label="التواصل" className="space-y-3">
                            <p className="text-lg font-semibold text-foreground">
                                <bdi dir="ltr" className="tabular-nums">
                                    {lead.dialPhone || lead.phone}
                                </bdi>
                            </p>
                            {links && (
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                    <a href={links.call} className={buttonVariants({ variant: "secondary" })}>
                                        <Phone />
                                        اتصال
                                    </a>
                                    <ButtonLink href={links.whatsapp} external variant="secondary">
                                        <SocialIcon kind="whatsapp" />
                                        واتساب
                                    </ButtonLink>
                                    <ButtonLink href={links.telegram} external variant="secondary">
                                        <Send />
                                        تيليجرام
                                    </ButtonLink>
                                    <Button variant="secondary" onClick={() => void copyPhone(lead.dialPhone || lead.phone)}>
                                        <Copy />
                                        نسخ
                                    </Button>
                                </div>
                            )}
                        </section>
                    )}

                    <section aria-label="الحالة" className="space-y-2">
                        <p className="text-sm font-medium text-foreground">الحالة</p>
                        <div className="flex flex-wrap gap-2">
                            {STATUSES.map((value) => (
                                <Chip
                                    key={value}
                                    active={lead.status === value}
                                    onClick={() => void changeStatus(value)}
                                    disabled={pendingStatus !== null}
                                    className="h-10 px-4 sm:h-8 sm:px-3"
                                >
                                    {pendingStatus === value && <Spinner className="size-3.5" />}
                                    {STATUS_LABEL[value]}
                                </Chip>
                            ))}
                        </div>
                    </section>

                    {details.length > 0 && (
                        <dl className="grid gap-y-1 text-sm sm:grid-cols-[7rem_1fr] sm:gap-x-4 sm:gap-y-2">
                            {details.map((detail) => (
                                <Fragment key={detail.label}>
                                    <dt className="text-xs text-subtle sm:pt-0.5">{detail.label}</dt>
                                    <dd dir="auto" className="mb-2 min-w-0 whitespace-pre-line break-words text-foreground sm:mb-0">
                                        {detail.value}
                                    </dd>
                                </Fragment>
                            ))}
                        </dl>
                    )}

                    <div className="border-t border-border pt-4">
                        {confirming ? (
                            <div className="space-y-3">
                                <p className="text-sm text-muted">هيتمسح نهائي ومش هيرجع. متأكد؟</p>
                                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                                    <Button variant="secondary" onClick={() => setConfirming(false)} disabled={deleting}>
                                        إلغاء
                                    </Button>
                                    <Button variant="danger" onClick={() => void remove()} disabled={deleting}>
                                        {deleting ? <Spinner className="size-4 text-danger" /> : <Trash2 />}
                                        امسح نهائي
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-end">
                                <Button variant="danger" onClick={() => setConfirming(true)}>
                                    <Trash2 />
                                    حذف العميل
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Modal>
    );
}
