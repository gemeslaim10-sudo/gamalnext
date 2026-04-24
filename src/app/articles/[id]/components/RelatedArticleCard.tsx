import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import type { Article } from '../useRelatedArticles';
import { formatTimestamp } from '@/types';

interface RelatedArticleCardProps {
    article: Article;
}

export function RelatedArticleCard({ article }: RelatedArticleCardProps) {
    const coverMedia = article.media?.[0]?.url;
    const isVideo = article.media?.[0]?.type === 'video';

    const getSummary = () => {
        if (article.summary) return article.summary;
        if (!article.content) return '';
        return article.content.substring(0, 120) + '...';
    };

    const formattedDate = formatTimestamp(article.createdAt, 'en-US', { month: 'short', day: 'numeric' });

    return (
        <Link
            href={`/articles/${article.id}`}
            className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-500 shadow-lg hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:-translate-y-2"
        >
            {/* Image */}
            <div className="h-48 overflow-hidden relative">
                {coverMedia ? (
                    isVideo ? (
                        <video src={coverMedia} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" muted />
                    ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={coverMedia} alt={article.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                    )
                ) : (
                    // Beautiful gradient for articles without images
                    <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-blue-600/70 via-purple-600/70 to-pink-600/70">
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                        <div className="absolute inset-0 opacity-30">
                            <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-white rounded-full blur-3xl animate-pulse"></div>
                            <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-blue-300 rounded-full blur-3xl animate-pulse delay-700"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-16 h-16 text-white/40" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                            </svg>
                        </div>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex items-center gap-2 text-slate-500 text-xs mb-3">
                    <Calendar className="w-3 h-3" />
                    {formattedDate}
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
                    {article.title}
                </h3>

                <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed mb-4">
                    {getSummary()}
                </p>

                <div className="flex items-center text-blue-400 text-sm font-medium group-hover:gap-2 transition-all">
                    Read More <ArrowRight className="w-4 h-4" />
                </div>
            </div>
        </Link>
    );
}
