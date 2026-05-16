export interface AiConfig {
    modelName?: string;
    groqKey?: string;
    openRouterKey?: string;
    openaiKey?: string;
    huggingfaceKey?: string;
}

export interface UserContext {
    name?: string;
    uid?: string;
    phone?: string;
    email?: string;
    gender?: string;
    [key: string]: unknown;
}

export interface ToolResponse {
    functionResponse: {
        name: string;
        response: { result: unknown };
    };
}
