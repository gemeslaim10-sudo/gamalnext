import { Metadata } from "next";
import WriteClientPage from "./WriteClientPage";

export const metadata: Metadata = {
    title: "كتابة مقال جديد | جمال تك",
    description: "شارك خبراتك ومعرفتك. اكتب مقالات تقنية وانشرها على جمال تك.",
    alternates: {
        canonical: './',
    },
};

export default function Page() {
    return <WriteClientPage />;
}
