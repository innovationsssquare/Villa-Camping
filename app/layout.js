import { Providers } from "@/Redux/provider";
import "./globals.css";
import { NextuiProviderWrapper } from "./Nextuiprovider";
import Script from "next/script";
import ConsentGTM from "@/components/Seo/ConsentGTM";
import { ToastProvider } from "@/components/ui/toast-provider";
import { Suspense } from "react";
import ButtonLoader from "@/components/Loadercomponents/button-loader";
import WebPermissionsPrompt from "@/components/Permissions/web-permissions-prompt";
import AIConciergeBot from "@/components/AIConcierge/AIConciergeBot";
import { Inter } from "next/font/google";

const geist = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export const metadata = {
  metadataBase: new URL("https://thevillacamp.com"),
  title: {
    default: "Thevillacamp - your one-stop destination for booking the best villas in lonavala!",
    template: "%s | ThevillaCamp",
  },
  description:
    "Discover the perfect escape with ThevillaCamp, your one-stop destination for booking the best villas, campsites, cottages, and hotels across Lonavala, Malavli, Kamshet, and Pawna Lake.",
  openGraph: {
    title: "ThevillaCamp — Book cottages, hotels & villas",
    description:
      "Find and book curated stays — cottages, villas, hotels and camping experiences near Lonavala and Pawna.",
    url: "https://thevillacamp.com",
    siteName: "ThevillaCamp",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "ThevillaCamp",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ThevillaCamp — stays",
    description:
      "Find and book curated stays — cottages, villas, hotels and camping experiences near Lonavala and Pawna.",
    images: ["/og-default.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: "https://thevillacamp.com",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
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
            <AIConciergeBot />
            {children}
          </ToastProvider>
        </NextuiProviderWrapper>
      </Suspense>
    </Providers>
  );

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
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
                  "@id": "https://thevillacamp.com/#organization",
                  "name": "ThevillaCamp",
                  "url": "https://thevillacamp.com",
                  "logo": "https://thevillacamp.com/og-default.jpg",
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
                  "@id": "https://thevillacamp.com/#website",
                  "url": "https://thevillacamp.com",
                  "name": "ThevillaCamp",
                  "description":
                    "Maharashtra's premier luxury villa and campsite booking platform",
                  "publisher": {
                    "@id": "https://thevillacamp.com/#organization",
                  },
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target":
                      "https://thevillacamp.com/category/all?search={search_term_string}",
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
