/** Structured data for search engines and AI assistants. "<" is escaped so dashboard text can never close the script tag. */
export function JsonLd({ data }: { data: unknown }) {
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
