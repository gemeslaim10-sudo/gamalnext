'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FileText, Music, Video, Calendar, Download } from 'lucide-react';

type HistoryItem = {
    id: string;
    toolId: string;
    description: string;
    fileUrl?: string;
    createdAt: any;
    type: 'audio' | 'video' | 'text' | 'image' | 'other';
};

export default function UserHistoryPage() {
    const { user } = useAuth();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchHistory = async () => {
            try {
                const q = query(
                    collection(db, 'user_history'),
                    where("userId", "==", user.uid),
                    orderBy("createdAt", "desc")
                );
                const snap = await getDocs(q);
                // Graceful fallback for missing index if it happens (though we should create one)
                setHistory(snap.docs.map(d => ({ id: d.id, ...d.data() } as HistoryItem)));
            } catch (e: any) {
                console.error(e);
                // If index missing, just try simpler query or fail silently on list
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user]);

    if (!user) return <div className="p-10 text-center text-slate-400">Please login to view history.</div>;
    if (loading) return <div className="p-10 text-center text-slate-400">Loading history...</div>;

    const getIcon = (type: string) => {
        switch (type) {
            case 'audio': return <Music className="w-5 h-5 text-purple-400" />;
            case 'video': return <Video className="w-5 h-5 text-pink-400" />;
            case 'text': return <FileText className="w-5 h-5 text-blue-400" />;
            default: return <FileText className="w-5 h-5 text-slate-400" />;
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">سجل ملفاتي</h1>
                <p className="text-slate-400">جميع الملفات التي قمت بإنشائها باستخدام الأدوات.</p>
            </div>

            {history.length === 0 ? (
                <div className="bg-slate-900/50 border border-dashed border-slate-700 rounded-xl p-12 text-center">
                    <p className="text-slate-500 text-lg mb-4">لا يوجد سجلات بعد</p>
                    <p className="text-slate-600 text-sm">جرب استخدام إحدى الأدوات من القائمة الجانبية.</p>
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    {history.map((item, i) => (
                        <div key={item.id} className={`p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors ${i !== history.length - 1 ? 'border-b border-slate-800' : ''}`}>
                            <div className="flex items-center gap-4">
                                <div className="bg-slate-800 p-2 rounded-lg">
                                    {getIcon(item.type)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-200">{item.description || "Unamed Project"}</h4>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                        <span className="capitalize bg-slate-800 px-1.5 py-0.5 rounded">{item.toolId}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleDateString('ar-EG') : 'Just now'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {item.fileUrl && (
                                <a
                                    href={item.fileUrl}
                                    target="_blank"
                                    download
                                    className="p-2 hover:bg-blue-600/20 hover:text-blue-400 text-slate-500 rounded-lg transition-colors"
                                    title="Download/Open"
                                >
                                    <Download className="w-5 h-5" />
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
