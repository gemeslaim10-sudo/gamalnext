import type { Metadata } from "next";
import { getCopy } from "@/lib/copy/server";
import EditPostClientPage from "./EditPostClientPage";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getCopy();
    return {
        title: t("account.editSeoTitle"),
        // A private page: only the post's author (or an admin) can use it
        robots: { index: false, follow: false },
    };
}

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <EditPostClientPage id={id} />;
}
