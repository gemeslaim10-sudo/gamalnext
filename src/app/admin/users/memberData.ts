"use client";

import { loadFirestore } from "@/lib/firebase-app";
import type { AdminListOptions } from "@/components/admin/kit";
import type { CountFilter } from "@/components/admin/kit/listData";
import type { FirebaseTimestamp } from "@/types";

/** A member's document in `users` (the id is their account id). */
export interface MemberDoc {
    uid?: string;
    name?: string;
    email?: string;
    photoURL?: string | null;
    role?: string;
    jobTitle?: string;
    bio?: string;
    location?: string;
    gender?: string;
    socialStatus?: string;
    createdAt?: FirebaseTimestamp;
    lastLoginAt?: FirebaseTimestamp;
    updatedAt?: FirebaseTimestamp;
}

export type MemberRow = MemberDoc & { id: string };

/**
 * Newest members first. Every account has a sign-up date (`createdAt`): email sign-ups and new
 * Google sign-ins write it, and older Google accounts were filled in from their auth records.
 */
export const MEMBER_LIST: AdminListOptions = { orderBy: "createdAt", direction: "desc", pageSize: 30 };

export const MEMBER_COUNTS: Record<"all", CountFilter> = { all: null };

export const memberName = (member: MemberDoc) => member.name?.trim() || "من غير اسم";

/** For useAdminDoc: the stored fields as they are. */
export const readMemberDoc = (raw: Record<string, unknown> | null): MemberDoc => (raw ?? {}) as MemberDoc;

/** Does a loaded member match the search box (name or email, any case)? */
export function matchesMember(member: MemberDoc, query: string) {
    const needle = query.trim().toLocaleLowerCase();
    if (!needle) return true;
    return [member.name, member.email].some((value) => value?.toLocaleLowerCase().includes(needle));
}

const SEARCH_LIMIT = 20;

/**
 * Search every member, not just the loaded pages: emails and names that start with the text
 * (a few small indexed reads, at most 20 accounts each).
 */
export async function searchMembers(query: string): Promise<MemberRow[]> {
    const text = query.trim();
    if (!text) return [];
    const fs = await loadFirestore();
    const users = fs.collection(fs.db, "users");
    const startsWith = (field: string, value: string) =>
        fs.getDocs(fs.query(users, fs.orderBy(field), fs.startAt(value), fs.endAt(`${value}\uf8ff`), fs.limit(SEARCH_LIMIT)));

    // Google accounts store the email in lower case, email sign-ups as typed; names as typed
    const emailForms = [...new Set([text.toLowerCase(), text])];
    const snaps = await Promise.all([...emailForms.map((value) => startsWith("email", value)), startsWith("name", text)]);
    const found = new Map<string, MemberRow>();
    for (const snap of snaps.flatMap((result) => result.docs)) found.set(snap.id, { ...(snap.data() as MemberDoc), id: snap.id });
    return [...found.values()].sort((a, b) => (a.email ?? "").localeCompare(b.email ?? ""));
}
