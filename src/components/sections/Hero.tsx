import { getDocument } from "@/lib/server-utils";
import HeroClient from "./HeroClient";

export default async function Hero() {
    // Fetch hero content on the server side
    const heroData = await getDocument("site_content", "hero");

    return <HeroClient initialData={heroData} />;
}
