import { Providers } from "@/Redux/provider";
import "./globals.css";
import { NextuiProviderWrapper } from "./Nextuiprovider";
import Script from "next/script";
import ConsentGTM from "@/components/Seo/ConsentGTM";
import { ToastProvider } from "@/components/ui/toast-provider";
import { Suspense } from "react";
import VillaCampLoader from "@/components/Loadercomponents/VillaCampLoader";
import WebPermissionsPrompt from "@/components/Permissions/web-permissions-prompt";
import { Inter } from "next/font/google";
import { LONAVALA_CORE_KEYWORDS, getSiteUrl } from "@/lib/lonavalaSeo";

const geist = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

const SITE_URL = getSiteUrl();

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Villas in Lonavala | Holiday Homes, Bungalows & Pool Villas Under ₹5K–₹15K | ThevillaCamp",
    template: "%s | ThevillaCamp",
  },
  description:
    "Book verified holiday homes, private pool villas, homestays, and bungalows on rent in Lonavala, Khandala, Malavli, Karjat & Alibaug. Compare villas in Lonavala under ₹5K, ₹10K & ₹15K per night plus Pawna Lake camping with direct host rates.",
  keywords: LONAVALA_CORE_KEYWORDS,
  authors: [{ name: "ThevillaCamp", url: SITE_URL }],
  creator: "ThevillaCamp",
  publisher: "ThevillaCamp",
  category: "travel",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  openGraph: {
    title: "Villas in Lonavala | Holiday Homes & Pool Villas Under ₹5K–₹15K | ThevillaCamp",
    description:
      "Find and book 150+ verified holiday homes, private pool villas & bungalows in Lonavala (under ₹5K, ₹10K & ₹15K), Pawna Lake camping tents, and mountain cottages across Maharashtra with direct host rates.",
    url: SITE_URL,
    siteName: "ThevillaCamp",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "ThevillaCamp Villas in Lonavala and Lakeside Camping",
      },
    ],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    site: "@Thevillacamp",
    creator: "@Thevillacamp",
    title: "Villas in Lonavala | Holiday Homes & Pool Villas Under ₹5K–₹15K | ThevillaCamp",
    description:
      "Book verified holiday homes & private pool villas in Lonavala starting under ₹5K, ₹10K & ₹15K, plus Pawna Lake camping and mountain cottages.",
    images: ["/og-default.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: "./",
    languages: {
      "en-IN": "/",
      "en-US": "/",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ThevillaCamp",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({ children }) {
  const appTree = (
    <Providers>
      <ConsentGTM
        gtmId={GTM_ID}
        measurementId={
          process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID ||
          process.env.GA4_MEASUREMENT_ID
        }
      />
      <Suspense
        fallback={
          <div className="min-h-screen bg-white w-full flex items-center justify-center">
            <VillaCampLoader size={120} logoColor="#111827" accentColor="#ff6900" />
          </div>
        }
      >
        <NextuiProviderWrapper>
          <ToastProvider>
            <WebPermissionsPrompt />
            {children}
          </ToastProvider>
        </NextuiProviderWrapper>
      </Suspense>
    </Providers>
  );

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="facebook-domain-verification"
          content="q89x1g0ggkospch09m8qefrsq4hs37"
        />
        {process.env.GOOGLE_SITE_VERIFICATION ? (
          <meta
            name="google-site-verification"
            content={process.env.GOOGLE_SITE_VERIFICATION}
          />
        ) : null}
        {process.env.BING_SITE_VERIFICATION ? (
          <meta
            name="msvalidate.01"
            content={process.env.BING_SITE_VERIFICATION}
          />
        ) : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${SITE_URL}/#organization`,
                  "name": "ThevillaCamp",
                  "url": SITE_URL,
                  "logo": `${SITE_URL}/og-default.jpg`,
                  "sameAs": [
                    "https://www.instagram.com/thevillacamp/",
                    "https://www.youtube.com/@Thevillacamp",
                    "https://www.facebook.com/profile.php?id=61594403481188",
                    "https://x.com/Thevillacamp"
                  ],
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+91-8669186483",
                    "contactType": "customer service",
                    "areaServed": "IN",
                    "availableLanguage": ["English", "Hindi", "Marathi"],
                  },
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Apti, Pavananagar, Mawal",
                    "addressLocality": "Lonavala",
                    "addressRegion": "Maharashtra",
                    "postalCode": "410401",
                    "addressCountry": "IN",
                  },
                },
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  "url": SITE_URL,
                  "name": "ThevillaCamp",
                  "description":
                    "Book verified holiday homes, private pool villas & bungalows on rent in Lonavala (under ₹5K, ₹10K & ₹15K), Pawna Lake camping, and luxury homestays across Maharashtra.",
                  "publisher": {
                    "@id": `${SITE_URL}/#organization`,
                  },
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target":
                      `${SITE_URL}/category/all?search={search_term_string}`,
                    "query-input": "required name=search_term_string",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <body className={geist.className} suppressHydrationWarning>
        {appTree}
      </body>
    </html>
  );
}
