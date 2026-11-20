import { Providers } from "@/Redux/provider";
import "./globals.css";
import { NextuiProviderWrapper } from "./Nextuiprovider";
import Script from "next/script";
import ConsentGTM from "@/components/Seo/ConsentGTM";
import { ToastProvider } from "@/components/ui/toast-provider";
import { Suspense } from "react";
import ButtonLoader from "@/components/Loadercomponents/button-loader";
import WebPermissionsPrompt from "@/components/Permissions/web-permissions-prompt";
import { Inter } from "next/font/google";

const geist = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://thevillacamp.in";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ThevillaCamp | Luxury Pool Villas, Pawna Lake Camping & Cottages in Lonavala",
    template: "%s | ThevillaCamp",
  },
  description:
    "Book handpicked luxury private pool villas, waterfront Pawna Lake camping, and serene mountain cottages in Lonavala, Malavli, and Karjat. 100% verified stays, private pools, 24/7 concierge, and guaranteed direct host rates.",
  keywords: [
    "luxury villas in lonavala",
    "private pool villas lonavala",
    "pawna lake camping",
    "lakeside camping pawna",
    "villas in malavli",
    "cottages in lonavala",
    "glamping pawna lake",
    "weekend getaways from mumbai",
    "weekend getaways from pune",
    "family villas lonavala",
    "pet friendly villas lonavala",
    "kamshet stays",
    "karjat pool villas",
    "thevillacamp",
    "lonavala staycation",
  ],
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
    title: "ThevillaCamp | Handpicked Luxury Villas & Lakeside Camping in Lonavala",
    description:
      "Find and book 150+ verified private pool villas, Pawna Lake camping tents, and mountain chalets across Maharashtra. Direct booking with 24/7 concierge support.",
    url: SITE_URL,
    siteName: "ThevillaCamp",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "ThevillaCamp Luxury Stays and Camping",
      },
    ],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    site: "@Thevillacamp",
    creator: "@Thevillacamp",
    title: "ThevillaCamp | Luxury Pool Villas & Lakeside Camping",
    description:
      "Find and book verified private pool villas, Pawna Lake camping tents, and mountain chalets across Maharashtra.",
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
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
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
          <div className="h-screen bg-white w-full flex justify-center items-center">
            <div className="bg-black h-14 w-14 rounded-full flex justify-center items-center">
              <ButtonLoader />
            </div>
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
                    "Maharashtra's premier luxury villa and campsite booking platform",
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
