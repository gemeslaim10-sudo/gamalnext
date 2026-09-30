import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getCopy } from "@/lib/copy/server";
import { getPublicMember } from "@/lib/members/server";
import { getAdminUids } from "@/lib/firebase-admin";
import { clean, getSiteOpenGraph, getSiteSeo } from "@/lib/seo/server";

// Title and share card of a member page (same cached read as the page itself).
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const [profile, t, seo, openGraph] = await Promise.all([
        getPublicMember(id),
        getCopy(),
        getSiteSeo(),
        getSiteOpenGraph(),
    ]);

    const name = clean(profile?.name);
    if (!name) return { title: t("blog.userNotFound"), robots: { index: false, follow: true } };

    const bio = clean(profile?.bio);
    const description =
        bio && bio.length > 160 ? `${bio.slice(0, 157).trimEnd()}…` : bio ?? t("blog.userSeoDescription", { name, siteName: seo.siteName });
    const photo = clean(profile?.photoURL);

    // The site owner's own member page stays out of search results: /profile is the one page about them
    const isOwner = await getAdminUids()
        .then((ids) => ids.has(id))
        .catch(() => false);

    return {
        title: name,
        description,
        ...(isOwner ? { robots: { index: false, follow: true } } : {}),
        openGraph: { ...openGraph, type: "profile", ...(photo ? { images: [{ url: photo, alt: name }] } : {}) },
    };
}

export default function UserLayout({ children }: { children: ReactNode }) {
    return children;
}
