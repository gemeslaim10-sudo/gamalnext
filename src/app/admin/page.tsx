"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { ArrowLeft, FileText, RefreshCw, RotateCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { refreshSite } from "@/lib/refreshSite";
import { getTimestampMs } from "@/lib/utils/timestamp";
import { ADMIN_NAV, ADMIN_NAV_ITEMS, type AdminBadge, type AdminNavItem } from "@/config/admin-nav";
import {
    AdminHub,
    AdminPage,
    refreshAdminCounts,
    useAdminCounts,
    useAdminList,
    type AdminCounts,
    type AdminListOptions,
    type HubGroup,
} from "@/components/admin/kit";
import { Badge, Button, ButtonLink, Card, Skeleton } from "@/components/ui";
import type { FirebaseTimestamp } from "@/types";

const COUNT_LABELS: Record<AdminBadge, string> = {
    newLeads: "عملاء جداد",
    pendingArticles: "مقالات مستنية مراجعة",
    pendingPosts: "منشورات مستنية مراجعة",
    pendingReviews: "آراء مستنية مراجعة",
};

// The menu entries that carry a counter (leads, articles, posts, reviews), in menu order
const COUNT_ITEMS = ADMIN_NAV_ITEMS.filter((item): item is AdminNavItem & { badge: AdminBadge } => Boolean(item.badge));

interface LeadSummary {
    name?: string;
    phone?: string;
    service?: string | null;
    source?: string;
    status?: string;
    sessionId?: string;
    capturedAt?: FirebaseTimestamp;
}

// Every lead saved by the site gets `capturedAt` on first contact
const LATEST_LEADS: AdminListOptions = { orderBy: "capturedAt", direction: "desc", pageSize: 5 };

const SOURCE_LABELS: Record<string, string> = {
    popup: "النافذة",
    contact: "صفحة التواصل",
    pricing: "الأسعار",
    chat: "المساعد",
    other: "تاني",
};

const shortDate = new Intl.DateTimeFormat("ar-EG", { day: "numeric", month: "short" });

export default function AdminDashboard() {
    const { user } = useAuth();
    const counts = useAdminCounts();
    const firstName = user?.displayName?.trim().split(/\s+/)[0];

    return (
        <AdminPage
            title={firstName ? <>أهلاً يا <bdi>{firstName}</bdi></> : "أهلاً بيك"}
            description="ملخص سريع لآخر اللي حصل على الموقع، وكل الأقسام في مكان واحد."
            width="wide"
            actions={
                <ButtonLink href="/gamal-cv" external variant="secondary">
                    <FileText /> الـ CV
                </ButtonLink>
            }
        >
            <div className="space-y-10">
                <AttentionCounts counts={counts} />
                <LatestLeads />
                <section aria-label="كل الأقسام">
                    <AdminHub groups={hubGroups(counts)} />
                </section>
                <ClearCacheCard />
            </div>
        </AdminPage>
    );
}

/** The menu, grouped the same way, as cards (with the pending counts on them). */
function hubGroups(counts: AdminCounts | null): HubGroup[] {
    return ADMIN_NAV.filter((section) => section.id !== "overview").map((section) => ({
        title: section.label,
        items: section.items.map((item) => {
            const count = item.badge && counts ? counts[item.badge] : 0;
            return {
                href: item.href,
                title: item.label,
                description: item.description,
                icon: item.icon,
                badge: count > 0 ? (
                    <Badge variant="warning" className="tabular-nums">
                        {count}
                    </Badge>
                ) : undefined,
            };
        }),
    }));
}

