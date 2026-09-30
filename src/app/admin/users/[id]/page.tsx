"use client";

import { useState, type ReactNode } from "react";
import { useParams } from "next/navigation";
import { Check, Copy, ExternalLink } from "lucide-react";
import { AdminPage, useAdminDoc } from "@/components/admin/kit";
import { Avatar, Badge, Button, ButtonLink, Card, EmptyState, Skeleton } from "@/components/ui";
import { LoadError } from "@/components/admin/kit/list";
import { formatDate } from "@/components/admin/kit/listData";
import { isSiteAdmin } from "../components/MemberRow";
import { memberName, readMemberDoc } from "../memberData";

const CRUMBS = [{ label: "الأعضاء", href: "/admin/users" }];

// Values saved by the member's settings page
const SOCIAL_STATUS: Record<string, string> = { Single: "أعزب", Engaged: "مخطوب", Married: "متجوز", Complicated: "معقّدة" };
const GENDER: Record<string, string> = { Male: "ذكر", Female: "أنثى" };
const ROLE: Record<string, string> = { user: "عضو", admin: "أدمن" };

export default function MemberPage() {
    const { id } = useParams<{ id: string }>();
    // Only this member's document is read
    const member = useAdminDoc(`users/${id}`, readMemberDoc);
    const data = member.data;

    if (member.loading) {
        return (
            <AdminPage title="العضو" breadcrumbs={CRUMBS}>
                <MemberSkeleton />
            </AdminPage>
        );
    }

    if (!member.raw || !data) {
        return (
            <AdminPage title="العضو" breadcrumbs={CRUMBS}>
                {member.status === "error" ? (
                    <LoadError message="ما قدرناش نقرا بيانات العضو." onRetry={() => void member.reload()} />
                ) : (
                    <EmptyState
                        title="العضو ده مش موجود"
                        description="ممكن يكون مسح حسابه."
                        action={
                            <ButtonLink href="/admin/users" variant="secondary">
                                رجوع للأعضاء
                            </ButtonLink>
                        }
                    />
                )}
            </AdminPage>
        );
    }

    const name = memberName(data);
    const profile: [string, ReactNode][] = [
        ["المسمى الوظيفي", data.jobTitle],
        ["المكان", data.location],
        ["النوع", data.gender && (GENDER[data.gender] ?? data.gender)],
        ["الحالة الاجتماعية", data.socialStatus && (SOCIAL_STATUS[data.socialStatus] ?? data.socialStatus)],
    ];
    const account: [string, ReactNode][] = [
        ["انضم", formatDate(data.createdAt, true) || "مش متسجل"],
        ["آخر دخول بجوجل", formatDate(data.lastLoginAt, true)],
        ["آخر تعديل للبروفايل", formatDate(data.updatedAt, true)],
        ["الدور", data.role && (ROLE[data.role] ?? data.role)],
    ];

    return (
        <AdminPage
            title={name}
            breadcrumbs={CRUMBS}
            actions={
                <ButtonLink href={`/users/${id}`} external variant="secondary">
                    <ExternalLink /> صفحته على الموقع
                </ButtonLink>
            }
        >
            {member.status === "error" && (
                <LoadError className="mb-6" message="ما قدرناش نحدّث البيانات من قاعدة البيانات." onRetry={() => void member.reload()} />
            )}

            <div className="space-y-6">
                <Card padding="lg" className="flex items-center gap-4">
                    <Avatar src={data.photoURL} alt={name} size={64} />
                    <div className="min-w-0 flex-1">
                        <p className="flex flex-wrap items-center gap-2">
                            <span dir="auto" className="min-w-0 truncate text-base font-semibold text-foreground">
                                {name}
                            </span>
                            {isSiteAdmin(data) && <Badge variant="outline">أدمن</Badge>}
                        </p>
                        {data.email && (
                            <p dir="ltr" className="mt-1 truncate text-sm text-muted [text-align:match-parent]">
                                <a href={`mailto:${data.email}`} className="transition-colors hover:text-foreground">
                                    {data.email}
                                </a>
                            </p>
                        )}
                    </div>
                </Card>

                <DetailsCard title="البروفايل" rows={profile} empty="العضو ما كملش بيانات البروفايل.">
                    {data.bio?.trim() && (
                        <div className="border-t border-border px-5 py-4">
                            <p className="text-xs text-subtle">نبذة</p>
                            <p dir="auto" className="mt-1 whitespace-pre-line break-words text-sm leading-relaxed text-foreground/90">
                                {data.bio}
                            </p>
                        </div>
                    )}
                </DetailsCard>

                <DetailsCard title="الحساب" rows={account}>
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-5 py-4">
                        <div className="min-w-0">
                            <p className="text-xs text-subtle">رقم الحساب (UID)</p>
                            <p dir="ltr" className="mt-1 truncate font-mono text-sm text-foreground [text-align:match-parent]">
                                {id}
                            </p>
                        </div>
                        <CopyButton value={id} />
                    </div>
                </DetailsCard>
            </div>
        </AdminPage>
    );
}

/** A titled list of label → value lines; empty values are left out. */
function DetailsCard({ title, rows, empty, children }: { title: string; rows: [string, ReactNode][]; empty?: string; children?: ReactNode }) {
    const filled = rows.filter(([, value]) => value !== undefined && value !== null && value !== "");
    return (
        <Card padding="none">
            <h2 className="border-b border-border px-5 py-3 text-sm font-semibold text-foreground">{title}</h2>
            {filled.length > 0 ? (
                <dl className="divide-y divide-border">
                    {filled.map(([label, value]) => (
                        <div key={label} className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:gap-4">
                            <dt className="shrink-0 text-xs text-subtle sm:w-40 sm:text-sm">{label}</dt>
                            <dd dir="auto" className="min-w-0 break-words text-sm text-foreground [text-align:match-parent]">
                                {value}
                            </dd>
                        </div>
                    ))}
                </dl>
            ) : (
                empty && <p className="px-5 py-4 text-sm text-subtle">{empty}</p>
            )}
            {children}
        </Card>
    );
}

function CopyButton({ value }: { value: string }) {
    const [copied, setCopied] = useState(false);
    const copy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
        } catch {
            // Clipboard blocked: the id is on screen to copy by hand
        }
    };
    return (
        <Button variant="ghost" size="sm" className="h-10 sm:h-8" onClick={() => void copy()} aria-live="polite">
            {copied ? <Check /> : <Copy />}
            {copied ? "اتنسخ" : "نسخ"}
        </Button>
    );
}

function MemberSkeleton() {
    return (
        <div role="status" className="space-y-6">
            <span className="sr-only">جاري تحميل بيانات العضو…</span>
            <Card padding="lg" aria-hidden className="flex items-center gap-4">
                <Skeleton className="size-16 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-56" />
                </div>
            </Card>
            <Card padding="lg" aria-hidden className="space-y-3">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-2/3" />
            </Card>
        </div>
    );
}
