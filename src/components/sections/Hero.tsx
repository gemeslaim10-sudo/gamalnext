import { getHero } from "@/lib/content/server";
import HeroClient from "./HeroClient";

/** Reads the hero on the server (cached) so the first paint already has the real text (defaults only if the read fails). */
export default async function Hero() {
    return <HeroClient hero={await getHero()} />;
}
