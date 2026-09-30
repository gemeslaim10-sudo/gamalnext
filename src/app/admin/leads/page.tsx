"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, RefreshCw, Search, UserPlus } from "lucide-react";
import { toast } from "react-hot-toast";
import {
    AdminPage,
    ReadError,
    invalidateAdminLists,
    refreshAdminCounts,
    useAdminList,
    type AdminListOptions,
} from "@/components/admin/kit";
import { invalidateCounts, useCollectionCounts, type CountFilter } from "@/components/admin/kit/listData";
import { Alert, Button, Card, Chip, EmptyState, Input, Select, Skeleton, Spinner } from "@/components/ui";
import { loadFirestore } from "@/lib/firebase-app";
import { normalizePhone, type LeadSource, type LeadStatus } from "@/lib/leads/schema";
import { LeadDetails } from "./components/LeadDetails";
import { LeadListItem } from "./components/LeadListItem";
import { SOURCES, SOURCE_LABEL, STATUSES, STATUS_LABEL, leadsToCsv, toLeadRow, type LeadRow } from "./leadRows";

type StatusFilter = LeadStatus | "all";
type SourceFilter = LeadSource | "all";

// Newest activity first. Every lead saved by the site has `updatedAt` (it changes each time the
// person gets in touch again); a few very old ones don't, so they're fetched separately (see below).
const LIST_OPTIONS: AdminListOptions = { orderBy: "updatedAt", direction: "desc", pageSize: 25 };

/**
 * The status and source filters run in the database, so they cover every lead, not just the loaded
 * pages (indexes in firestore.indexes.json). Each combination is its own list, kept for the visit.
 */
function listOptions(status: StatusFilter, source: SourceFilter): AdminListOptions {
    const where: Record<string, string> = {};
    if (status !== "all") where.status = status;
    if (source !== "all") where.source = source;
    return Object.keys(where).length > 0 ? { ...LIST_OPTIONS, where } : LIST_OPTIONS;
}

// Totals on the status chips: count queries, no leads are read
const STATUS_COUNTS = Object.fromEntries([
    ["all", null],
    ...STATUSES.map((status) => [status, { status }]),
]) as Record<StatusFilter, CountFilter>;

const byActivity = (a: LeadRow, b: LeadRow) => b.lastActivityMs - a.lastActivityMs;

interface Filters {
    status: StatusFilter;
    source: SourceFilter;
    search: string;
}

function matches(lead: LeadRow, { status, source, search }: Filters) {
    if (status !== "all" && lead.status !== status) return false;
    if (source !== "all" && lead.source !== source) return false;
    const query = search.trim().toLowerCase();
    if (!query) return true;
    if (lead.name.toLowerCase().includes(query) || lead.service.toLowerCase().includes(query)) return true;
    const digits = query.replace(/\D/g, "");
    return digits.length > 0 && (lead.phone.replace(/\D/g, "").includes(digits) || lead.dialPhone.replace(/\D/g, "").includes(digits));
}

/** Leads are stored one per phone number, with the number's digits as the document id. */
function phoneDocId(search: string) {
    const digits = normalizePhone(search).replace(/\D/g, "");
    return digits.length >= 7 ? digits : null;
}

