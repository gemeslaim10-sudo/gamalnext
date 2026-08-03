import { NextResponse } from "next/server";
import { getAiConfig } from "@/lib/ai/config";
import { AiAgent } from "@/lib/ai/agent";

export const dynamic = 'force-dynamic';

/**
 * Clean, Evolvable AI Gateway
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message, history, userContext, sessionId } = body;

        // 1. Load Dynamic Config
        const config = await getAiConfig();
        const apiKey = config.geminiKey;

        if (!apiKey) {
            return NextResponse.json({ error: "Missing Gemini API Key." }, { status: 500 });
        }

        // 2. Initialize Agent Orchestrator
        const agent = new AiAgent(apiKey, config);

        // 3. Run Agent Execution Flow
        const result = await agent.run(message, history, userContext, sessionId);

        if (result.error) {
            return NextResponse.json(result, { status: 500 });
        }

        return NextResponse.json(result);

    } catch (error: unknown) {
        console.error("Gateway Critical Error:", error);
        return NextResponse.json({ error: "Site intelligence currently unavailable." }, { status: 500 });
    }
}
