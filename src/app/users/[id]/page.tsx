"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, collection, query, where, getDocs, orderBy, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { deleteUser } from "firebase/auth";
import { ALLOWED_ADMINS } from "@/lib/constants";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { MapPin, Heart, Briefcase, Calendar, User } from "lucide-react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

type UserProfile = {
    uid: string;
    name: string;
    photoURL?: string;
    bio?: string;
    location?: string;
    jobTitle?: string;
    socialStatus?: string;
    createdAt?: any;
};

type Article = {
    id: string;
    title: string;
    summary: string;
    media: { url: string; type: 'image' | 'video' }[];
    createdAt: any;
    likesCount?: number;
};

export default function UserProfilePage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [articles, setArticles] = useState<Article[]>([]);
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
                    where("authorId", "==", id), // Note: We need to ensure articles have authorId when creating them! 
                    // Currently they don't from Admin Panel. 
                    // New Plan: We will list articles based on a field if it exists, 
                    // OR for now, since only Admin posts articles, 
                    // maybe we show ALL articles if this is one of the Admin UIDs?
                    // Or we skip user articles for now until we add authorId to articles.
                    // Let's assume we will add authorId later. For now, empty list is fine or we mock if it's the admin.
                    orderBy("createdAt", "desc")
                );

                // Index required for this query probably.
                // Failing gracefully if no index.
                try {
                    const snap = await getDocs(q);
                    setArticles(snap.docs.map(d => ({ id: d.id, ...d.data() } as Article)));
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



    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white"><Loader2 className="animate-spin w-8 h-8" /></div>;

    if (!profile) return <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white gap-4">
        <h1 className="text-2xl font-bold">User Not Found 😕</h1>
        <Link href="/" className="text-blue-400 hover:underline">Go Home</Link>
    </div>;

    return (
        <main className="min-h-screen bg-slate-950">
            <Navbar />

            {/* Header / Cover */}
            <div className="relative h-64 bg-slate-900 border-b border-slate-800 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20"></div>
                {/* Pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#3b82f6 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
            </div>

            <div className="max-w-5xl mx-auto px-4 -mt-32 pb-20 relative z-10">

                {/* Profile Card */}
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl mb-12">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-slate-800 overflow-hidden shadow-xl bg-slate-950">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={profile.photoURL || `https://ui-avatars.com/api/?name=${profile.name}&background=0D8ABC&color=fff`}
                                    alt={profile.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center md:text-right space-y-4 pt-4">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">{profile.name}</h1>
                                {profile.jobTitle && (
                                    <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm font-medium border border-blue-500/20">
                                        <Briefcase className="w-4 h-4" /> {profile.jobTitle}
                                    </div>
                                )}
                            </div>

                            <p className="text-slate-300 leading-relaxed max-w-2xl ml-auto">
                                {profile.bio || "لا توجد نبذة شخصية بعد."}
                            </p>

                            <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 text-slate-400 text-sm pt-2">
                                {profile.location && (
                                    <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg">
                                        <MapPin className="w-4 h-4 text-purple-400" /> {profile.location}
                                    </div>
                                )}
                                {profile.socialStatus && (
                                    <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg">
                                        <Heart className={`w-4 h-4 ${profile.socialStatus === 'Single' ? 'text-green-400' : 'text-red-400'}`} /> {profile.socialStatus}
                                    </div>
                                )}
                                <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg">
                                    <Calendar className="w-4 h-4 text-orange-400" /> انضم {profile.createdAt ? new Date(profile.createdAt.seconds * 1000).toLocaleDateString('ar-EG') : 'قريباً'}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4 border-t border-slate-800 mt-4">
                                {/* Admin Dashboard Button - Only for Admins checking their own profile */}
                                {user && user.uid === id && ALLOWED_ADMINS.includes(user.email || "") && (
                                    <Link
                                        href="/admin"
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        لوحة التحكم (Admin)
                                    </Link>
                                )}

                                {user && user.uid === id && (
                                    <>
                                        <Link
                                            href="/write"
                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                        >
                                            <span className="text-lg">✍️</span> كتابة مقال
                                        </Link>

                                        <Link
                                            href="/settings"
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            تعديل الملف الشخصي
                                        </Link>
                                    </>
                                )}


                            </div>

                        </div>
                    </div>
                </div>

                {/* Articles Section (Advanced: only if users can post, or if admin) */}
                {articles.length > 0 && (
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-bold text-white">المقالات المنشورة</h2>
                            <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full text-xs font-mono">{articles.length}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {articles.map(article => (
                                <Link href={`/articles/${article.id}`} key={article.id} className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all flex h-32">
                                    <div className="w-32 bg-slate-800 flex-shrink-0">
                                        {article.media?.[0] ? (
                                            article.media[0].type === 'video' ? (
                                                <video src={article.media[0].url} className="w-full h-full object-cover opacity-50" />
                                            ) : (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={article.media[0].url} alt={article.title} className="w-full h-full object-cover" />
                                            )
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-600"><User className="w-6 h-6" /></div>
                                        )}
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col justify-center">
                                        <h3 className="text-white font-bold mb-1 group-hover:text-blue-400 transition-colors line-clamp-1">{article.title}</h3>
                                        <p className="text-slate-500 text-sm line-clamp-2">{article.summary}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

            </div>
            <Footer />
        </main >
    );
}
