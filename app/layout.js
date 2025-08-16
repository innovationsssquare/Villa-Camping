import { Providers } from "@/Redux/provider";
import "./globals.css";
import { NextuiProviderWrapper } from "./Nextuiprovider";
import { AuthProvider } from "@/lib/auth-provider";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const metadata = {
  title: "THE VILLA CAMP",
  description: "Discover the perfect escape with ThevillaCamp, your one-stop destination for booking the best villas, campsites, cottages, and hotels across Lonavala, Malavli, Kamshet, and Pawna Lake. Whether you're planning a relaxing family vacation, a romantic weekend, or an adventurous trip with friends, we offer handpicked stays nestled in nature with modern comforts",
};

export default function RootLayout({ children }) {
  return (
     <Providers>
    <html lang="en" suppressHydrationWarning>
      <body
        className={``}
        style={{
          fontFamily:
            'Airbnb Cereal VF, Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
        }}
      >
        <NextuiProviderWrapper>
          <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID}>
            {children}
          </GoogleOAuthProvider>
        </NextuiProviderWrapper>
      </body>
    </html>

     </Providers>
  );
}
