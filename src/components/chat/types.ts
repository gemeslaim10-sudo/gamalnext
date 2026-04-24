export type Message = {
    role: 'user' | 'model';
    text: string;
};

export type UserContext = {
    name: string;
    gender: string;
};
