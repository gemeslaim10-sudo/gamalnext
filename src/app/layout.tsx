import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { preconnect } from "react-dom";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import GlobalErrorListener from '@/components/providers/GlobalErrorListener';
import SiteShell from '@/components/layout/SiteShell';
import { BrandingProvider } from '@/components/providers/BrandingProvider';
import { CopyProvider } from '@/components/providers/CopyProvider';
import { JsonLd } from '@/components/seo/JsonLd';
import { SITE_URL } from '@/lib/constants';
import { getSiteCopy } from '@/lib/copy/server';
import { getLeadCaptureSettings } from '@/lib/content/server';
import { getPublicChatConfig } from '@/lib/ai/assistant/settings';
import { getSiteOpenGraph, getSiteSeo, getSiteSettings } from '@/lib/seo/server';
import { siteGraph } from '@/lib/seo/structured-data';
import "./globals.css";

// No time-based refresh: pages and their data stay cached until the dashboard saves something or
// the owner presses "Clear cache" (src/app/api/revalidate), so every visit is served instantly.

// Cairo is a variable font, so one file covers every weight the design uses (400–700)
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

// Site-wide SEO from the dashboard (/admin/seo + Settings). Pages add their own title, description and card.
export async function generateMetadata(): Promise<Metadata> {
  const [seo, openGraph] = await Promise.all([getSiteSeo(), getSiteOpenGraph()]);
  const { verification } = seo.seo;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: seo.defaultTitle,
      template: seo.titleTemplate,
    },
    description: seo.homeDescription,
    keywords: seo.homeKeywords.length > 0 ? seo.homeKeywords : undefined,
    applicationName: seo.siteName,
    authors: [{ name: seo.ownerName, url: `${SITE_URL}/profile` }],
    creator: seo.ownerName,
    publisher: seo.businessName,
    alternates: {
      canonical: './',
      types: { "application/rss+xml": [{ url: "/rss.xml", title: `${seo.siteName} articles` }] },
    },
    // Without a title/description here, shared links show each page's own (the site title on the home page)
    openGraph,
    // Title, description and image follow each page's Open Graph data
    twitter: {
      card: "summary_large_image",
      creator: seo.twitterHandle,
      site: seo.twitterHandle,
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
        { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
        { url: "/icon.png", type: "image/png", sizes: "192x192" },
      ],
      apple: [
        { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
    // Search Console / Bing Webmaster / Yandex ownership codes (/admin/seo → Indexing)
    verification: {
      google: verification.google.trim() || undefined,
      yandex: verification.yandex.trim() || undefined,
      other: verification.bing.trim() ? { "msvalidate.01": verification.bing.trim() } : undefined,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Images come from Cloudinary: open the connection while the HTML is still arriving
  preconnect("https://res.cloudinary.com");

  // Everything the frame needs is read on the server (and cached), so the first paint is complete
  // and the browser makes no database requests for it
  const [branding, copy, leadCapture, chatConfig, graph] = await Promise.all([
    getSiteSettings(),
    getSiteCopy(),
    getLeadCaptureSettings(),
    getPublicChatConfig(),
    siteGraph(),
  ]);

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={`${cairo.variable} flex min-h-dvh flex-col font-sans`} suppressHydrationWarning>
        <AuthProvider>
          <JsonLd data={graph} />
          <GlobalErrorListener />
          <BrandingProvider initialBranding={branding}>
            <CopyProvider values={copy}>
              <SiteShell leadCapture={leadCapture} chatConfig={chatConfig.fallback ? null : chatConfig}>
                {children}
              </SiteShell>
            </CopyProvider>
          </BrandingProvider>
          <Toaster position="bottom-center" toastOptions={{
            style: {
              background: 'var(--color-surface)',
              color: 'var(--color-foreground)',
              border: '1px solid var(--color-border)',
              fontSize: '14px',
            },
          }} />
        </AuthProvider>
      </body>
    </html>
  );
}
