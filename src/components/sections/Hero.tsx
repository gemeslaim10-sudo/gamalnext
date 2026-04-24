import { getDocument } from "@/lib/server-utils";
import HeroClient from "./HeroClient";
import type { HeroData } from "./hero/HeroConfig";

export default async function Hero() {
    // Fetch hero content on the server side
    const heroData = await getDocument<HeroData>("site_content", "hero");

    return <HeroClient initialData={heroData || undefined} />;
}
