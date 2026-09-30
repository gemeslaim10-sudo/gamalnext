import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { parseDate } from "../utils";
import type { FeedItem } from "../types";
import { ALLOWED_ADMINS } from "@/lib/constants";
import { getAdminUids } from "@/lib/firebase-admin";

export async function fetchUserPostsFeed(allFeed: FeedItem[]) {
    try {
        const [postsSnap, ownerIds] = await Promise.all([
            getDocs(query(collection(db, "posts"), where("status", "==", "approved"), orderBy("createdAt", "desc"))),
            getAdminUids().catch((error: unknown) => {
                console.error("Feed: Couldn't look up the owner's account", error);
                return new Set<string>();
            }),
        ]);
        postsSnap.docs.forEach(docSnap => {
            const data = docSnap.data();
            allFeed.push({
                id: docSnap.id,
                type: "post",
                title: `${data.userName || "User"} shared a post`,
                description: data.content && (data.content as string).length > 200
                    ? (data.content as string).substring(0, 200) + "..."
                    : data.content || "",
                fullContent: data.content || "",
                imageUrl: data.mediaUrl || (data.gallery as string[])?.[0] || null,
                gallery: Array.isArray(data.gallery) ? data.gallery as string[] : null,
                mediaType: data.mediaType || "image",
                link: `/#${docSnap.id}`,
                createdAt: parseDate(data.createdAt),
                author: data.userName || "User",
                authorPhoto: data.userPhoto || null,
                // Posts no longer store the email (they're public); older ones still have it
                byOwner: ownerIds.has(data.userId) || ALLOWED_ADMINS.includes(data.userEmail),
                userId: data.userId,
            });
        });
    } catch (err) {
        console.error("Feed: Failed to fetch user posts", err);
        // A feed missing its posts must not be cached
        throw err;
    }
}
