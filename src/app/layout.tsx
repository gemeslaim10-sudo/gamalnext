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
    default: "جمال تك | مطور باك اند وخدمات DevOps واستضافة | Gamal Tech",
    template: "%s | Gamal Tech"
  },
  description: "جمال تك - خبير في عمل باك اند، إنشاء باك اند، تقديم خدمات باك اند وDevOps، خدمات استضافة، إدارة مواقع، وإدارة وحماية قواعد البيانات. Gamal Tech: Backend Developer & DevOps Expert.",
  keywords: [
    // ── Arabic Target Keywords ──────────────────────────────────────
    "عمل باك اند",
    "انشاء باك اند",
    "تقديم خدمات باك اند",
    "خدمات باك اند وdev ops",
    "خدمات باك اند و DevOps",
    "مطور باك اند",
    "خدمات استضافة",
    "خدمات ادارة مواقع",
    "ادارة مواقع",
    "خدمات ادارة وحماية قواعد البيانات",
    "ادارة قواعد البيانات",
    "حماية قواعد البيانات",
    "جمال تك",
    "باك اند",
    "باك اند سيرفر",
    "تطوير الباك اند",
    "برمجة باك اند",
    "DevOps عربي",
    "استضافة مواقع",
    "خدمات سيرفر",
    "مطور ويب",
    "برمجة مواقع",
    // ── English Target Keywords ─────────────────────────────────────
    "Gamal Tech",
    "gamaltech",
    "Gamal Abdelaty",
    "Backend Developer",
    "Backend Development",
    "Build Backend",
    "Create Backend",
    "Backend Services",
    "DevOps Services",
    "Backend and DevOps",
    "Hosting Services",
    "Website Management",
    "Database Management",
    "Database Security",
    "Web Development",
    "E-commerce Development",
    "WhatsApp API",
    "WordPress Management",
    "Shopify Stores",
    "Node.js Developer",
    "Firebase Expert",
    "Cloud Hosting",
    "VPS Management"
  ],
  authors: [{ name: "Gamal Abdelaty", url: "https://gamaltech.info" }],
  creator: "Gamal Abdelaty | جمال عبد العاطي",
  publisher: "Gamal Tech | جمال تك",
  metadataBase: new URL('https://gamaltech.info'),
  alternates: {
    canonical: 'https://gamaltech.info',
  },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "https://gamaltech.info",
    siteName: "Gamal Tech | جمال تك",
    title: "جمال تك | مطور باك اند وخدمات DevOps واستضافة | Gamal Tech",
    description: "خبير في عمل باك اند، إنشاء باك اند، خدمات DevOps، استضافة مواقع، وإدارة وحماية قواعد البيانات. Gamal Tech Backend & DevOps Expert.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gamal Tech - مطور باك اند وخدمات DevOps",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "جمال تك | مطور باك اند وخدمات DevOps | Gamal Tech",
    description: "خبير في عمل باك اند، إنشاء باك اند، خدمات DevOps، استضافة مواقع، وإدارة وحماية قواعد البيانات.",
    images: ["/og-image.png"],
    creator: "@gamaldev",
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
    <html lang="ar" dir="ltr" suppressHydrationWarning>
      {/* Dynamic favicon from dashboard — overrides static metadata.icons */}
      {branding?.siteFavicon && (
        <head>
          <link rel="icon" href={branding.siteFavicon} />
          <link rel="shortcut icon" href={branding.siteFavicon} />
          <link rel="apple-touch-icon" href={branding.siteFavicon} />
        </head>
      )}
      <body className={`${cairo.variable} font-sans bg-slate-950 text-slate-200 antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ProfessionalService",
                "name": branding?.siteName || "Gamal Tech | جمال تك",
                "alternateName": ["جمال تك", "Gamal Tech", "gamaltech", branding?.ownerName || "Gamal Abdelaty"],
                "url": "https://gamaltech.info",
                "logo": branding?.siteLogo || "https://gamaltech.info/icon.png",
                "image": branding?.siteLogo || "https://gamaltech.info/og-image.png",
                "description": "خبير في عمل باك اند، إنشاء باك اند، تقديم خدمات باك اند وDevOps، خدمات استضافة، إدارة مواقع، وإدارة وحماية قواعد البيانات",
                "founder": {
                  "@type": "Person",
                  "name": branding?.ownerName || "Gamal Abdelaty",
                  "jobTitle": "Backend Developer & DevOps Engineer | مطور باك اند",
                  "url": "https://gamaltech.info",
                  "image": branding?.siteLogo || undefined,
                  "sameAs": [
                    branding?.githubUrl,
                    branding?.linkedinUrl,
                  ].filter(Boolean)
                },
                "hasOfferCatalog": {
                  "@type": "OfferCatalog",
                  "name": "خدمات جمال تك",
                  "itemListElement": [
                    {
                      "@type": "Offer",
                      "itemOffered": {
                        "@type": "Service",
                        "name": "عمل باك اند وإنشاء باك اند",
                        "description": "تصميم وتطوير خوادم Backend احترافية باستخدام أحدث التقنيات"
                      }
                    },
                    {
                      "@type": "Offer",
                      "itemOffered": {
                        "@type": "Service",
                        "name": "خدمات باك اند وDevOps",
                        "description": "تقديم خدمات باك اند متكاملة مع إدارة البنية التحتية وتطبيق DevOps"
                      }
                    },
                    {
                      "@type": "Offer",
                      "itemOffered": {
                        "@type": "Service",
                        "name": "خدمات استضافة مواقع",
                        "description": "خدمات استضافة احترافية وإدارة سيرفرات VPS وCloud"
                      }
                    },
                    {
                      "@type": "Offer",
                      "itemOffered": {
                        "@type": "Service",
                        "name": "خدمات إدارة مواقع",
                        "description": "إدارة وصيانة المواقع الإلكترونية وضمان استمراريتها"
                      }
                    },
                    {
                      "@type": "Offer",
                      "itemOffered": {
                        "@type": "Service",
                        "name": "إدارة وحماية قواعد البيانات",
                        "description": "إدارة وتأمين قواعد البيانات وحمايتها من الاختراقات"
                      }
                    }
                  ]
                },
                "areaServed": "Worldwide",
                "availableLanguage": ["Arabic", "English"]
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
          <div className="print:hidden">
            <ChatWrapper />
            <WhatsAppFloat />
          </div>
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
