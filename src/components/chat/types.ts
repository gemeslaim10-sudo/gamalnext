export type { PublicChatConfig } from "@/lib/ai/assistant/shared";

export type Message = {
    role: "user" | "model";
    text: string;
    isError?: boolean;
};

export type UserContext = {
    /** "Guest" until a signed-in user's profile loads */
    name: string;
    uid?: string;
    phone?: string;
};
