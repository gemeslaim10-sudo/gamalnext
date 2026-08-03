import { useEffect, useState } from "react";
import { doc, getDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { UserProfile, UserArticle } from "./types";

export function useUserProfile() {
    const { id } = useParams();
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [articles, setArticles] = useState<UserArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (!id) return;
            setLoading(true);
            try {
                // 1. Fetch User Profile
                const userDoc = await getDoc(doc(db, "users", id as string));
                if (userDoc.exists()) {
                    setProfile(userDoc.data() as UserProfile);
                }

                // 2. Fetch User Articles
                const q = query(
                    collection(db, "articles"),
                    where("authorId", "==", id),
                    orderBy("createdAt", "desc")
                );

                try {
                    const snap = await getDocs(q);
                    setArticles(snap.docs.map(d => ({ id: d.id, ...d.data() } as UserArticle)));
                } catch (idxError) {
                    console.warn("Index needed or query failed", idxError);
                }

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [id]);

    return {
        id: id as string,
        user,
        profile,
        articles,
        loading
    };
}
