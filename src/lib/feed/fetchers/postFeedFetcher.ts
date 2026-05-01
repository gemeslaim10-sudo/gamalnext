import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { parseDate } from "../utils";
import type { FeedItem } from "../types";

export async function fetchUserPostsFeed(allFeed: FeedItem[]) {
    try {
        const postsSnap = await getDocs(
            query(collection(db, "posts"), where("status", "==", "approved"))
        );
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
            });
        });
    } catch (err) {
        console.error("Feed: Failed to fetch user posts", err);
    }
}
