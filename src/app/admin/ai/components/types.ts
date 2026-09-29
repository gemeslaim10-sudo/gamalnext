import type { AiSettingsData } from "../useAiSettings";

export interface SectionProps {
    formData: AiSettingsData;
    update: <K extends keyof AiSettingsData>(key: K, value: AiSettingsData[K]) => void;
}
