import type { Metadata } from "next";
import { getCopy } from "@/lib/copy/server";
import SettingsClientPage from "./SettingsClientPage";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getCopy();
    return {
        title: t("account.settingsSeoTitle"),
        description: t("account.settingsSeoDescription"),
        // A private page: only the signed-in user sees their settings
        robots: { index: false, follow: false },
    };
}

export default function Page() {
    return <SettingsClientPage />;
}
