import { FormEvent } from 'react';
import { useContent } from '@/hooks/useContent';

const defaultContactData = {
    whatsappNumber: "201024531452",
    phoneDisplay: "01024531452",
    phoneAlt: "01105432048",
    emailPrimary: "montasrrm@gmail.com",
    emailSecondary: "gemeslaim10@gmail.com",
    location: "Nasr City, Egypt"
};

export function useContact() {
    const { data } = useContent("site_content", "contact", defaultContactData);
    const contact = data || defaultContactData;

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const nameInput = form.elements.namedItem('name') as HTMLInputElement;
        const msgInput = form.elements.namedItem('message') as HTMLTextAreaElement;

        const name = nameInput.value;
        const msg = msgInput.value;
        const text = `*New message from website*%0A*Name:* ${name}%0A*Message:* ${msg}`;
        window.open(`https://wa.me/${contact.whatsappNumber}?text=${text}`, '_blank');
    };

    return {
        contact,
        handleSubmit
    };
}
