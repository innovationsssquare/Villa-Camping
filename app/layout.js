import "./globals.css";
import { NextuiProviderWrapper } from "./Nextuiprovider";
import { AuthProvider } from "@/lib/auth-provider";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const metadata = {
  title: "THE VILLA CAMP",
  description: "All your tailoring essential at one place!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased font`}
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
  );
}
