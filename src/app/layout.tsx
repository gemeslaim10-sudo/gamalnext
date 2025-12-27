import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import AiChatWidget from "@/components/AiChatWidget";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "600", "700", "900"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "Gamal Abdel Aty | Data & Web Specialist",
  description: "محلل بيانات & مطور ويب مدعوم بالذكاء الاصطناعي. أحول البيانات المعقدة إلى رؤى واضحة، وأبني مواقع ويب ديناميكية تتحدث مع قواعد البيانات وتفهم العملاء.",
  keywords: ["طوير ويب", "تحليل بيانات", "Next.js", "React", "Gemini AI", "Egypt", "Freelance", "جمال عبد العاطي"],
  authors: [{ name: "Gamal Abdel Aty" }],
  openGraph: {
    title: "Gamal Abdel Aty | Data & Web Specialist",
    description: "محلل بيانات & مطور ويب مدعوم بالذكاء الاصطناعي.",
    type: "website",
    locale: "ar_EG",
  },
  icons: {
    icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjM2I4MmY2IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBvbHlsaW5lIHBvaW50cz0iMTYgMTggMjIgMTIgMTYgNiIvPjxwb2x5bGluZSBwb2ludHM9IjggNiAyIDEyIDggMTgiLz48L3N2Zz4=",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} font-sans bg-slate-950 text-slate-200 antialiased`}>
        <AuthProvider>
          {children}
          <AiChatWidget />
          <Toaster position="bottom-center" toastOptions={{
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid #334155',
            },
          }} />
        </AuthProvider>
      </body>
    </html>
  );
}
