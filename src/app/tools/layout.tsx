import { Metadata } from "next";
import ToolsClientLayout from "./ToolsClientLayout";

export const metadata: Metadata = {
    title: "الأدوات الذكية | جمال عبد العاطي",
    description: "مجموعة من الأدوات الرقمية المجانية: تحويل نصوص، تحميل من يوتيوب، أدوات ميديا، والمزيد.",
    alternates: {
        canonical: './',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <ToolsClientLayout>{children}</ToolsClientLayout>;
}