export default function LeadsPage() {
    const [filters, setFilters] = useState<Filters>({ status: "all", source: "all", search: "" });
    const options = useMemo(() => listOptions(filters.status, filters.source), [filters.status, filters.source]);
    const list = useAdminList<Record<string, unknown>>("leads", options);
    const { counts: statusCounts } = useCollectionCounts("leads", STATUS_COUNTS);
    const serverFiltered = options !== LIST_OPTIONS;
    // Leads found outside the sorted pages: very old ones, or looked up by phone number
    const [extra, setExtra] = useState<LeadRow[]>([]);
    const [unsorted, setUnsorted] = useState<number | null>(null);
    const [loadingUnsorted, setLoadingUnsorted] = useState(false);
    const [lookingUp, setLookingUp] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [selected, setSelected] = useState<LeadRow | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    const listed = useMemo(() => list.items.map((item) => toLeadRow(item.id, item)), [list.items]);
    const rows = useMemo(() => {
        if (extra.length === 0) return listed;
        const ids = new Set(listed.map((lead) => lead.id));
        return [...listed, ...extra.filter((lead) => !ids.has(lead.id))].sort(byActivity);
    }, [listed, extra]);
    const visible = useMemo(() => rows.filter((lead) => matches(lead, filters)), [rows, filters]);

    const allLoaded = list.status === "ready" && !list.hasMore;
    const loadedCount = list.items.length;

    // Once every sorted page is here, one cheap count tells whether some leads couldn't be sorted
    // (saved before `updatedAt` existed). They're only read when the owner asks.
    useEffect(() => {
        if (!allLoaded || serverFiltered) return undefined;
        let active = true;
        loadFirestore()
            .then(({ db, collection, getCountFromServer }) => getCountFromServer(collection(db, "leads")))
            .then((snap) => {
                if (active) setUnsorted(Math.max(0, snap.data().count - loadedCount));
            })
            .catch((error: unknown) => console.error("Counting leads failed:", error));
        return () => {
            active = false;
        };
    }, [allLoaded, loadedCount, serverFiltered]);

    const missing =
        !serverFiltered && unsorted !== null
            ? Math.max(0, unsorted - extra.filter((lead) => !listed.some((row) => row.id === lead.id)).length)
            : 0;

    const readAll = async () => {
        const { db, collection, getDocs } = await loadFirestore();
        const snap = await getDocs(collection(db, "leads"));
        return snap.docs.map((item) => toLeadRow(item.id, item.data()));
    };

    const showUnsorted = async () => {
        setLoadingUnsorted(true);
        try {
            const ids = new Set(listed.map((lead) => lead.id));
            const others = (await readAll()).filter((lead) => !ids.has(lead.id));
            setExtra((current) => [...current.filter((lead) => !others.some((other) => other.id === lead.id)), ...others]);
        } catch (error) {
            console.error("Loading older leads failed:", error);
            toast.error("مقدرناش نحمّلهم. جرّب تاني.");
        } finally {
            setLoadingUnsorted(false);
        }
    };

    const lookUpPhone = async (docId: string) => {
        setLookingUp(true);
        try {
            const { db, doc, getDoc } = await loadFirestore();
            const snap = await getDoc(doc(db, "leads", docId));
            if (!snap.exists()) {
                toast("مفيش عميل بالرقم ده.");
                return;
            }
            const lead = toLeadRow(snap.id, snap.data());
            setExtra((current) => [...current.filter((row) => row.id !== lead.id), lead]);
        } catch (error) {
            console.error("Looking up a lead failed:", error);
            toast.error("مقدرناش ندوّر. جرّب تاني.");
        } finally {
            setLookingUp(false);
        }
    };

    const reload = () => {
        setExtra([]);
        setUnsorted(null);
        void list.reload();
    };

    /** Shows a saved status wherever the lead is listed, without reading the list again. */
    const applyStatus = (id: string, status: LeadStatus) => {
        if (list.items.some((item) => item.id === id)) list.updateItem(id, { status });
        setExtra((current) => current.map((lead) => (lead.id === id ? { ...lead, status } : lead)));
        setSelected((current) => (current?.id === id ? { ...current, status } : current));
    };

    /** After a change: the other filters' lists and every total load again when next shown. */
    const afterChange = () => {
        invalidateAdminLists("leads", options);
        invalidateCounts("leads");
        void refreshAdminCounts();
    };

    const changeStatus = async (lead: LeadRow, status: LeadStatus) => {
        try {
            const { db, doc, updateDoc } = await loadFirestore();
            await updateDoc(doc(db, "leads", lead.id), { status });
            applyStatus(lead.id, status);
            afterChange();
            toast.success(`بقى «${STATUS_LABEL[status]}».`);
        } catch (error) {
            console.error("Updating the lead status failed:", error);
            toast.error("مقدرناش نغيّر الحالة. جرّب تاني.");
        }
    };

    const deleteLead = async (lead: LeadRow) => {
        try {
            const { db, doc, deleteDoc } = await loadFirestore();
            await deleteDoc(doc(db, "leads", lead.id));
            list.removeItem(lead.id);
            setExtra((current) => current.filter((row) => row.id !== lead.id));
            setUnsorted((current) => (current !== null && !listed.some((row) => row.id === lead.id) ? Math.max(0, current - 1) : current));
            setDetailsOpen(false);
            afterChange();
            toast.success("العميل اتمسح.");
            return true;
        } catch (error) {
            console.error("Deleting the lead failed:", error);
            toast.error("مقدرناش نمسحه. جرّب تاني.");
            return false;
        }
    };

    // Reads every lead only now, when the owner asks for the file; the filters above apply
    const exportCsv = async () => {
        setExporting(true);
        try {
            const leads = (await readAll()).filter((lead) => matches(lead, filters)).sort(byActivity);
            if (leads.length === 0) {
                toast("مفيش عملاء بالفلتر ده.");
                return;
            }
            const url = URL.createObjectURL(new Blob([leadsToCsv(leads)], { type: "text/csv;charset=utf-8" }));
            const link = document.createElement("a");
            link.href = url;
            link.download = `gtech-leads-${new Date().toISOString().slice(0, 10)}.csv`;
            document.body.append(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
            toast.success(`اتصدّر ${leads.length} عميل.`);
        } catch (error) {
            console.error("Exporting leads failed:", error);
            toast.error("مقدرناش نعمل الملف. جرّب تاني.");
        } finally {
            setExporting(false);
        }
    };

    const openLead = useCallback((lead: LeadRow) => {
        setSelected(lead);
        setDetailsOpen(true);
    }, []);
    const closeDetails = useCallback(() => setDetailsOpen(false), []);


    const setFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => setFilters((current) => ({ ...current, [key]: value }));
    const clearFilters = () => setFilters({ status: "all", source: "all", search: "" });
    const searching = filters.search.trim() !== "";
    const lookupId = searching ? phoneDocId(filters.search) : null;
    const canLookUp = lookupId !== null && list.hasMore && !rows.some((lead) => lead.id === lookupId);
    const failed = list.status === "error" && list.items.length === 0;

    return (
        <AdminPage
            title="العملاء المحتملين"
            description="الناس اللي سابت اسمها ورقمها من النافذة أو صفحة التواصل أو الأسعار أو المساعد الذكي. آخر نشاط فوق."
            width="wide"
            actions={
                <>
                    <Button variant="ghost" size="sm" onClick={reload} disabled={list.loading || list.loadingMore}>
                        <RefreshCw />
                        تحديث
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => void exportCsv()}
                        disabled={exporting || list.loading}
                        title="بيقرا كل العملاء (بالفلتر الحالي) ويحمّلهم في ملف يفتح في Excel"
                    >
                        {exporting ? <Spinner className="size-4" /> : <Download />}
                        تصدير CSV
                    </Button>
                </>
            }
        >
            {/* The whole screen waits only for the first, unfiltered page; a filter reloads just the rows */}
            {list.loading && !serverFiltered ? (
                <ListSkeleton />
            ) : failed && !serverFiltered ? (
                <ReadError message="مقدرناش نقرا العملاء. اتأكد من النت وجرّب تاني." onRetry={reload} indexUrl={list.indexUrl} />
            ) : rows.length === 0 && missing === 0 && !serverFiltered ? (
                <EmptyState
                    icon={<UserPlus />}
                    title="لسه مفيش عملاء"
                    description="أول ما حد يسيب رقمه في النافذة أو صفحة التواصل أو الأسعار أو الشات، هيظهر هنا."
                />
            ) : (
                <>
                    <div className="mb-4 space-y-3">
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="relative min-w-0 flex-1">
                                <Search aria-hidden className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
                                <Input
                                    type="search"
                                    value={filters.search}
                                    onChange={(e) => setFilter("search", e.target.value)}
                                    placeholder="دوّر بالاسم أو الرقم أو الخدمة"
                                    aria-label="دوّر في العملاء"
                                    className="ps-9"
                                />
                            </div>
                            <Select
                                value={filters.source}
                                onChange={(e) => setFilter("source", e.target.value as SourceFilter)}
                                aria-label="المصدر"
                                className="sm:w-48"
                            >
                                <option value="all">كل المصادر</option>
                                {SOURCES.map((value) => (
                                    <option key={value} value={value}>
                                        {SOURCE_LABEL[value]}
                                    </option>
                                ))}
                            </Select>
                        </div>
                        <div role="group" aria-label="الحالة" className="flex flex-wrap gap-2">
                            {(["all", ...STATUSES] as StatusFilter[]).map((value) => (
                                <Chip key={value} active={filters.status === value} onClick={() => setFilter("status", value)}>
                                    {value === "all" ? "الكل" : STATUS_LABEL[value]}
                                    {typeof statusCounts?.[value] === "number" && (
                                        <span className="tabular-nums opacity-70">{statusCounts[value]}</span>
                                    )}
                                </Chip>
                            ))}
                        </div>
                    </div>

                    {list.loading ? (
                        <RowsSkeleton />
                    ) : failed ? (
                        <ReadError message="مقدرناش نقرا العملاء بالفلتر ده. جرّب تاني." onRetry={reload} indexUrl={list.indexUrl} />
                    ) : visible.length === 0 ? (
                        <EmptyState
                            title="مفيش عملاء بالفلتر ده"
                            description={
                                searching && list.hasMore ? "البحث بيدوّر في اللي اتحمّل بس. حمّل المزيد تحت، أو دوّر بالرقم في كل العملاء." : undefined
                            }
                            action={
                                <Button variant="secondary" onClick={clearFilters}>
                                    امسح الفلتر
                                </Button>
                            }
                        />
                    ) : (
                        <Card padding="none" className="overflow-hidden">
                            <ul className="divide-y divide-border">
                                {visible.map((lead) => (
                                    <LeadListItem key={lead.id} lead={lead} onOpen={openLead} />
                                ))}
                            </ul>
                        </Card>
                    )}

                    {!list.loading && !failed && (
                        <div className="mt-4 flex flex-col items-center gap-3 text-center">
                            <p className="text-xs text-subtle">
                                {searching ? `ظاهر ${visible.length} من ${rows.length} اتحمّلوا` : `${rows.length} عميل`}
                                {list.hasMore && " — فيه أقدم"}
                            </p>

                            {canLookUp && (
                                <Button variant="secondary" size="sm" onClick={() => void lookUpPhone(lookupId)} disabled={lookingUp}>
                                    {lookingUp ? <Spinner className="size-4" /> : <Search />}
                                    دوّر بالرقم ده في كل العملاء
                                </Button>
                            )}

                            {list.status === "error" ? (
                                <Alert variant="danger" className="flex w-full flex-col gap-3 text-start sm:flex-row sm:items-center sm:justify-between">
                                    <span>مقدرناش نحمّل الباقي.</span>
                                    <Button variant="secondary" size="sm" onClick={() => void list.loadMore()} className="shrink-0">
                                        جرّب تاني
                                    </Button>
                                </Alert>
                            ) : (
                                list.hasMore && (
                                    <Button variant="secondary" onClick={() => void list.loadMore()} disabled={list.loadingMore}>
                                        {list.loadingMore && <Spinner className="size-4" />}
                                        تحميل المزيد
                                    </Button>
                                )
                            )}

                            {allLoaded && missing > 0 && (
                                <Alert className="flex w-full flex-col gap-3 text-start sm:flex-row sm:items-center sm:justify-between">
                                    <span>فيه {missing} عميل قديم مش ظاهرين في الترتيب (اتسجلوا من نسخة قديمة من الموقع).</span>
                                    <Button variant="secondary" size="sm" onClick={() => void showUnsorted()} disabled={loadingUnsorted} className="shrink-0">
                                        {loadingUnsorted && <Spinner className="size-4" />}
                                        اعرضهم
                                    </Button>
                                </Alert>
                            )}
                        </div>
                    )}
                </>
            )}

            <LeadDetails
                lead={selected}
                open={detailsOpen}
                onClose={closeDetails}
                onStatus={changeStatus}
                onDelete={deleteLead}
            />
        </AdminPage>
    );
}

function RowsSkeleton() {
    return (
        <div role="status" aria-label="جاري التحميل…" className="divide-y divide-border rounded-card border border-border bg-surface">
            {[0, 1, 2, 3, 4].map((row) => (
                <div key={row} className="space-y-2 px-4 py-4">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-64 max-w-full" />
                </div>
            ))}
        </div>
    );
}

function ListSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 sm:w-48" />
            </div>
            <RowsSkeleton />
        </div>
    );
}
