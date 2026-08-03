export type Message = {
    role: 'user' | 'model';
    text: string;
    isError?: boolean;
};

export type UserContext = {
    name: string;
    gender: string;
    uid?: string;
    phone?: string;
    email?: string;
};
