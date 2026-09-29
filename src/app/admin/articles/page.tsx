"use client";

import { Plus } from "lucide-react";
import { Button, Card, EmptyState, PageHeader } from "@/components/ui";

import { useArticlesManagement } from "./useArticlesManagement";
import { ArticleForm } from "./components/ArticleForm";
import { ArticleFilters } from "./components/ArticleFilters";
import { ArticleListItem } from "./components/ArticleListItem";

export default function ArticlesAdminPage() {
    const {
        articles,
        displayedArticles,
        filter,
        setFilter,
        isEditing,
        setIsEditing,
        currentId,
        formData,
        setFormData,
        handleApprove,
        resetForm,
        handleEdit,
        handleDelete,
        handleSubmit,
        generateSlug
    } = useArticlesManagement();

    return (
        <>
            <PageHeader
                title="Articles Manager"
                description="Write, edit and review articles, including ones submitted by users."
                actions={
                    !isEditing && (
                        <Button onClick={() => setIsEditing(true)} className="w-full sm:w-auto">
                            <Plus /> New Article
                        </Button>
                    )
                }
            />

            {/* Editor Form */}
            {isEditing && (
                <ArticleForm
                    currentId={currentId}
                    formData={formData}
                    setFormData={setFormData}
                    generateSlug={generateSlug}
                    resetForm={resetForm}
                    handleSubmit={handleSubmit}
                />
            )}

            {/* Filters */}
            <ArticleFilters filter={filter} setFilter={setFilter} />

            {/* Listing */}
            {displayedArticles.length > 0 && (
                <Card padding="none" className="overflow-hidden">
                    <ul className="divide-y divide-border">
                        {displayedArticles.map((article) => (
                            <ArticleListItem
                                key={article.id}
                                article={article}
                                handleApprove={handleApprove}
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                            />
                        ))}
                    </ul>
                </Card>
            )}
            {articles.length === 0 && !isEditing && (
                <EmptyState title="No articles found." description="Create one above!" />
            )}
            {articles.length > 0 && displayedArticles.length === 0 && (
                <p className="py-10 text-center text-sm text-subtle">No articles in this filter.</p>
            )}
        </>
    );
}
