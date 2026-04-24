import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import ChatWrapper from "@/components/chat/ChatWrapper";
import { Toaster } from "react-hot-toast";
import GlobalErrorListener from '@/components/providers/GlobalErrorListener';
import GlobalSidebar from '@/components/layout/GlobalSidebar';
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import { BrandingProvider, BrandingSettings } from '@/components/providers/BrandingProvider';
import { getDocument } from '@/lib/server-utils';
import "./globals.css";


const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "600", "700", "900"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: {
    default: "Gamal Abdelaty | Web Developer & E-commerce Expert",
    template: "%s | Gamal Abdelaty"
  },
  description: "Expert in building websites, e-commerce stores, WhatsApp API integration. Specializing in WordPress and Shopify.",
  keywords: [
    "Gamal Tech", "gamaltech", "Gamal Web", "Web Development",
    "Website Creation", "E-commerce Development", "WhatsApp API", "WordPress Management", "Shopify Stores",
    "Gamal Abdelaty", "Web Developer", "E-commerce Stores",
    "Dynamic Websites", "Web Design", "Store Programming", "WhatsApp Business"
  ],
  authors: [{ name: "Gamal Abdelaty", url: "https://gamaltech.info" }],
  creator: "Gamal Abdelaty",
  publisher: "Gamal Abdelaty",
  metadataBase: new URL('https://gamaltech.info'),
  alternates: {
    canonical: './',
  },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "https://gamaltech.info",
    siteName: "Gamal Abdelaty - Portfolio",
    title: "Gamal Abdelaty | Web Developer & E-commerce Expert",
    description: "Expert in Web Development, E-commerce (WordPress & Shopify), and WhatsApp API solutions.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gamal Abdelaty - Web Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gamal Abdelaty | Web Developer & E-commerce Expert",
    description: "Expert in Web Development, E-commerce (WordPress & Shopify), and WhatsApp API solutions.",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch branding settings on the server
  let branding = await getDocument<BrandingSettings>("site_content", "settings");
  if (!branding) {
      branding = await getDocument<BrandingSettings>("site_content", "hero") || null;
  }

  return (
    <html lang="en" dir="ltr">
      <body className={`${cairo.variable} font-sans bg-slate-950 text-slate-200 antialiased`}>
        <AuthProvider>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Person",
                "name": "Gamal Abdelaty",
                "alternateName": ["Gamal Tech", "Gamal Web"],
                "url": "https://gamaltech.info",
                "jobTitle": "Web Developer & E-commerce Expert",
                "sameAs": [
                  // Add your real social media links here:
                  // "https://github.com/your-username",
                  // "https://linkedin.com/in/your-username"
                ]
              })
            }}
          />
          <GlobalErrorListener />
          <BrandingProvider initialBranding={branding}>
            <div className="flex min-h-screen w-full relative">
              <GlobalSidebar />
              <main className="flex-1 min-w-0 flex flex-col">
                {children}
              </main>
            </div>
          </BrandingProvider>
          <ChatWrapper />
          <WhatsAppFloat />
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
