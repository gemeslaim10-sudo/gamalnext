import { buildLlmsText } from "@/lib/seo/llms";

// Cached with the site content: rebuilt after a dashboard save or "Clear cache"
export const dynamic = "force-static";

/** Everything in /llms.txt plus full prices, questions, project details and article texts. */
export async function GET() {
    return new Response(await buildLlmsText({ full: true }), {
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
    });
}
