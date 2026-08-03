import { Metadata } from "next";
import AdminClientLayout from "./AdminClientLayout";

export const metadata: Metadata = {
    title: "لوحة التحكم | جمال تك",
    robots: {
        index: false,
        follow: false,
    },
    alternates: {
        canonical: './',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <AdminClientLayout>{children}</AdminClientLayout>;
}
