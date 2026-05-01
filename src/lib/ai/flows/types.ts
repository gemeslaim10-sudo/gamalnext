
import type { ChatMessage } from "../utils/failoverManager";

export type BasePersona = 'SALES' | 'INTIMATE' | 'TROLL';

export interface FlowDefinition {
    id: string;
    priority: number; // Lower number means higher priority (checked first)
    basePersona: BasePersona;
    keywords?: string[]; // If provided, simple keyword matching is used
    match?: (message: string, historyText: string, historyLength: number, userName?: string) => boolean; // Advanced matching
    getPrompt: (userName?: string) => string;
}
