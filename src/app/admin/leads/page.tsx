"use client";

import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { CSVLink } from "react-csv";
import { Copy, Download, MessageSquarePlus, Phone, Search, Send, Trash2, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { db } from "@/lib/firebase";
import { leadContactLinks, type LeadSource, type LeadStatus } from "@/lib/leads/schema";
import { SocialIcon } from "@/components/icons/SocialIcon";
import {
    Alert,
    Badge,
    Button,
    ButtonLink,
    buttonVariants,
    Card,
    Chip,
    EmptyState,
    Input,
    LoadingBlock,
    Modal,
    PageHeader,
    Select,
} from "@/components/ui";
import { SOURCES, SOURCE_LABEL, STATUSES, STATUS_BADGE, STATUS_LABEL, csvSafe, toLeadRow, type LeadRow } from "./leadRows";

type StatusFilter = LeadStatus | "all";
type SourceFilter = LeadSource | "all";

const STATUS_FILTERS: StatusFilter[] = ["all", ...STATUSES];

const CSV_HEADERS = [
    { label: "Name", key: "name" },
    { label: "Phone", key: "phone" },
    { label: "Status", key: "status" },
    { label: "Source", key: "source" },
    { label: "Service", key: "service" },
    { label: "Message", key: "message" },
    { label: "Business", key: "activity" },
    { label: "Best time to call", key: "preferredTime" },
    { label: "Account email", key: "userEmail" },
    { label: "Page", key: "page" },
    { label: "First contact", key: "firstContact" },
    { label: "Last activity", key: "lastActivity" },
];

function formatDate(ms: number) {
    return new Date(ms).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

const isoDate = (ms: number) => (ms ? new Date(ms).toISOString() : "");

export default function LeadsPage() {
    const [leads, setLeads] = useState<LeadRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [status, setStatus] = useState<StatusFilter>("all");
    const [source, setSource] = useState<SourceFilter>("all");
    const [search, setSearch] = useState("");
    const [pendingDelete, setPendingDelete] = useState<LeadRow | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        // No orderBy on purpose: older leads have only `capturedAt` or only `updatedAt`, and Firestore
        // leaves out documents that miss the ordered field. The list is small, so it's sorted here.
        const unsubscribe = onSnapshot(
            collection(db, "leads"),
            (snapshot) => {
                const rows = snapshot.docs.map((snap) => toLeadRow(snap.id, snap.data()));
                rows.sort((a, b) => b.lastActivityMs - a.lastActivityMs);
                setLeads(rows);
                setLoadError(false);
                setLoading(false);
            },
            (error) => {
                console.error("Loading leads failed:", error);
                setLoadError(true);
                setLoading(false);
            }
        );
        return () => unsubscribe();
    }, []);

    const counts = useMemo(() => {
        const result: Record<StatusFilter, number> = { all: leads.length, new: 0, contacted: 0, closed: 0 };
        for (const lead of leads) result[lead.status] += 1;
        return result;
    }, [leads]);

    const visible = useMemo(() => {
        const query = search.trim().toLowerCase();
        const digits = query.replace(/\D/g, "");
        return leads.filter((lead) => {
            if (status !== "all" && lead.status !== status) return false;
            if (source !== "all" && lead.source !== source) return false;
            if (!query) return true;
            if (lead.name.toLowerCase().includes(query)) return true;
            return (
                digits.length > 0 &&
                (lead.phone.replace(/\D/g, "").includes(digits) || lead.dialPhone.replace(/\D/g, "").includes(digits))
            );
        });
    }, [leads, status, source, search]);

    const csvData = useMemo(
        () =>
            visible.map((lead) => ({
                name: csvSafe(lead.name),
                phone: lead.dialPhone || lead.phone,
                status: STATUS_LABEL[lead.status],
                source: SOURCE_LABEL[lead.source],
                service: csvSafe(lead.service),
                message: csvSafe(lead.message),
                activity: csvSafe(lead.activity),
                preferredTime: csvSafe(lead.preferredTime),
                userEmail: lead.userEmail,
                page: lead.page,
                firstContact: isoDate(lead.firstContactMs),
                lastActivity: isoDate(lead.lastActivityMs),
            })),
        [visible]
    );

    const filtered = status !== "all" || source !== "all" || search.trim() !== "";
    const clearFilters = () => {
        setStatus("all");
        setSource("all");
        setSearch("");
    };

    const changeStatus = async (lead: LeadRow, next: LeadStatus) => {
        if (next === lead.status) return;
        try {
            await updateDoc(doc(db, "leads", lead.id), { status: next });
            toast.success(`Marked as ${STATUS_LABEL[next].toLowerCase()}`);
        } catch (error) {
            console.error("Updating lead status failed:", error);
            toast.error("Couldn't update the status");
        }
    };

    const copyPhone = async (phone: string) => {
        try {
            await navigator.clipboard.writeText(phone);
            toast.success("Phone number copied");
        } catch {
            toast.error("Couldn't copy the number");
        }
    };

    const askDelete = (lead: LeadRow) => {
        setPendingDelete(lead);
        setDeleteOpen(true);
    };
    const closeDelete = useCallback(() => setDeleteOpen(false), []);

    const confirmDelete = async () => {
        if (!pendingDelete) return;
        setDeleting(true);
        try {
            await deleteDoc(doc(db, "leads", pendingDelete.id));
            toast.success("Lead deleted");
            setDeleteOpen(false);
        } catch (error) {
            console.error("Deleting lead failed:", error);
            toast.error("Couldn't delete the lead");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <PageHeader
                title="Leads"
                description="People who left their name and number: from the popup, the contact page, pricing and the chat assistant. Newest first."
                actions={
                    <>
                        <ButtonLink href="/admin/leads/capture" variant="secondary" className="w-full sm:w-auto">
                            <MessageSquarePlus />
                            Popup settings
                        </ButtonLink>
                        {visible.length > 0 && (
                            <CSVLink
                                data={csvData}
                                headers={CSV_HEADERS}
                                filename="gtech-leads.csv"
                                className={buttonVariants({ variant: "secondary", className: "w-full sm:w-auto" })}
                            >
                                <Download />
                                Export CSV
                            </CSVLink>
                        )}
                    </>
                }
            />

            {loading ? (
                <LoadingBlock label="Loading leads…" />
            ) : loadError ? (
                <Alert variant="danger">Couldn&apos;t load the leads. Check your connection and reload the page.</Alert>
            ) : leads.length === 0 ? (
                <EmptyState
                    icon={<UserPlus />}
                    title="No leads yet"
                    description="When visitors leave their number in the popup, on the contact page, on pricing or in the chat, they show up here."
                />
            ) : (
                <>
                    <div className="mb-4 space-y-3">
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="relative min-w-0 flex-1">
                                <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
                                <Input
                                    type="search"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by name or phone"
                                    aria-label="Search leads by name or phone"
                                    className="pl-9"
                                />
                            </div>
                            <Select
                                value={source}
                                onChange={(e) => setSource(e.target.value as SourceFilter)}
                                aria-label="Filter by source"
                                className="sm:w-48"
                            >
                                <option value="all">All sources</option>
                                {SOURCES.map((value) => (
                                    <option key={value} value={value}>
                                        {SOURCE_LABEL[value]}
                                    </option>
                                ))}
                            </Select>
                        </div>
                        <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-2">
                            {STATUS_FILTERS.map((value) => (
                                <Chip key={value} active={status === value} onClick={() => setStatus(value)}>
                                    {value === "all" ? "All" : STATUS_LABEL[value]}
                                    <span className="tabular-nums opacity-70">{counts[value]}</span>
                                </Chip>
                            ))}
                        </div>
                    </div>

                    {visible.length === 0 ? (
                        <EmptyState
                            title="No leads match these filters"
                            action={
                                <Button variant="secondary" onClick={clearFilters}>
                                    Clear filters
                                </Button>
                            }
                        />
                    ) : (
                        <>
                            {filtered && (
                                <p className="mb-3 text-xs text-subtle">
                                    Showing {visible.length} of {leads.length}
                                </p>
                            )}
                            <Card padding="none" className="overflow-hidden">
                                <ul className="divide-y divide-border">
                                    {visible.map((lead) => (
                                        <LeadItem
                                            key={lead.id}
                                            lead={lead}
                                            onStatus={changeStatus}
                                            onCopy={copyPhone}
                                            onDelete={askDelete}
                                        />
                                    ))}
                                </ul>
                            </Card>
                        </>
                    )}
                </>
            )}

            <Modal open={deleteOpen} onClose={closeDelete} title="Delete lead" size="sm">
                <div className="p-5">
                    <p className="text-sm leading-relaxed text-muted">
                        <span dir="auto" className="font-medium text-foreground">
                            {pendingDelete?.name || "This lead"}
                        </span>
                        {pendingDelete?.phone && (
                            <>
                                {" "}
                                (<span dir="ltr">{pendingDelete.phone}</span>)
                            </>
                        )}{" "}
                        will be removed permanently. This can&apos;t be undone.
                    </p>
                    <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <Button variant="secondary" onClick={closeDelete}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={confirmDelete} disabled={deleting}>
                            {deleting ? "Deleting…" : "Delete lead"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

// Phones get 40px tap targets; wider screens get compact buttons
const ACTION = "h-10 sm:h-8";

interface LeadItemProps {
    lead: LeadRow;
    onStatus: (lead: LeadRow, status: LeadStatus) => void;
    onCopy: (phone: string) => void;
    onDelete: (lead: LeadRow) => void;
}

function LeadItem({ lead, onStatus, onCopy, onDelete }: LeadItemProps) {
    const links = lead.dialPhone ? leadContactLinks(lead.dialPhone) : null;
    const returning = lead.firstContactMs > 0 && lead.lastActivityMs - lead.firstContactMs > 60_000;
    const details = [
        { label: "Service", value: lead.service },
        { label: "Message", value: lead.message },
        { label: "Business", value: lead.activity },
        { label: "Best time", value: lead.preferredTime },
        { label: "Account", value: lead.userEmail },
        { label: "Page", value: lead.page },
    ].filter((detail) => detail.value);

    return (
        <li className="px-4 py-4 sm:px-5">
            <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <h3 dir="auto" className="min-w-0 break-words text-sm font-semibold text-foreground">
                        {lead.name || "No name"}
                    </h3>
                    <Badge variant={STATUS_BADGE[lead.status]}>{STATUS_LABEL[lead.status]}</Badge>
                    <Badge variant="outline">{SOURCE_LABEL[lead.source]}</Badge>
                </div>
                {lead.lastActivityMs > 0 && (
                    <time dateTime={isoDate(lead.lastActivityMs)} className="shrink-0 text-xs text-subtle">
                        {formatDate(lead.lastActivityMs)}
                    </time>
                )}
            </div>

            {lead.phone && (
                <p className="mt-1 text-sm text-muted">
                    <span dir="ltr" className="tabular-nums">
                        {lead.phone}
                    </span>
                </p>
            )}

            {details.length > 0 && (
                <dl className="mt-3 grid gap-y-0.5 text-sm sm:grid-cols-[7rem_1fr] sm:gap-x-4 sm:gap-y-1.5">
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

            {returning && <p className="mt-2 text-xs text-subtle">First contact {formatDate(lead.firstContactMs)}</p>}

            <div className="mt-4 flex flex-wrap items-center gap-2">
                {links && (
                    <>
                        <a href={links.call} className={buttonVariants({ variant: "secondary", size: "sm", className: ACTION })}>
                            <Phone />
                            Call
                        </a>
                        <ButtonLink href={links.whatsapp} external variant="secondary" size="sm" className={ACTION}>
                            <SocialIcon kind="whatsapp" />
                            WhatsApp
                        </ButtonLink>
                        <ButtonLink href={links.telegram} external variant="secondary" size="sm" className={ACTION}>
                            <Send />
                            Telegram
                        </ButtonLink>
                        <Button variant="ghost" size="sm" className={ACTION} onClick={() => onCopy(lead.phone)}>
                            <Copy />
                            Copy
                        </Button>
                    </>
                )}
                <div className="flex w-full items-center gap-2 sm:ml-auto sm:w-auto">
                    <Select
                        value={lead.status}
                        onChange={(e) => onStatus(lead, e.target.value as LeadStatus)}
                        aria-label={`Status of ${lead.name || "this lead"}`}
                        className="h-10 min-w-0 flex-1 sm:h-8 sm:w-36 sm:flex-none"
                    >
                        {STATUSES.map((value) => (
                            <option key={value} value={value}>
                                {STATUS_LABEL[value]}
                            </option>
                        ))}
                    </Select>
                    <Button
                        variant="danger"
                        size="icon"
                        className="sm:size-8"
                        onClick={() => onDelete(lead)}
                        aria-label={`Delete ${lead.name || "this lead"}`}
                        title="Delete"
                    >
                        <Trash2 />
                    </Button>
                </div>
            </div>
        </li>
    );
}
