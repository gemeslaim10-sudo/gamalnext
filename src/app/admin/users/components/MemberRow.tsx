import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Avatar, Badge } from "@/components/ui";
import { ALLOWED_ADMINS } from "@/lib/constants";
import { formatDate } from "@/components/admin/kit/listData";
import { memberName, type MemberDoc, type MemberRow } from "../memberData";

/** "انضم 30 سبتمبر 2026", or the last sign-in when the sign-up date wasn't saved. */
export function memberDateLine(member: MemberDoc) {
    const joined = formatDate(member.createdAt);
    if (joined) return `انضم ${joined}`;
    const lastLogin = formatDate(member.lastLoginAt);
    return lastLogin ? `آخر دخول ${lastLogin}` : "";
}

export const isSiteAdmin = (member: MemberDoc) => Boolean(member.email && ALLOWED_ADMINS.includes(member.email));

/** One member; opens their page in the dashboard. */
export function MemberRowItem({ member }: { member: MemberRow }) {
    const name = memberName(member);
    const dateLine = memberDateLine(member);

    return (
        <li className="animate-fade-in">
            <Link href={`/admin/users/${member.id}`} className="group flex items-center gap-3 rounded-control p-3 sm:gap-4 sm:p-4">
                <Avatar src={member.photoURL} alt="" size={40} />
                <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                        {/* The page's alignment for every name and email, whatever language they're in */}
                        <span dir="auto" className="min-w-0 truncate text-sm font-medium text-foreground underline-offset-4 [text-align:match-parent] group-hover:underline">
                            {name}
                        </span>
                        {isSiteAdmin(member) && <Badge variant="outline">أدمن</Badge>}
                    </span>
                    {member.email && (
                        <span dir="ltr" className="mt-0.5 block truncate text-xs text-muted [text-align:match-parent]">
                            {member.email}
                        </span>
                    )}
                    {dateLine && <span className="mt-0.5 block text-xs text-subtle sm:hidden">{dateLine}</span>}
                </span>
                {dateLine && <span className="hidden shrink-0 text-xs text-subtle sm:block">{dateLine}</span>}
                <ChevronLeft aria-hidden className="size-4 shrink-0 text-subtle ltr:rotate-180" />
            </Link>
        </li>
    );
}
