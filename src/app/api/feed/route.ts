import { NextResponse } from "next/server";
import { getFeedPage } from "@/lib/feed/server";

export const dynamic = "force-dynamic";

/** Next pages of the home feed while scrolling (the first page comes with the home page). Served from the cache. */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10) || 1;

    const result = await getFeedPage(page);
    if (!result) return NextResponse.json({ error: "The feed couldn't be loaded." }, { status: 503 });
    return NextResponse.json(result);
}
