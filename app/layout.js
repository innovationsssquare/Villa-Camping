import { Providers } from "@/Redux/provider";
import "./globals.css";
import { NextuiProviderWrapper } from "./Nextuiprovider";
import { AuthProvider } from "@/lib/auth-provider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Script from "next/script";
import { ToastProvider } from "@/components/ui/toast-provider";
import { Suspense } from "react";
import ButtonLoader from "@/components/Loadercomponents/button-loader";

export const metadata = {
  title: "THE VILLA CAMP",
  description:
    "Discover the perfect escape with ThevillaCamp, your one-stop destination for booking the best villas, campsites, cottages, and hotels across Lonavala, Malavli, Kamshet, and Pawna Lake. Whether you're planning a relaxing family vacation, a romantic weekend, or an adventurous trip with friends, we offer handpicked stays nestled in nature with modern comforts",
};

export default function RootLayout({ children }) {
  return (
    <Providers>
      <html lang="en" suppressHydrationWarning>
        <head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
          />
        </head>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />

        <body
          className={``}
          style={{
            fontFamily:
              'Airbnb Cereal VF, Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
          }}
        >
          <Suspense
            fallback={
              <div className="h-screen w-full flex justify-center items-center">
                <div className="bg-black h-14 w-14 rounded-full flex justify-center items-center">
                  <ButtonLoader />
                </div>
              </div>
            }
          >
            <NextuiProviderWrapper>
              <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID}>
                <ToastProvider>{children}</ToastProvider>
              </GoogleOAuthProvider>
            </NextuiProviderWrapper>
          </Suspense>
        </body>
      </html>
    </Providers>
  );
}
