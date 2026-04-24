import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import ChatWrapper from "@/components/chat/ChatWrapper";
import { Toaster } from "react-hot-toast";
import Script from 'next/script';
import GlobalErrorListener from '@/components/providers/GlobalErrorListener';
import GlobalSidebar from '@/components/layout/GlobalSidebar';
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
          {/* Global Floating WhatsApp — visible on every page */}
          <a
            href="https://wa.me/201024531452"
            target="_blank"
            rel="noopener noreferrer"
            style={{ zIndex: 9998 }}
            className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:bg-[#20bd5a] hover:scale-110 transition-all duration-300 border-2 border-slate-900 group flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            <span className="absolute right-full mr-4 bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none border border-slate-700 shadow-xl hidden md:block translate-x-4 group-hover:-translate-x-2">
              Let&apos;s Chat! 🚀
            </span>
          </a>
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
