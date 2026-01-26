import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import ChatWrapper from "@/components/chat/ChatWrapper";
import { Toaster } from "react-hot-toast";
import Script from 'next/script';
import GlobalErrorListener from '@/components/providers/GlobalErrorListener';
import "./globals.css";


const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "600", "700", "900"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: {
    default: "جمال عبد العاطي | SEO Optimization & Data Analyst",
    template: "%s | جمال عبد العاطي"
  },
  description: "محلل بيانات وخبير تحسين محركات البحث (SEO). متخصص في تطوير المتاجر الإلكترونية (WordPress & Shopify) وصناعة حلول البيانات الذكية.",
  keywords: [
    "جمال تك", "gamaltech", "gamal teck", "جمال ويب", "جمال مواقع ويب",
    "جمال seo", "seo", "websites", "ازاي اعمل ويبسايت", "خدمات مواقع",
    "جمال عبد العاطي", "جمال سليم", "مقالات seo", "كيفية عمل google ads",
    "جمال عبد العاطي ويب", "جمال تحليل بيانات", "جمال cms", "SEO Optimization",
    "Data Analyst", "WordPress Developer", "Shopify Expert", "تصدر نتائج البحث",
    "تحسين سرعة المواقع", "إدارة متاجر ووردبريس", "تحليل المنافسين", "أرشفة جوجل"
  ],
  authors: [{ name: "جمال عبد العاطي", url: "https://gamaltech.info" }],
  creator: "جمال عبد العاطي",
  publisher: "جمال عبد العاطي",
  metadataBase: new URL('https://gamaltech.info'),
  alternates: {
    canonical: './',
  },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "https://gamaltech.info",
    siteName: "جمال عبد العاطي - Portfolio",
    title: "جمال عبد العاطي | SEO Optimization & Data Analyst",
    description: "محلل بيانات وخبير تحسين محركات البحث (SEO). تطوير المتاجر وحلول البيانات.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "جمال عبد العاطي - SEO & Data Analyst",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "جمال عبد العاطي | SEO Optimization & Data Analyst",
    description: "محلل بيانات وخبير تحسين محركات البحث (SEO).",
    images: ["/og-image.png"],
    creator: "@gamaldev", // Update with your Twitter handle if you have one
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  verification: {
    google: 'scBJmQaizROXeIHuHxdAHnAL2C6KZFyrUYDIUEuhNps',
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
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Person",
                "name": "جمال عبد العاطي",
                "alternateName": ["جمال تك", "Gamal Tech", "جمال سليم", "جمال ويب"],
                "url": "https://gamaltech.info",
                "jobTitle": "SEO Optimization & Data Analyst",
                "sameAs": [
                  // Add your real social media links here:
                  // "https://github.com/your-username",
                  // "https://linkedin.com/in/your-username"
                ]
              })
            }}
          />
          <GlobalErrorListener />
          {children}
          <ChatWrapper />
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
