import Link from "next/link";
import { ArrowLeft, Edit, Trash2, Calendar, Share2 } from "lucide-react";
import LikeButton from "@/components/social/LikeButton";
import { toast } from "react-hot-toast";

interface ArticleHeaderProps {
    articleId: string;
    title: string;
    summary?: string;
    isAuthor: boolean;
    deleting: boolean;
    formattedDate: string;
    handleDelete: () => void;
}

export function ArticleHeader({
    articleId,
    title,
    summary,
    isAuthor,
    deleting,
    formattedDate,
    handleDelete
}: ArticleHeaderProps) {
    const handleShare = async () => {
        const shareData = {
            title,
            text: summary,
            url: window.location.href,
        };

        try {
            if (navigator.share && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard! 📋');
            }
        } catch (err) {
            toast.error('Failed to copy link.');
        }
    };

    return (
        <div className="pt-36 pb-12 px-4 max-w-5xl mx-auto text-center relative z-10">
            <Link href="/articles" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-10 transition-colors bg-slate-900/50 border border-slate-800/50 px-4 py-2 rounded-full hover:bg-slate-800 backdrop-blur-md">
                <ArrowLeft className="w-4 h-4" /> Back to Articles
            </Link>

            {/* Author Actions - Desktop (side) */}
            {isAuthor && (
                <div className="hidden md:flex absolute top-32 left-4 gap-2">
                    <Link
                        href={`/articles/${articleId}/edit`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg text-sm"
                    >
                        <Edit className="w-4 h-4" /> Edit
                    </Link>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg disabled:opacity-50 text-sm"
                    >
                        <Trash2 className="w-4 h-4" /> Delete
                    </button>
                </div>
            )}

            <h1 dir="auto" className="text-3xl sm:text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-400 mb-8 leading-tight px-4 drop-shadow-sm">
                {title}
            </h1>

            {/* Author Actions - Mobile (below title) */}
            {isAuthor && (
                <div className="flex md:hidden justify-center gap-3 mb-6 px-4">
                    <Link
                        href={`/articles/${articleId}/edit`}
                        className="flex-1 max-w-[200px] bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg text-sm"
                    >
                        <Edit className="w-4 h-4" /> Edit
                    </Link>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex-1 max-w-[200px] bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50 text-sm"
                    >
                        <Trash2 className="w-4 h-4" /> Delete
                    </button>
                </div>
            )}

            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mt-8 px-4">
                <span className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-4 py-2 rounded-full text-slate-300 text-sm font-medium backdrop-blur-md">
                    <Calendar className="w-4 h-4 text-blue-400" /> {formattedDate}
                </span>
                <button onClick={handleShare} className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-4 py-2 rounded-full text-slate-300 hover:text-white hover:border-slate-700 transition-all text-sm font-medium backdrop-blur-md">
                    <Share2 className="w-4 h-4 text-purple-400" /> Share
                </button>
                <div className="bg-slate-900/60 border border-slate-800 px-2 py-1 rounded-full backdrop-blur-md">
                    <LikeButton articleId={articleId} />
                </div>
            </div>
        </div>
    );
}
