"use client";

import { ArrowRight } from 'lucide-react';
import { ButtonLink, Section } from '@/components/ui';
import { useCopy } from '@/components/providers/CopyProvider';
import { ArticleCard, hasAnyCover } from '@/components/articles/ArticleCard';
import type { ArticleCard as ArticleCardData } from '@/types';

// Two columns show two cards; the third would sit alone on its own row
const THIRD_ON_TABLET = (index: number) => (index === 2 ? 'sm:max-lg:hidden' : undefined);

/** Other published articles, picked on the server (cached with the article page). */
export default function RelatedArticles({ articles }: { articles: ArticleCardData[] }) {
    const t = useCopy();

    if (articles.length === 0) return null;

    const showCovers = hasAnyCover(articles);

    return (
        <Section
            title={t('blog.relatedTitle')}
            action={
                <ButtonLink href="/articles" variant="ghost">
                    {t('blog.viewAll')}
                    <ArrowRight />
                </ButtonLink>
            }
            className="mt-10 border-t border-border pb-0 sm:mt-14 sm:pb-0"
        >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((article, index) => (
                    <ArticleCard
                        key={article.id}
                        article={article}
                        showCover={showCovers}
                        className={THIRD_ON_TABLET(index)}
                    />
                ))}
            </div>
        </Section>
    );
}
