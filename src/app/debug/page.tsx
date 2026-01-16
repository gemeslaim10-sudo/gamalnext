"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function DebugPage() {
    const [articles, setArticles] = useState<any[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkData() {
            try {
                const snap = await getDocs(collection(db, "articles"));
                setArticles(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
        checkData();
    }, []);

    if (loading) return <div className="p-10 text-white">Searching database...</div>;
    if (error) return <div className="p-10 text-red-500">Error: {error}</div>;

    return (
        <div className="p-10 bg-black min-h-screen text-white font-mono">
            <h1 className="text-2xl font-bold mb-4">Database Check</h1>
            <p className="mb-4 text-green-400">Found {articles.length} articles.</p>
            <div className="space-y-2">
                {articles.map(a => (
                    <div key={a.id} className="border p-2 border-gray-700">
                        <span className="text-yellow-500">{a.id}</span>: {a.title} ({a.status})
                        <br />
                        <span className="text-xs text-gray-500">Author: {a.authorId}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
