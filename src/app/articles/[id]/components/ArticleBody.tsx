import ReactMarkdown from 'react-markdown';
import { cn } from "@/lib/utils";

interface ArticleBodyProps {
    content: string;
    contentDir: 'rtl' | 'ltr';
}

/**
 * The article text. `article-content` / `article-rtl` (globals.css) handle Arabic and English;
 * every block keeps dir="auto" so mixed paragraphs pick their own direction.
 */
export function ArticleBody({ content, contentDir }: ArticleBodyProps) {
    return (
        <div
            dir={contentDir}
            className={cn(
                "article-content text-[15px] leading-8 text-foreground/90",
                contentDir === 'rtl' && 'article-rtl'
            )}
        >
            <ReactMarkdown
                components={{
                    a: ({ href, title, children }) => (
                        <a
                            href={href}
                            title={title}
                            dir="auto"
                            className="font-medium text-foreground underline decoration-border-strong underline-offset-4 transition-colors hover:decoration-foreground"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {children}
                        </a>
                    ),
                    p: ({ children }) => <p dir="auto">{children}</p>,
                    h1: ({ children }) => <h1 dir="auto" className="mb-3 mt-10 text-2xl font-semibold leading-snug text-foreground first:mt-0">{children}</h1>,
                    h2: ({ children }) => <h2 dir="auto" className="mb-3 mt-10 text-xl font-semibold leading-snug text-foreground first:mt-0">{children}</h2>,
                    h3: ({ children }) => <h3 dir="auto" className="mb-2 mt-8 text-lg font-semibold leading-snug text-foreground first:mt-0">{children}</h3>,
                    h4: ({ children }) => <h4 dir="auto" className="mb-2 mt-6 text-base font-semibold text-foreground first:mt-0">{children}</h4>,
                    ul: ({ children }) => <ul dir="auto" className="article-ul my-5 space-y-2">{children}</ul>,
                    ol: ({ children }) => <ol dir="auto" className="article-ol my-5 space-y-2">{children}</ol>,
                    li: ({ children }) => <li dir="auto" className="article-li leading-7">{children}</li>,
                    blockquote: ({ children }) => (
                        <blockquote dir="auto" className="article-blockquote my-6 ps-4 text-muted">
                            {children}
                        </blockquote>
                    ),
                    strong: ({ children }) => <strong dir="auto" className="font-semibold text-foreground">{children}</strong>,
                    hr: () => <hr className="my-10 border-border" />,
                    pre: ({ children }) => (
                        <pre
                            dir="ltr"
                            className="my-5 overflow-x-auto rounded-card border border-border bg-surface p-4 text-[13px] leading-6 [&>code]:rounded-none [&>code]:bg-transparent [&>code]:p-0"
                        >
                            {children}
                        </pre>
                    ),
                    code: ({ children }) => <code dir="ltr" className="rounded-control bg-surface-hover px-1.5 py-0.5 font-mono text-[13px] text-foreground">{children}</code>,
                    img: ({ src, alt }) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={typeof src === "string" ? src : undefined} alt={alt || ""} loading="lazy" className="my-6 h-auto max-w-full rounded-card border border-border" />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
