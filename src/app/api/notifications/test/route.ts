import { NextResponse } from "next/server";
import { verifyAuthUser } from "@/lib/firebase-admin";
import { ALLOWED_ADMINS } from "@/lib/constants";
import { sendTestEmail } from "@/lib/notifications/server";
import { getSiteSeo } from "@/lib/seo/server";

export const dynamic = "force-dynamic";

/** Dashboard → Notifications → "Send a test email". Admins only. */
export async function POST(req: Request) {
    try {
        const user = await verifyAuthUser(req);
        if (!user.email || !ALLOWED_ADMINS.includes(user.email)) {
            return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
        }
    } catch {
        return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const { siteName } = await getSiteSeo();
    const result = await sendTestEmail(siteName);
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
