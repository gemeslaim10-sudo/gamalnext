/**
 * The public address of an article: its readable slug (/articles/before-you-buy-an-erp), else its
 * id for older articles without one. The article page also accepts the id and redirects to this.
 */
export function articlePath(article: { id: string; slug?: string | null }) {
    const slug = article.slug?.trim();
    return `/articles/${slug ? encodeURIComponent(slug) : article.id}`;
}

/** A slug from a title: lowercase words joined by dashes (Latin and Arabic letters and digits only). */
export function slugFromTitle(title: string) {
    return title
        .toLowerCase()
        .replace(/[^؀-ۿa-z0-9\s-]/g, "")
        .trim()
        .replace(/[\s-]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 80)
        .replace(/-$/, "");
}
