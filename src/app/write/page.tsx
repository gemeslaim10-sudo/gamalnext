import type { Metadata } from "next";
import { getCopy } from "@/lib/copy/server";
import WriteClientPage from "./WriteClientPage";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getCopy();
    return {
        title: t("account.writeSeoTitle"),
        description: t("account.writeSeoDescription"),
        alternates: {
            canonical: "./",
        },
        // Only useful to signed-in members (robots.txt already disallows /write)
        robots: { index: false, follow: false },
    };
}

export default function Page() {
    return <WriteClientPage />;
}
