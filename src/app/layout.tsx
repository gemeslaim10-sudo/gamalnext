import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import GlobalErrorListener from '@/components/providers/GlobalErrorListener';
import SiteShell from '@/components/layout/SiteShell';
import { BrandingProvider, BrandingSettings } from '@/components/providers/BrandingProvider';
import { CopyProvider } from '@/components/providers/CopyProvider';
import { SITE_URL } from '@/lib/constants';
import { getCopy, getSiteCopy } from '@/lib/copy/server';
import { FALLBACK_OWNER_NAME, FALLBACK_SITE_NAME, clean, getSiteOpenGraph, getSiteSeo, getSiteSettings } from '@/lib/seo/server';
import "./globals.css";


// Pages are rebuilt with fresh dashboard content at most every 60 seconds. Saving in the
// dashboard also refreshes them immediately (see src/app/api/revalidate).
export const revalidate = 60;

// Cairo is a variable font, so one file covers every weight the design uses (400–700)
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

// Site-wide SEO, editable in the dashboard (Settings + /admin/copy → SEO). Pages override it with their own.
export async function generateMetadata(): Promise<Metadata> {
  const [seo, openGraph] = await Promise.all([getSiteSeo(), getSiteOpenGraph()]);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: seo.defaultTitle,
      template: seo.titleTemplate,
    },
    description: seo.description,
    keywords: seo.keywords.length > 0 ? seo.keywords : undefined,
    applicationName: seo.siteName,
    authors: [{ name: seo.ownerName, url: SITE_URL }],
    creator: seo.ownerName,
    publisher: seo.siteName,
    alternates: {
      canonical: './',
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
    verification: {
      google: 'scBJmQaizROXeIHuHxdAHnAL2C6KZFyrUYDIUEuhNps',
    },
  };
}

/** Structured data for Google: the company (GTech), its founder and the website. */
function buildJsonLd(branding: BrandingSettings | null, seoDescription: string | undefined) {
  const siteName = clean(branding?.siteName) ?? FALLBACK_SITE_NAME;
  const organizationId = `${SITE_URL}/#organization`;
  const personId = `${SITE_URL}/#person`;
  const sameAs = [clean(branding?.githubUrl), clean(branding?.linkedinUrl)].filter(Boolean);
  const knowsAbout = (clean(branding?.ownerBadges) ?? "")
    .split(",")
    .map((badge) => badge.trim())
    .filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteName,
        url: SITE_URL,
        logo: `${SITE_URL}/icon.png`,
        description: clean(branding?.siteDescription) ?? seoDescription,
        founder: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: clean(branding?.ownerName) ?? FALLBACK_OWNER_NAME,
        url: `${SITE_URL}/profile`,
        jobTitle: clean(branding?.ownerTitle),
        image: clean(branding?.siteLogo),
        worksFor: { "@id": organizationId },
        knowsAbout: knowsAbout.length > 0 ? knowsAbout : undefined,
        sameAs: sameAs.length > 0 ? sameAs : undefined,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: siteName,
        description: seoDescription,
        inLanguage: "en",
        publisher: { "@id": organizationId },
      },
    ],
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch branding settings and site texts on the server, so the first paint already has real content
  const [branding, copy, t] = await Promise.all([getSiteSettings(), getSiteCopy(), getCopy()]);
  const siteName = clean(branding?.siteName) ?? FALLBACK_SITE_NAME;
  const jsonLd = buildJsonLd(branding, clean(t("seo.description", { siteName })));

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={`${cairo.variable} flex min-h-dvh flex-col font-sans`} suppressHydrationWarning>
        <AuthProvider>
          <script
            type="application/ld+json"
            // "<" is escaped so text from the dashboard can never close the script tag
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
          />
          <GlobalErrorListener />
          <BrandingProvider initialBranding={branding}>
            <CopyProvider values={copy}>
              <SiteShell>{children}</SiteShell>
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
