import { Metadata } from "next";
import ToolsClientLayout from "./ToolsClientLayout";

export const metadata: Metadata = {
    title: "أدوات مساعدة | جمال عبد العاطي",
    description: "مجموعة من الأدوات المجانية لتسهيل أعمال الويب والمتاجر الإلكترونية.",
    alternates: {
        canonical: './',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <ToolsClientLayout>{children}</ToolsClientLayout>;
}