function AttentionCounts({ counts }: { counts: AdminCounts | null }) {
    const [refreshing, setRefreshing] = useState(false);

    const refresh = async () => {
        setRefreshing(true);
        try {
            await refreshAdminCounts();
        } finally {
            setRefreshing(false);
        }
    };

    return (
        <section aria-labelledby="home-counts">
            <div className="mb-3 flex items-center justify-between gap-3">
                <h2 id="home-counts" className="text-sm font-semibold text-foreground">
                    محتاج انتباهك
                </h2>
                <Button variant="ghost" size="sm" onClick={() => void refresh()} disabled={refreshing || !counts}>
                    <RotateCw /> تحديث
                </Button>
            </div>
            <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {COUNT_ITEMS.map((item) => {
                    const value = counts?.[item.badge] ?? 0;
                    const Icon = item.icon;
                    return (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className="group flex h-full flex-col gap-3 rounded-card border border-border bg-surface p-4 transition duration-(--motion-base) ease-out hover:-translate-y-0.5 hover:border-border-strong"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <Icon aria-hidden className="size-4 text-subtle transition-colors group-hover:text-foreground" />
                                    {value > 0 && <span aria-hidden className="size-2 rounded-full bg-warning" />}
                                </div>
                                <div>
                                    {counts ? (
                                        <p className="text-2xl font-semibold tabular-nums text-foreground">{value}</p>
                                    ) : (
                                        <Skeleton className="h-8 w-10" />
                                    )}
                                    <p className="mt-1 text-xs leading-relaxed text-muted">{COUNT_LABELS[item.badge]}</p>
                                </div>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

function LatestLeads() {
    const leads = useAdminList<LeadSummary>("leads", LATEST_LEADS);

    return (
        <section aria-labelledby="home-leads">
            <div className="mb-3 flex items-center justify-between gap-3">
                <h2 id="home-leads" className="text-sm font-semibold text-foreground">
                    آخر العملاء
                </h2>
                <Link href="/admin/leads" className="flex items-center gap-1 text-xs text-muted transition-colors hover:text-foreground">
                    كل العملاء <ArrowLeft aria-hidden className="size-3.5 ltr:rotate-180" />
                </Link>
            </div>
            <Card padding="none" className="overflow-hidden">
                {leads.loading ? (
                    <div className="divide-y divide-border" aria-busy="true" aria-label="جاري التحميل">
                        {[0, 1, 2].map((row) => (
                            <div key={row} className="space-y-2 px-4 py-3">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-3 w-1/3" />
                            </div>
                        ))}
                    </div>
                ) : leads.error ? (
                    <div className="flex flex-col gap-3 px-4 py-4 text-sm text-danger sm:flex-row sm:items-center sm:justify-between" role="alert">
                        <span>ماقدرناش نجيب آخر العملاء.</span>
                        <Button variant="secondary" size="sm" onClick={() => void leads.reload()} className="self-start sm:self-auto">
                            <RotateCw /> حاول تاني
                        </Button>
                    </div>
                ) : leads.items.length === 0 ? (
                    <p className="px-4 py-8 text-center text-sm text-subtle">لسه محدش ساب بياناته. أول ما حد يسيب رقمه هيظهر هنا.</p>
                ) : (
                    <ul className="divide-y divide-border">
                        {leads.items.map((lead) => {
                            const source = lead.source && SOURCE_LABELS[lead.source] ? lead.source : lead.sessionId ? "chat" : "other";
                            const isNew = !lead.status || lead.status === "new";
                            const ms = getTimestampMs(lead.capturedAt ?? undefined);
                            return (
                                <li key={lead.id}>
                                    <Link href="/admin/leads" className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-hover">
                                        <div className="min-w-0 flex-1">
                                            <p className="flex min-w-0 items-center gap-2">
                                                <span dir="auto" className="truncate text-sm font-medium text-foreground">
                                                    {lead.name?.trim() || "من غير اسم"}
                                                </span>
                                                {isNew && <Badge variant="warning">جديد</Badge>}
                                            </p>
                                            <p className="mt-0.5 truncate text-xs text-subtle">
                                                {lead.phone && <span dir="ltr">{lead.phone}</span>}
                                                {lead.service && (
                                                    <>
                                                        {" · "}
                                                        <span dir="auto">{lead.service}</span>
                                                    </>
                                                )}
                                                {" · "}
                                                {SOURCE_LABELS[source]}
                                            </p>
                                        </div>
                                        {ms > 0 && <span className="shrink-0 text-xs text-subtle">{shortDate.format(ms)}</span>}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </Card>
        </section>
    );
}

// When this browser last cleared the cache (a convenience only, so a missing value is fine)
const CACHE_CLEARED_KEY = "gtech:admin:cache-cleared-at";
const clearedAtFormat = new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium", timeStyle: "short" });

function readClearedAt(): number | null {
    try {
        const value = Number(window.localStorage.getItem(CACHE_CLEARED_KEY));
        return Number.isFinite(value) && value > 0 ? value : null;
    } catch {
        return null;
    }
}

function writeClearedAt(time: number) {
    try {
        window.localStorage.setItem(CACHE_CLEARED_KEY, String(time));
    } catch {
        // Storage blocked (private mode…): only the "last cleared" line is lost
    }
}

/** Refreshes every cached page and read, for edits made outside the dashboard. */
function ClearCacheCard() {
    const [clearing, setClearing] = useState(false);
    // The dashboard renders in the browser only (after sign-in), so storage can be read on first render
    const [clearedAt, setClearedAt] = useState<number | null>(readClearedAt);

    const clearCache = async () => {
        setClearing(true);
        const ok = await refreshSite();
        setClearing(false);
        if (!ok) {
            toast.error("تعذّر تفريغ الكاش. اتأكد إنك داخل بحساب الأدمن وجرّب تاني.");
            return;
        }
        const now = Date.now();
        setClearedAt(now);
        writeClearedAt(now);
        toast.success("تم تفريغ الكاش — الزيارة الجاية هتجيب أحدث البيانات");
    };

    return (
        <Card>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <h2 className="text-base font-semibold text-foreground">تفريغ الكاش</h2>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                        الموقع بيحتفظ بمحتواه (الصورة، اللوجو، النصوص، المهارات، المشاريع، المقالات، الأسعار، رسايل المساعد الذكي…) في
                        الكاش من غير مدة انتهاء، عشان يفتح فورًا. أي حفظ من لوحة التحكم بيحدّث الموقع لوحده. استخدم الزرار ده لو عدّلت
                        بيانات من برّه لوحة التحكم (زي Firestore مباشرةً)، أو لو عايز كل حاجة تتجاب من جديد.
                    </p>
                    {clearedAt !== null && <p className="mt-2 text-xs text-subtle">آخر تفريغ: {clearedAtFormat.format(clearedAt)}</p>}
                </div>
                <Button variant="secondary" onClick={clearCache} disabled={clearing} className="shrink-0 self-start sm:self-auto">
                    <RefreshCw className={clearing ? "animate-spin" : undefined} />
                    {clearing ? "جارٍ التفريغ…" : "تفريغ الكاش"}
                </Button>
            </div>
        </Card>
    );
}
