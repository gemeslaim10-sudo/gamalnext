"use client";

import { Plus } from "lucide-react";
import { Toaster } from "react-hot-toast";

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
        <div className="max-w-6xl mx-auto min-h-screen pb-20">
            <Toaster />

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Articles Manager</h1>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-colors"
                    >
                        <Plus className="w-5 h-5" /> New Article
                    </button>
                )}
            </div>

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
            <div className="grid grid-cols-1 gap-4">
                {displayedArticles.map((article) => (
                    <ArticleListItem
                        key={article.id}
                        article={article}
                        handleApprove={handleApprove}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                    />
                ))}
                {articles.length === 0 && !isEditing && (
                    <div className="text-center py-20 text-slate-500">No articles found. Create one above!</div>
                )}
            </div>
        </div>
    );
}
