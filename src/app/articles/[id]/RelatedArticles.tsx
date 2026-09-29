"use client";

import { ArrowRight } from 'lucide-react';
import { ButtonLink, Section } from '@/components/ui';
import { useCopy } from '@/components/providers/CopyProvider';
import { useRelatedArticles } from './useRelatedArticles';
import { ArticleCard, ArticleCardSkeleton, hasAnyCover } from '@/components/articles/ArticleCard';

// Two columns show two cards; the third would sit alone on its own row
const THIRD_ON_TABLET = (index: number) => (index === 2 ? 'sm:max-lg:hidden' : undefined);

export default function RelatedArticles({ currentArticleId }: { currentArticleId: string }) {
    const t = useCopy();
    const { articles, loading } = useRelatedArticles(currentArticleId);

    if (!loading && articles.length === 0) return null;

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
                {loading
                    ? [0, 1, 2].map((i) => <ArticleCardSkeleton key={i} className={THIRD_ON_TABLET(i)} />)
                    : articles.map((article, index) => (
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
