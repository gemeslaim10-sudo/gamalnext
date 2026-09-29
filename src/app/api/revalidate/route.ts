import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAuthUser } from "@/lib/firebase-admin";
import { ALLOWED_ADMINS } from "@/lib/constants";

export const dynamic = "force-dynamic";

/**
 * Called by the dashboard after saving content, so every page shows the change right away
 * instead of waiting for the periodic refresh. Admins only.
 */
export async function POST(req: Request) {
    try {
        const user = await verifyAuthUser(req);
        if (!user.email || !ALLOWED_ADMINS.includes(user.email)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
}
