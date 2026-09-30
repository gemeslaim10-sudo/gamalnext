import { buildLlmsText } from "@/lib/seo/llms";

// Cached with the site content: rebuilt after a dashboard save or "Clear cache"
export const dynamic = "force-static";

/** Summary of the business for AI assistants (llmstxt.org). */
export async function GET() {
    return new Response(await buildLlmsText(), {
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
    });
}
