'use client';

import { useState } from 'react';
import { Youtube, Search, Download, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useToolHistory } from '@/hooks/useToolHistory';

export default function YoutubeThumbnailPage() {
    const [url, setUrl] = useState('');
    const [videoId, setVideoId] = useState<string | null>(null);
    const { addToHistory } = useToolHistory();

    const extractVideoId = (input: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = input.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleFetch = () => {
        const id = extractVideoId(url);
        if (id) {
            setVideoId(id);
            addToHistory('youtube-thumbnail', 'تحميل صور يوتيوب', `Fetched thumbnail for video ID: ${id}`);
        } else {
            toast.error("رابط غير صحيح");
            setVideoId(null);
        }
    };

    const getThumbnailUrl = (id: string, quality: string) => `https://img.youtube.com/vi/${id}/${quality}.jpg`;

    const handleDownload = async (imgUrl: string) => {
        try {
            const response = await fetch(imgUrl);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `thumbnail_${videoId}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (e) {
            // Because of CORS, sometimes direct download fails if not proxied.
            // Fallback: Open in new tab
            window.open(imgUrl, '_blank');
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Youtube className="text-red-500" />
                تحميل صور يوتيوب (Thumbnails)
            </h1>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8">
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
                            placeholder="ضع رابط فيديو اليوتيوب هنا..."
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-4 pr-12 pl-4 text-white focus:border-red-500 outline-none"
                        />
                        <Youtube className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                    </div>
                    <button
                        onClick={handleFetch}
                        className="bg-red-600 hover:bg-red-700 text-white px-8 rounded-xl font-bold transition-colors"
                    >
                        بحث
                    </button>
                </div>
            </div>

            {videoId && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
                    {[
                        { label: 'أعلى جودة (Max Res)', q: 'maxresdefault' },
                        { label: 'جودة عالية (High)', q: 'hqdefault' },
                        { label: 'جودة متوسطة (Medium)', q: 'mqdefault' },
                        { label: 'جودة قياسية (Standard)', q: 'sddefault' },
                    ].map((item) => (
                        <div key={item.q} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group">
                            <div className="relative aspect-video bg-black">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={getThumbnailUrl(videoId, item.q)}
                                    alt={item.label}
                                    className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleDownload(getThumbnailUrl(videoId, item.q))}
                                        className="bg-white text-black p-3 rounded-full shadow-xl transform scale-90 group-hover:scale-100 transition-transform"
                                    >
                                        <Download className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4 flex justify-between items-center bg-slate-950">
                                <span className="font-bold text-slate-300">{item.label}</span>
                                <button
                                    onClick={() => handleDownload(getThumbnailUrl(videoId, item.q))}
                                    className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg transition-colors"
                                >
                                    تحميل
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
