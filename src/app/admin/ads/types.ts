export interface Ad {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    whatsappMessage: string;
    whatsappNumber: string;
    active: boolean;
    showInSidebar: boolean;
    showInFeed: boolean;
    createdAt?: unknown;
}

export const EMPTY_FORM: Omit<Ad, "id" | "createdAt"> = {
    title: "",
    description: "",
    imageUrl: "",
    whatsappMessage: "",
    whatsappNumber: "201024531452",
    active: true,
    showInSidebar: true,
    showInFeed: false,
};
