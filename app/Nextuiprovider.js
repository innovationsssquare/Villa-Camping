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
import { AuthModalProvider } from "@/context/AuthModalContext";

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
    p.startsWith("/booking/success") ||
    p.startsWith("/view-camping") ||
    p.startsWith("/view-cottage") ||
    p.startsWith("/view-hotel") ||
    p.startsWith("/view-villa")
  );
};

const hideMobileHeader = (pathname) => {
  const p = pathname?.toLowerCase() || "";
  return (
    hideChrome(pathname) ||
    p.startsWith("/booking/success") ||
    pathname === "/account" ||
    pathname === "/wishlist" ||
    pathname === "/account/settings" ||
    pathname === "/notifications" ||
    pathname === "/booking" ||
    pathname?.startsWith("/account/")
  );
};

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
        <AuthModalProvider>
          <Suspense fallback={null}>
            <BookingParamsSync />
          </Suspense>
          {hideChrome(pathname) ? null : <Navbar />}
          {hideMobileHeader(pathname) ? null : <AppHeader />}
          <div className="relative z-[9999]">
            <ToastProvider
              placement="top-center"
              toastOffset={16}
              toastProps={{
                classNames: {
                  base: "max-w-[92vw] sm:max-w-md py-2.5 px-3.5 sm:py-3 sm:px-4 rounded-2xl shadow-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#18181B] text-neutral-900 dark:text-neutral-100 opacity-100",
                  content: "gap-x-2.5 sm:gap-x-3 items-center",
                  title: "text-xs sm:text-sm font-bold tracking-tight text-neutral-900 dark:text-neutral-100 leading-snug",
                  description: "text-[11px] sm:text-xs text-neutral-600 dark:text-neutral-400 leading-normal mt-0.5",
                  icon: "w-4 h-4 sm:w-5 sm:h-5 shrink-0",
                  loadingComponent: "w-4 h-4 sm:w-5 sm:h-5 shrink-0",
                  closeButton: "w-5 h-5 -right-1 -top-1 sm:-right-2 sm:-top-2 text-xs text-neutral-500",
                },
              }}
            />
          </div>
          {children}
          {hideChrome(pathname) ? null : <BottomNav />}
          {hideChrome(pathname) || pathname === "/category/all" ? null : (
            <Footer />
          )}
        </AuthModalProvider>
      </HeroUIProvider>
    </SocketProvider>
  );
}
