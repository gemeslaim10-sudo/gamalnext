import { NextResponse } from "next/server";
import { verifyAuthUser } from "@/lib/firebase-admin";
import { ALLOWED_ADMINS } from "@/lib/constants";
import { submitToIndexNow } from "@/lib/seo/indexnow";
import sitemap from "@/app/sitemap";

export const dynamic = "force-dynamic";

/** Dashboard → SEO → "Submit all pages": sends every sitemap URL (or the given `urls`) to IndexNow. Admins only. */
export async function POST(req: Request) {
    try {
        const user = await verifyAuthUser(req);
        if (!user.email || !ALLOWED_ADMINS.includes(user.email)) {
            return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
        }
    } catch {
        return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json().catch(() => ({}))) as { urls?: unknown };
    const urls = Array.isArray(body.urls)
        ? body.urls.filter((url): url is string => typeof url === "string")
        : (await sitemap()).map((entry) => entry.url);

    const result = await submitToIndexNow(urls);
    return NextResponse.json(result, { status: result.ok || result.skipped ? 200 : 502 });
}
