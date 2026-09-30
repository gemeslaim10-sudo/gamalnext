/**
 * Markdown → one line of plain text, cut at a word boundary. For every place that shows the start
 * of an article outside its page (cards, the home feed, search/share descriptions, RSS), so marks
 * like "##" and "**" never show. The article page itself renders the real Markdown.
 */
export function markdownExcerpt(markdown: string, max = 155) {
    const text = markdown
        .replace(/```[\s\S]*?```/g, " ") // code blocks
        .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links → their text
        .replace(/^\s{0,3}(?:#{1,6}|>|[-*+]|\d+[.)])\s+/gm, "") // headings, quotes, list markers
        .replace(/^\s*(?:[-*_]\s*){3,}$/gm, " ") // horizontal rules
        .replace(/[*_`~]+/g, "") // emphasis and code marks
        .replace(/\s+/g, " ")
        .trim();
    if (text.length <= max) return text;
    const cut = text.slice(0, max);
    const lastSpace = cut.lastIndexOf(" ");
    return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}
