import ReactMarkdown from 'react-markdown';
import CommentSection from "@/components/social/CommentSection";

interface ArticleBodyProps {
    articleId: string;
    content: string;
    contentDir: 'rtl' | 'ltr';
}

export function ArticleBody({ articleId, content, contentDir }: ArticleBodyProps) {
    return (
        <article className="max-w-4xl mx-auto px-4 pb-24 relative z-10">
            <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/50 rounded-[2.5rem] p-6 md:p-12 lg:p-16 shadow-2xl">
                <div dir={contentDir} className={`article-content prose prose-lg md:prose-xl prose-invert mx-auto leading-loose text-slate-300 prose-p:text-slate-300 prose-headings:text-white prose-a:text-blue-400 prose-strong:text-white prose-strong:font-bold ${contentDir === 'rtl' ? 'article-rtl' : ''}`}>
                    <ReactMarkdown
                        components={{
                            a: ({ node, ...props }) => (
                                <a
                                    {...props}
                                    dir="auto"
                                    className="text-blue-400 hover:text-blue-300 underline decoration-blue-500/30 hover:decoration-blue-300 transition-all font-semibold"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                />
                            ),
                            p: ({ children }) => <p dir="auto" className="mb-6 leading-relaxed md:leading-loose text-[1.1rem] md:text-[1.2rem]">{children}</p>,
                            h1: ({ children }) => <h1 dir="auto" className="text-3xl md:text-4xl font-black mb-6 mt-12 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">{children}</h1>,
                            h2: ({ children }) => <h2 dir="auto" className="text-2xl md:text-3xl font-bold mb-6 mt-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">{children}</h2>,
                            h3: ({ children }) => <h3 dir="auto" className="text-xl md:text-2xl font-bold mb-4 mt-8 text-slate-200">{children}</h3>,
                            ul: ({ children }) => <ul dir="auto" className="article-ul list-none space-y-3 mb-8">{children}</ul>,
                            ol: ({ children }) => <ol dir="auto" className="article-ol space-y-3 mb-8">{children}</ol>,
                            li: ({ children }) => (
                                <li dir="auto" className="article-li relative">
                                    <span className="text-slate-300">{children}</span>
                                </li>
                            ),
                            blockquote: ({ children }) => (
                                <blockquote dir="auto" className="article-blockquote bg-blue-500/10 text-blue-100 italic px-6 py-5 my-8 shadow-inner text-lg">
                                    {children}
                                </blockquote>
                            ),
                            strong: ({ children }) => <strong dir="auto" className="text-white font-extrabold bg-white/5 px-1 rounded">{children}</strong>,
                            hr: () => <hr className="border-slate-700/50 my-10" />,
                            code: ({ children }) => <code dir="ltr" className="bg-slate-800 text-blue-300 px-2 py-0.5 rounded text-sm font-mono">{children}</code>,
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                </div>

                <div className="mt-16 pt-8 border-t border-slate-800/50">
                    <CommentSection articleId={articleId} />
                </div>
            </div>
        </article>
    );
}
