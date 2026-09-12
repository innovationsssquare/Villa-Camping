"use client";
import Navbar from "@/components/Navbarcomponents/Navbar";
import Footer from "@/components/Footercomponents/Footer";
import { BottomNav } from "@/components/Navbarcomponents/Bootomnav";
import { AppHeader } from "@/components/Navbarcomponents/Mobilenav";
import { HeroUIProvider } from "@heroui/react";
import { usePathname } from "next/navigation";
import SplashScreen from "@/components/Homecomponets/SplashScreen";
import { useEffect, useState, Suspense } from "react";
import { ToastProvider } from "@heroui/toast";
import { SocketProvider } from "@/lib/context/SocketProvider";
import BookingParamsSync from "@/components/Bookingcomponent/BookingParamsSync";

const hideChrome = (pathname) => {
  const p = pathname?.toLowerCase() || "";
  return (
    pathname === "/Signin" ||
    pathname === "/shorts" ||
    pathname === "/date-selection" ||
    pathname === "/search-stay" ||
    pathname === "/checkout" ||
    pathname === "/camping-checkout" ||
    pathname === "/search-your-gateway" ||
    p.startsWith("/view-camping") ||
    p.startsWith("/view-cottage") ||
    p.startsWith("/view-hotel") ||
    p.startsWith("/view-villa")
  );
};

const hideMobileHeader = (pathname) =>
  hideChrome(pathname) ||
  pathname === "/account" ||
  pathname === "/wishlist" ||
  pathname === "/account/settings" ||
  pathname === "/notifications" ||
  pathname === "/booking";

export function NextuiProviderWrapper({ children }) {
  const pathname = usePathname();
  const [splashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("thevilla_splash_seen")) {
        setSplashVisible(false);
      }
    } catch {
      setSplashVisible(false);
    }
  }, []);

  const handleSplashComplete = () => {
    try {
      sessionStorage.setItem("thevilla_splash_seen", "1");
    } catch {
      // ignore
    }
    setSplashVisible(false);
  };

  if (splashVisible) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <SocketProvider>
      <HeroUIProvider>
        <Suspense fallback={null}>
          <BookingParamsSync />
        </Suspense>
        {hideChrome(pathname) ? null : <Navbar />}
        {hideMobileHeader(pathname) ? null : <AppHeader />}
        <div className="z-[400]">
          <ToastProvider placement={"top-center"} />
        </div>
        {children}
        {hideChrome(pathname) ? null : <BottomNav />}
        {hideChrome(pathname) || pathname === "/category/all" ? null : (
          <Footer />
        )}
      </HeroUIProvider>
    </SocketProvider>
  );
}
