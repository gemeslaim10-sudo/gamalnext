import Link from "next/link";
import { Calendar, ArrowRight, Edit, Trash2 } from "lucide-react";
import type { Article } from "../useArticlesList";
import { useRouter } from "next/navigation";
import { getArticleSummary, formatArticleDateAr } from "@/lib/articles/articleCardHelpers";

interface ArticleCardProps {
    article: Article;
    canEdit: boolean;
    isDeleting: boolean;
    onDelete: (articleId: string, e: React.MouseEvent) => void;
}

export function ArticleCard({ article, canEdit, isDeleting, onDelete }: ArticleCardProps) {
    const router = useRouter();
    const coverMedia = article.media?.[0]?.url;
    const isVideo = article.media?.[0]?.type === 'video';

    const handleEdit = (articleId: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/articles/${articleId}/edit`);
    };

    return (
        <div className="relative group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:transform hover:-translate-y-2 shadow-lg hover:shadow-2xl">
            <Link href={`/articles/${article.id}`} className="block">
                <div className="h-56 sm:h-48 overflow-hidden relative">
                    {coverMedia ? (
                        isVideo ? (
                            <video src={coverMedia} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" muted />
                        ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={coverMedia} alt={article.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                        )
                    ) : (
                        <div className="w-full h-full relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>

                            <div className="absolute inset-0 opacity-20">
                                <div className="absolute top-0 left-0 w-full h-full">
                                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
                                    <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-blue-300 rounded-full blur-3xl animate-pulse delay-700"></div>
                                </div>
                            </div>

                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-white/40 group-hover:text-white/60 transition-colors">
                                    <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                </div>

                <div className="p-3 sm:p-4 md:p-6 flex flex-col h-full">
                    <div className="flex items-center gap-2 text-slate-400 text-[10px] sm:text-xs mb-2 sm:mb-3 font-mono">
                        <Calendar className="w-3 h-3" />
                        {formatArticleDateAr(article.createdAt)}
                    </div>

                    <h3 className="text-sm sm:text-base md:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-blue-400 transition-colors line-clamp-1 sm:line-clamp-2">
                        {article.title}
                    </h3>

                    <p className="text-slate-400 text-[11px] sm:text-xs md:text-sm line-clamp-2 sm:line-clamp-3 mb-3 sm:mb-4 leading-relaxed flex-grow">
                        {getArticleSummary(article as any, 150)}
                    </p>

                    <span className="text-blue-500 text-[11px] sm:text-sm font-bold flex items-center gap-2 mt-auto pt-3 sm:pt-4 border-t border-slate-800/50 w-full group-hover:text-blue-400">
                        عرض المزيد <ArrowRight className="w-4 h-4 group-hover:gap-2 transition-all mr-auto" />
                    </span>
                </div>
            </Link>

            {canEdit && (
                <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                        onClick={(e) => handleEdit(article.id, e)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-lg transition-all backdrop-blur-sm"
                        title="تعديل المقال"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => onDelete(article.id, e)}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg shadow-lg transition-all disabled:opacity-50 backdrop-blur-sm"
                        title="حذف المقال"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
