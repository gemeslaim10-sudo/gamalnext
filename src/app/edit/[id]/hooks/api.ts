import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function updatePostData(postId: string, content: string, images: string[]) {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
        content: content.trim(),
        mediaUrl: images[0] || null,
        gallery: images,
        mediaType: images.length > 0 ? "image" : null,
    });
}
export async function fetchPostData(postId: string) {
    const docRef = doc(db, "posts", postId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() } as { userId?: string; content?: string; gallery?: string[]; mediaUrl?: string; [key: string]: unknown };
}
export async function deletePostData(postId: string) {
    await deleteDoc(doc(db, "posts", postId));
}
