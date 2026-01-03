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
  title: {
    default: "جمال عبد العاطي | Full Stack Web Developer & SEO Specialist",
    template: "%s | جمال عبد العاطي"
  },
  description: "مطور تطبيقات ومواقع ويب متخصص في Next.js و React. تطوير حلول Web Applications متكاملة وتنفيذ استراتيجيات SEO لتعزيز الظهور الرقمي.",
  keywords: ["تطوير ويب", "Full Stack Developer", "Next.js", "React", "SEO Specialist", "تطوير تطبيقات", "مطور مواقع", "جمال عبد العاطي", "Web Developer Egypt", "مطور ويب"],
  authors: [{ name: "جمال عبد العاطي", url: "https://gamal-dev.com" }],
  creator: "جمال عبد العاطي",
  publisher: "جمال عبد العاطي",
  metadataBase: new URL('https://gamal-dev.com'), // Update with your actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "https://gamal-dev.com",
    siteName: "جمال عبد العاطي - Portfolio",
    title: "جمال عبد العاطي | Full Stack Web Developer & SEO Specialist",
    description: "مطور تطبيقات ومواقع ويب متخصص في Next.js و React. تطوير حلول Web Applications متكاملة.",
    images: [
      {
        url: "/og-image.png", // We'll create this
        width: 1200,
        height: 630,
        alt: "جمال عبد العاطي - Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "جمال عبد العاطي | Full Stack Web Developer & SEO Specialist",
    description: "مطور تطبيقات ومواقع ويب متخصص في Next.js و React.",
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
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  verification: {
    // google: 'your-google-verification-code', // Add when you get it from Search Console
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
