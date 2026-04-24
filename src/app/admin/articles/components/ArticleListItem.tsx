import { Check, Edit, Trash } from "lucide-react";
import Image from "next/image";
import type { Article } from "../types";

interface ArticleListItemProps {
    article: Article;
    handleApprove: (article: Article) => void;
    handleEdit: (article: Article) => void;
    handleDelete: (id: string) => void;
}

export function ArticleListItem({
    article,
    handleApprove,
    handleEdit,
    handleDelete
}: ArticleListItemProps) {
    return (
        <div className={`bg-slate-900 border ${article.status === 'pending' ? 'border-yellow-500/50' : 'border-slate-800'} p-4 rounded-xl flex flex-col md:flex-row gap-6 items-start hover:border-blue-500/30 transition-colors`}>
            {/* Thumbnail */}
            <div className="w-full md:w-48 aspect-video bg-slate-950 rounded-lg overflow-hidden flex-shrink-0 border border-slate-800 group relative">
                {article.media?.[0] ? (
                    article.media[0].type === 'video' ? (
                        <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-600 font-bold">VIDEO</div>
                    ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={article.media[0].url} alt={article.title} className="w-full h-full object-cover" />
                    )
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">No Media</div>
                )}
                {article.status === 'pending' && (
                    <div className="absolute inset-0 bg-yellow-500/20 flex items-center justify-center">
                        <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">PENDING</span>
                    </div>
                )}
            </div>

            <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    {article.title}
                    {article.status === 'pending' && <span className="bg-yellow-500/10 text-yellow-500 text-[10px] px-2 py-0.5 rounded border border-yellow-500/20">NEEDS REVIEW</span>}
                </h3>
                <p className="text-slate-400 text-sm line-clamp-2 md:line-clamp-1 mb-3">{article.summary}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
                    <span className="text-blue-400">By: {article.authorName || 'Admin'}</span>
                    <span>/{article.slug}</span>
                    <span>{article.media?.length || 0} Media Items</span>
                </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
                {article.status === 'pending' && (
                    <button
                        onClick={() => handleApprove(article)}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                    >
                        <Check className="w-4 h-4" /> Approve
                    </button>
                )}
                <button onClick={() => handleEdit(article)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                    <Edit className="w-5 h-5" />
                </button>
                <button onClick={() => handleDelete(article.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
