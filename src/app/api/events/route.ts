import { NextResponse, after } from "next/server";
import admin from "firebase-admin";
import { getAdminAuth, getAdminDb, verifyAuthUser } from "@/lib/firebase-admin";
import { notify } from "@/lib/notifications/server";

export const dynamic = "force-dynamic";

// Events that happen in the browser (sign-up, content sent for review) are reported here so the
// owner can get an email. Every report is checked against the database: it must be the caller's
// own, fresh item, and each item notifies at most once.

const SIGNUP_WINDOW_MS = 15 * 60 * 1000;
const LIMIT = 10;
const WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

function withinLimit(uid: string) {
    const now = Date.now();
    const recent = (hits.get(uid) ?? []).filter((time) => now - time < WINDOW_MS);
    if (recent.length >= LIMIT) return false;
    recent.push(now);
    hits.set(uid, recent);
    return true;
}

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const CONTENT = {
    "article.pending": { collection: "articles", owner: "authorId" },
    "post.pending": { collection: "posts", owner: "userId" },
    "review.pending": { collection: "reviews", owner: "userId" },
} as const;

type ContentEvent = keyof typeof CONTENT;

/** Body: { event: "user.signup" } or { event: "article.pending" | "post.pending" | "review.pending", id } */
export async function POST(req: Request) {
    let user;
    try {
        user = await verifyAuthUser(req);
    } catch {
        return NextResponse.json({ ok: false }, { status: 401 });
    }
    if (!withinLimit(user.uid)) return NextResponse.json({ ok: false }, { status: 429 });

    const body = (await req.json().catch(() => ({}))) as { event?: unknown; id?: unknown };
    const event = text(body.event);
    const db = getAdminDb();

    if (event === "user.signup") {
        const record = await getAdminAuth().getUser(user.uid);
        const createdAt = Date.parse(record.metadata.creationTime);
        // Only accounts created just now (an old account signing in isn't a new member)
        if (!Number.isFinite(createdAt) || Date.now() - createdAt > SIGNUP_WINDOW_MS) return NextResponse.json({ ok: true, skipped: true });
        const ref = db.collection("users").doc(user.uid);
        const claimed = await db.runTransaction(async (tx) => {
            const snap = await tx.get(ref);
            if (snap.get("signupNotifiedAt")) return false;
            tx.set(ref, { signupNotifiedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
            return true;
        });
        if (claimed) {
            const provider = record.providerData[0]?.providerId;
            after(() =>
                notify("user.signup", {
                    name: record.displayName || record.email || "بدون اسم",
                    email: record.email ?? null,
                    method: provider === "google.com" ? "جوجل" : provider === "password" ? "إيميل وباسورد" : provider || "—",
                })
            );
        }
        return NextResponse.json({ ok: true });
    }

    if (event in CONTENT) {
        const id = text(body.id);
        if (!id) return NextResponse.json({ ok: false }, { status: 400 });
        const { collection, owner } = CONTENT[event as ContentEvent];
        const ref = db.collection(collection).doc(id);
        const data = await db.runTransaction(async (tx) => {
            const snap = await tx.get(ref);
            if (!snap.exists || snap.get(owner) !== user.uid || snap.get("status") !== "pending" || snap.get("pendingNotifiedAt")) return null;
            tx.update(ref, { pendingNotifiedAt: admin.firestore.FieldValue.serverTimestamp() });
            return snap.data() ?? null;
        });
        if (!data) return NextResponse.json({ ok: true, skipped: true });

        after(() => {
            if (event === "article.pending") {
                return notify("article.pending", {
                    title: text(data.title) || "بدون عنوان",
                    authorName: text(data.authorName) || "عضو",
                    summary: text(data.summary) || null,
                });
            }
            if (event === "post.pending") {
                return notify("post.pending", { authorName: text(data.userName) || "عضو", content: text(data.content) || "(صور بس)" });
            }
            return notify("review.pending", {
                name: text(data.name) || text(data.userName) || "عميل",
                rating: typeof data.rating === "number" ? data.rating : null,
                text: text(data.text) || text(data.comment) || text(data.content) || "",
            });
        });
        return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: false }, { status: 400 });
}
