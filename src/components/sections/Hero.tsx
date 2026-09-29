import { getDocument } from "@/lib/server-utils";
import HeroClient from "./HeroClient";
import { defaultHeroData, type HeroData } from "./hero/HeroConfig";

/** Reads the hero on the server so the first paint already has the real text (defaults only if the read fails). */
export default async function Hero() {
    const hero = await getDocument<HeroData>("site_content", "hero");
    return <HeroClient hero={hero ?? defaultHeroData} />;
}
