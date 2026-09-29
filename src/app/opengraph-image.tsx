import { ImageResponse } from "next/og";
import { SITE_URL } from "@/lib/constants";
import { getCopy } from "@/lib/copy/server";
import { FALLBACK_OWNER_NAME, FALLBACK_SITE_NAME, SHARE_IMAGE, clean, getSiteSettings } from "@/lib/seo/server";

// The picture on shared links (WhatsApp, Facebook, LinkedIn, X), drawn from the dashboard data:
// site name and owner (Settings) and the tagline (/admin/copy → SEO). Pages link to it via getSiteOpenGraph().

export const size = { width: SHARE_IMAGE.width, height: SHARE_IMAGE.height };
export const contentType = "image/png";
// Redrawn at most hourly; saving in the dashboard refreshes it right away (src/app/api/revalidate)
export const revalidate = 3600;

// CSS variables don't exist in the image renderer, so these repeat the tokens in globals.css
const COLORS = {
    background: "#0a0a0a",
    border: "#242424",
    foreground: "#ededed",
    muted: "#a1a1a1",
    subtle: "#808080",
};

/** The owner's photo as a data URL (the renderer can't wait on slow or failing images), or null. */
async function loadPhoto(url: string | undefined) {
    if (!url || !/^https?:\/\//.test(url)) return null;
    // Cloudinary: ask for a small square PNG around the face instead of the full upload
    const src = url.includes("/image/upload/")
        ? url.replace("/image/upload/", "/image/upload/c_fill,g_face,w_192,h_192,f_png/")
        : url;
    try {
        const response = await fetch(src, { signal: AbortSignal.timeout(4000) });
        const type = response.headers.get("content-type") ?? "";
        if (!response.ok || !/^image\/(png|jpe?g)$/.test(type)) return null;
        const data = Buffer.from(await response.arrayBuffer()).toString("base64");
        return `data:${type};base64,${data}`;
    } catch {
        return null;
    }
}

export default async function OpenGraphImage() {
    const [settings, t] = await Promise.all([getSiteSettings(), getCopy()]);
    const siteName = clean(settings?.siteName) ?? FALLBACK_SITE_NAME;
    const ownerName = clean(settings?.ownerName) ?? FALLBACK_OWNER_NAME;
    const ownerTitle = clean(settings?.ownerTitle);
    const tagline = t("seo.shareImageTagline", { siteName }).trim();
    const photo = await loadPhoto(clean(settings?.siteLogo));
    const domain = new URL(SITE_URL).host;

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "80px 88px 72px",
                    background: COLORS.background,
                    color: COLORS.foreground,
                }}
            >
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ fontSize: 120, lineHeight: 1, letterSpacing: "-0.04em" }}>{siteName}</div>
                    {tagline && (
                        <div style={{ marginTop: 32, fontSize: 36, lineHeight: 1.35, color: COLORS.muted }}>
                            {tagline}
                        </div>
                    )}
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingTop: 36,
                        borderTop: `2px solid ${COLORS.border}`,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center" }}>
                        {photo && (
                            // eslint-disable-next-line @next/next/no-img-element -- rendered to a PNG, not a web page
                            <img src={photo} alt="" width={84} height={84} style={{ borderRadius: 9999, marginRight: 24 }} />
                        )}
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <div style={{ fontSize: 32 }}>{ownerName}</div>
                            {ownerTitle && <div style={{ marginTop: 6, fontSize: 24, color: COLORS.subtle }}>{ownerTitle}</div>}
                        </div>
                    </div>
                    <div style={{ fontSize: 26, color: COLORS.subtle }}>{domain}</div>
                </div>
            </div>
        ),
        size
    );
}
