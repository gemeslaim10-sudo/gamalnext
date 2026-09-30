"use client";

import { useMemo, useState } from "react";
import { Download, Search, X } from "lucide-react";
import { CSVLink } from "react-csv";
import { AdminPage, useAdminList } from "@/components/admin/kit";
import { Button, Card, EmptyState, Input, buttonVariants } from "@/components/ui";
import { getTimestampMs } from "@/lib/utils/timestamp";
import type { FirebaseTimestamp } from "@/types";
import { ListBody, ListFooter, ListSkeleton, LoadError, RefreshButton } from "@/components/admin/kit/list";
import { useCollectionCounts } from "@/components/admin/kit/listData";
import { MemberRowItem } from "./components/MemberRow";
import { MEMBER_COUNTS, MEMBER_LIST, matchesMember, searchMembers, type MemberDoc, type MemberRow } from "./memberData";

const CSV_HEADERS = [
    { label: "User ID", key: "id" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Role", key: "role" },
    { label: "Join Date", key: "createdAt" },
    { label: "Last Login", key: "lastLoginAt" },
];

/** YYYY-MM-DD for spreadsheets, or "" when unknown. */
const isoDay = (value: FirebaseTimestamp | undefined) => {
    const ms = getTimestampMs(value);
    return ms ? new Date(ms).toISOString().slice(0, 10) : "";
};

type WideSearch =
    | { query: string; status: "loading" }
    | { query: string; status: "error" }
    | { query: string; status: "done"; items: MemberRow[] };

export default function AdminUsersPage() {
    // Loaded one page at a time (A–Z by email); the total is a cheap count
    const list = useAdminList<MemberDoc>("users", MEMBER_LIST);
    const { counts, refresh: refreshCounts } = useCollectionCounts("users", MEMBER_COUNTS);
    const [query, setQuery] = useState("");
    const [wide, setWide] = useState<WideSearch | null>(null);

    const text = query.trim();
    const matches = useMemo(() => list.items.filter((member) => matchesMember(member, text)), [list.items, text]);
    // A search of every member is shown only while the box still holds the text it ran for
    const wideResult = wide && text && wide.query === text ? wide : null;

    const csvRows = useMemo(
        () =>
            list.items.map((member) => ({
                id: member.id,
                name: member.name ?? "",
                email: member.email ?? "",
                role: member.role ?? "",
                createdAt: isoDay(member.createdAt),
                lastLoginAt: isoDay(member.lastLoginAt),
            })),
        [list.items]
    );

    const searchEveryone = async () => {
        const target = text;
        setWide({ query: target, status: "loading" });
        try {
            const items = await searchMembers(target);
            setWide((current) => (current?.query === target ? { query: target, status: "done", items } : current));
        } catch (error) {
            console.error("Member search failed:", error);
            setWide((current) => (current?.query === target ? { query: target, status: "error" } : current));
        }
    };

    return (
        <AdminPage
            title="الأعضاء"
            description="الحسابات المسجلة على الموقع، مرتبة أبجديًا بالإيميل. افتح أي عضو عشان تشوف بياناته."
            width="wide"
            actions={
                csvRows.length > 0 && (
                    <CSVLink
                        data={csvRows}
                        headers={CSV_HEADERS}
                        filename="users_export.csv"
                        title="بيصدّر الأعضاء اللي اتحمّلوا في الصفحة"
                        className={buttonVariants({ variant: "secondary", className: "w-full sm:w-auto" })}
                    >
                        <Download /> تصدير {csvRows.length} (CSV)
                    </CSVLink>
                )
            }
        >
            <div className="mb-4 flex items-center gap-2">
                <div className="relative min-w-0 flex-1 sm:max-w-md">
                    <Search aria-hidden className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
                    <Input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="دوّر بالاسم أو الإيميل"
                        aria-label="دوّر في الأعضاء بالاسم أو الإيميل"
                        className="ps-9"
                    />
                </div>
                <div className="ms-auto shrink-0">
                    <RefreshButton
                        refreshing={list.loading}
                        onRefresh={() => {
                            setWide(null);
                            void list.reload();
                            void refreshCounts();
                        }}
                    />
                </div>
            </div>

            {text && !list.loading && (
                <div className="mb-4 flex flex-col gap-2 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between">
                    {wideResult ? (
                        <p aria-live="polite">
                            {wideResult.status === "done"
                                ? `نتايج البحث في كل الأعضاء: ${wideResult.items.length} (اللي الاسم أو الإيميل بيبدأ بـ «${text}»)`
                                : "بندوّر في كل الأعضاء…"}
                        </p>
                    ) : (
                        <p aria-live="polite">
                            {`لقينا ${matches.length} من ${list.items.length} عضو اتحمّلوا`}
                            {list.hasMore && " — فيه أعضاء لسه ما اتحمّلوش"}
                        </p>
                    )}
                    {wideResult ? (
                        <Button variant="ghost" size="sm" onClick={() => setWide(null)} className="h-10 self-start sm:h-8 sm:self-auto">
                            <X /> رجوع للقايمة
                        </Button>
                    ) : (
                        list.hasMore && (
                            <Button variant="secondary" size="sm" onClick={() => void searchEveryone()} className="h-10 self-start sm:h-8 sm:self-auto">
                                <Search /> دوّر في كل الأعضاء
                            </Button>
                        )
                    )}
                </div>
            )}

            {wideResult ? (
                wideResult.status === "loading" ? (
                    <ListSkeleton rows={3} />
                ) : wideResult.status === "error" ? (
                    <LoadError message="ما قدرناش ندوّر في الأعضاء." onRetry={() => void searchEveryone()} />
                ) : wideResult.items.length === 0 ? (
                    <EmptyState title="مفيش عضو بالاسم أو الإيميل ده" description="البحث بيلاقي اللي بيبدأ بالكلام اللي كتبته (والأسماء بتفرق بين الحروف الكبيرة والصغيرة)." />
                ) : (
                    <MemberList members={wideResult.items} />
                )
            ) : (
                <>
                    <ListBody
                        list={list}
                        shown={matches.length}
                        empty={
                            text ? (
                                <EmptyState
                                    title="مفيش عضو بالاسم أو الإيميل ده في اللي اتحمّل"
                                    description={list.hasMore ? "دوس «دوّر في كل الأعضاء» فوق، أو حمّل المزيد." : "جرّب كلمة تانية."}
                                />
                            ) : (
                                <EmptyState title="مفيش أعضاء لسه" description="أول ما حد يعمل حساب على الموقع هيظهر هنا." />
                            )
                        }
                    >
                        <MemberList members={matches} />
                    </ListBody>
                    <ListFooter list={list} shown={matches.length} total={text ? null : counts?.all} />
                </>
            )}
        </AdminPage>
    );
}

function MemberList({ members }: { members: MemberRow[] }) {
    return (
        <Card padding="none">
            <ul className="divide-y divide-border">
                {members.map((member) => (
                    <MemberRowItem key={member.id} member={member} />
                ))}
            </ul>
        </Card>
    );
}
