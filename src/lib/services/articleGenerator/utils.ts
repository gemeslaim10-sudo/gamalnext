export const parseJsonFromLLM = (text: string) => {
    try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : text;
        return JSON.parse(jsonStr);
    } catch (e) {
        return null;
    }
};

export const cleanText = (text: string) => {
    if (!text) return "";
    let cleaned = text.replace(/[^\u0600-\u06FFa-zA-Z0-9\s.,!?:;"'()[\]{}\-_@%&\/=+~]/g, " ");
    cleaned = cleaned.replace(/ +/g, " ");
    return cleaned.trim();
};
